"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = exports.AuthController = exports.AuthService = exports.LoginDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const class_validator_1 = require("class-validator");
const ldap_service_1 = require("../ldap/ldap.service");
class LoginDto {
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "username", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], LoginDto.prototype, "password", void 0);
let AuthService = class AuthService {
    constructor(ldap, jwt) {
        this.ldap = ldap;
        this.jwt = jwt;
    }
    async login(dto) {
        const user = await this.ldap.authenticate(dto.username, dto.password);
        const payload = {
            sub: user.username,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            department: user.department,
            groups: user.groups,
        };
        const access_token = this.jwt.sign(payload);
        return {
            access_token,
            user: {
                username: user.username,
                displayName: user.displayName,
                email: user.email,
                department: user.department,
                dn: user.dn,
                groups: user.groups,
            },
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ldap_service_1.LdapService,
        jwt_1.JwtService])
], AuthService);
let AuthController = class AuthController {
    constructor(auth) {
        this.auth = auth;
    }
    login(dto) {
        return this.auth.login(dto);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "login", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET || 'change-me',
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '8h' },
            }),
        ],
        controllers: [AuthController],
        providers: [AuthService, ldap_service_1.LdapService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map