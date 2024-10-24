import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserPackage,
  UserPackageSchema,
  UserSchema,
} from './entities/user.schema';
import {
  UserPackageRepository,
  UserRepository,
} from './entities/user.repository';
import { AuthModule } from '../auth/auth.module';
import { ServicesModule } from 'src/common/services/services.module';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import { PackagesService } from './services/packages/packages.service';
import { PackagesController } from './controllers/packages/packages.controller';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserPackage.name, schema: UserPackageSchema },
    ]),
    forwardRef(() => AuthModule),
    ServicesModule,
    SubscriptionsModule,
  ],
  controllers: [UsersController, PackagesController],
  providers: [
    UsersService,
    UserRepository,
    CloudinaryService,
    PackagesService,
    UserPackageRepository,
  ],
  exports: [
    UsersService,
    UserRepository,
    CloudinaryService,
    UserPackageRepository,
  ],
})
export class UsersModule {}
