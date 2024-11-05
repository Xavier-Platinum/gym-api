"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const utils_filter_1 = require("./common/utils/utils.filter");
const common_1 = require("@nestjs/common");
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: '*',
        credentials: true,
    });
    app.use((0, express_session_1.default)({
        secret: configService.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.setGlobalPrefix('/api/v1', {});
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new utils_filter_1.HttpExceptionFilter());
    const port = configService.get('PORT') || 3001;
    await app.listen(port || 3001, '0.0.0.0');
}
bootstrap();
