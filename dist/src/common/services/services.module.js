"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesModule = void 0;
const common_1 = require("@nestjs/common");
const email_service_1 = require("./email/email.service");
const config_1 = require("@nestjs/config");
const cloudinary_service_1 = require("./cloudinary/cloudinary.service");
const firebase_service_1 = require("./firebase/firebase.service");
const email_config_1 = __importDefault(require("../config/email.config"));
let ServicesModule = class ServicesModule {
};
exports.ServicesModule = ServicesModule;
exports.ServicesModule = ServicesModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule.forFeature(email_config_1.default)],
        providers: [email_service_1.EmailService, cloudinary_service_1.CloudinaryService, firebase_service_1.FirebaseService],
        exports: [email_service_1.EmailService, firebase_service_1.FirebaseService, cloudinary_service_1.CloudinaryService],
    })
], ServicesModule);
