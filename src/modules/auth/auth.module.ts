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

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey',
      signOptions: { expiresIn: '1h' },
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
  ],
})
export class AuthModule {}
