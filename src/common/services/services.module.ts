import { Module } from '@nestjs/common';
import { EmailService } from './email/email.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { FirebaseService } from './firebase/firebase.service';
import emailConfig from '../config/email.config';

@Module({
  imports: [ConfigModule.forFeature(emailConfig)],
  providers: [EmailService, CloudinaryService, FirebaseService],
  exports: [EmailService, FirebaseService, CloudinaryService],
})
export class ServicesModule {}
