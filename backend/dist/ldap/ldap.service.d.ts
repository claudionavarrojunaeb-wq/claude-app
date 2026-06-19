export interface LdapUser {
    dn: string;
    username: string;
    displayName: string;
    email: string;
    department: string;
    groups: string[];
}
export declare class LdapService {
    private readonly logger;
    private get config();
    authenticate(username: string, password: string): Promise<LdapUser>;
}
