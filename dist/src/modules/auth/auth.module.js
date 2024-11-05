"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const auth_controller_1 = require("./auth.controller");
const mongoose_1 = require("@nestjs/mongoose");
const auth_schema_1 = require("./entities/auth.schema");
const roles_controller_1 = require("./roles.controller");
const roles_service_1 = require("./roles.service");
const auth_repository_1 = require("./entities/auth.repository");
const passport_1 = require("@nestjs/passport");
const jwt_1 = require("@nestjs/jwt");
const users_module_1 = require("../users/users.module");
const jwt_strategy_1 = require("./jwt.strategy");
const services_module_1 = require("../../common/services/services.module");
const roles_guard_1 = require("./guards/roles.guard");
const config_1 = require("@nestjs/config");
const google_strategy_1 = require("./google.strategy");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: '600000m' },
                }),
            }),
            mongoose_1.MongooseModule.forFeature([{ name: auth_schema_1.Role.name, schema: auth_schema_1.RoleSchema }]),
            users_module_1.UsersModule,
            services_module_1.ServicesModule,
        ],
        exports: [auth_service_1.AuthService, roles_service_1.RolesService, auth_repository_1.RoleRepository],
        controllers: [auth_controller_1.AuthController, roles_controller_1.RolesController],
        providers: [
            auth_service_1.AuthService,
            roles_service_1.RolesService,
            auth_repository_1.RoleRepository,
            jwt_strategy_1.JwtStrategy,
            roles_guard_1.RolesGuard,
            google_strategy_1.GoogleStrategy,
        ],
    })
], AuthModule);
