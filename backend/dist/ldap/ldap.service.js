"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var LdapService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LdapService = void 0;
const common_1 = require("@nestjs/common");
const ldapts_1 = require("ldapts");
let LdapService = LdapService_1 = class LdapService {
    constructor() {
        this.logger = new common_1.Logger(LdapService_1.name);
    }
    get config() {
        return {
            url: process.env.LDAP_URL,
            baseDN: process.env.LDAP_BASE_DN,
            bindDN: process.env.LDAP_BIND_DN,
            bindPassword: process.env.LDAP_BIND_PASSWORD,
        };
    }
    async authenticate(username, password) {
        const { url, baseDN, bindDN, bindPassword } = this.config;
        const readerClient = new ldapts_1.Client({ url, tlsOptions: { rejectUnauthorized: false } });
        try {
            await readerClient.bind(bindDN, bindPassword);
            const { searchEntries } = await readerClient.search(baseDN, {
                scope: 'sub',
                filter: `(|(sAMAccountName=${username})(uid=${username}))`,
                attributes: ['dn', 'cn', 'displayName', 'mail', 'department', 'memberOf', 'sAMAccountName', 'uid'],
            });
            if (!searchEntries.length) {
                throw new common_1.UnauthorizedException('Usuario no encontrado en el directorio.');
            }
            const entry = searchEntries[0];
            const userDN = entry.dn;
            const userClient = new ldapts_1.Client({ url, tlsOptions: { rejectUnauthorized: false } });
            try {
                await userClient.bind(userDN, password);
            }
            catch {
                throw new common_1.UnauthorizedException('Contraseña incorrecta.');
            }
            finally {
                await userClient.unbind().catch(() => { });
            }
            const memberOf = entry.memberOf ?? [];
            const groups = (Array.isArray(memberOf) ? memberOf : [memberOf])
                .map((g) => g.split(',')[0].replace('CN=', '').replace('cn=', ''));
            return {
                dn: userDN,
                username: (entry.sAMAccountName || entry.uid || username),
                displayName: (entry.displayName || entry.cn || username),
                email: (entry.mail || ''),
                department: (entry.department || ''),
                groups,
            };
        }
        catch (err) {
            if (err instanceof common_1.UnauthorizedException)
                throw err;
            this.logger.error('LDAP error', err);
            throw new common_1.UnauthorizedException('No se pudo conectar con el servidor LDAP. Verificá la configuración.');
        }
        finally {
            await readerClient.unbind().catch(() => { });
        }
    }
};
exports.LdapService = LdapService;
exports.LdapService = LdapService = LdapService_1 = __decorate([
    (0, common_1.Injectable)()
], LdapService);
//# sourceMappingURL=ldap.service.js.map