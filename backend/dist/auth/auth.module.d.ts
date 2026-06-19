import { JwtService } from '@nestjs/jwt';
import { LdapService } from '../ldap/ldap.service';
export declare class LoginDto {
    username: string;
    password: string;
}
export declare class AuthService {
    private readonly ldap;
    private readonly jwt;
    constructor(ldap: LdapService, jwt: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            username: string;
            displayName: string;
            email: string;
            department: string;
            dn: string;
            groups: string[];
        };
    }>;
}
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            username: string;
            displayName: string;
            email: string;
            department: string;
            dn: string;
            groups: string[];
        };
    }>;
}
export declare class AuthModule {
}
