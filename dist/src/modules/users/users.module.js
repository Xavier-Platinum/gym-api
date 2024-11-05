"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("./users.service");
const users_controller_1 = require("./users.controller");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./entities/user.schema");
const user_repository_1 = require("./entities/user.repository");
const auth_module_1 = require("../auth/auth.module");
const services_module_1 = require("../../common/services/services.module");
const cloudinary_service_1 = require("../../common/services/cloudinary/cloudinary.service");
const packages_service_1 = require("./services/packages/packages.service");
const packages_controller_1 = require("./controllers/packages/packages.controller");
const subscriptions_module_1 = require("../subscriptions/subscriptions.module");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: user_schema_1.UserPackage.name, schema: user_schema_1.UserPackageSchema },
            ]),
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            services_module_1.ServicesModule,
            subscriptions_module_1.SubscriptionsModule,
        ],
        controllers: [users_controller_1.UsersController, packages_controller_1.PackagesController],
        providers: [
            users_service_1.UsersService,
            user_repository_1.UserRepository,
            cloudinary_service_1.CloudinaryService,
            packages_service_1.PackagesService,
            user_repository_1.UserPackageRepository,
        ],
        exports: [
            users_service_1.UsersService,
            user_repository_1.UserRepository,
            cloudinary_service_1.CloudinaryService,
            user_repository_1.UserPackageRepository,
            packages_service_1.PackagesService,
        ],
    })
], UsersModule);
