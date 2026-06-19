import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Client } from 'ldapts';

export interface LdapUser {
  dn: string;
  username: string;
  displayName: string;
  email: string;
  department: string;
  groups: string[];
}

@Injectable()
export class LdapService {
  private readonly logger = new Logger(LdapService.name);

  private get config() {
    return {
      url:          process.env.LDAP_URL,
      baseDN:       process.env.LDAP_BASE_DN,
      bindDN:       process.env.LDAP_BIND_DN,
      bindPassword: process.env.LDAP_BIND_PASSWORD,
    };
  }

  /**
   * Authenticate a user against LDAP.
   * Strategy:
   *   1. Bind with the reader account to find the user DN.
   *   2. Attempt a bind with the user DN + provided password.
   */
  async authenticate(username: string, password: string): Promise<LdapUser> {
    const { url, baseDN, bindDN, bindPassword } = this.config;

    // Step 1 — find user DN
    const readerClient = new Client({ url, tlsOptions: { rejectUnauthorized: false } });
    try {
      await readerClient.bind(bindDN, bindPassword);

      const { searchEntries } = await readerClient.search(baseDN, {
        scope:  'sub',
        filter: `(|(sAMAccountName=${username})(uid=${username}))`,
        attributes: ['dn', 'cn', 'displayName', 'mail', 'department', 'memberOf', 'sAMAccountName', 'uid'],
      });

      if (!searchEntries.length) {
        throw new UnauthorizedException('Usuario no encontrado en el directorio.');
      }

      const entry  = searchEntries[0];
      const userDN = entry.dn;

      // Step 2 — bind as user to verify password
      const userClient = new Client({ url, tlsOptions: { rejectUnauthorized: false } });
      try {
        await userClient.bind(userDN, password);
      } catch {
        throw new UnauthorizedException('Contraseña incorrecta.');
      } finally {
        await userClient.unbind().catch(() => {});
      }

      // Extract groups
      const memberOf = entry.memberOf ?? [];
      const groups   = (Array.isArray(memberOf) ? memberOf : [memberOf])
        .map((g: string) => g.split(',')[0].replace('CN=', '').replace('cn=', ''));

      return {
        dn:          userDN,
        username:    (entry.sAMAccountName || entry.uid || username) as string,
        displayName: (entry.displayName || entry.cn || username) as string,
        email:       (entry.mail || '') as string,
        department:  (entry.department || '') as string,
        groups,
      };
    } catch (err) {
      if (err instanceof UnauthorizedException) throw err;
      this.logger.error('LDAP error', err);
      throw new UnauthorizedException(
        'No se pudo conectar con el servidor LDAP. Verificá la configuración.',
      );
    } finally {
      await readerClient.unbind().catch(() => {});
    }
  }
}
