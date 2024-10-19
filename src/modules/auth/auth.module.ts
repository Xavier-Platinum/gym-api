import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './entities/auth.schema';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { RoleRepository } from './entities/auth.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { ServicesModule } from 'src/common/services/services.module';
import { RolesGuard } from './guards/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
    }),
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    UsersModule,
    ServicesModule,
  ],
  exports: [AuthService, RolesService, RoleRepository],
  controllers: [AuthController, RolesController],
  providers: [
    AuthService,
    RolesService,
    RoleRepository,
    JwtStrategy,
    RolesGuard,
    // EmailService,
  ],
})
export class AuthModule {}
