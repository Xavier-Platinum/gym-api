import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    console.log('Google profile', profile);
    const { name, emails, photos, id, displayName } = profile;
    const user = {
      email: emails[0].value,
      fullName: name.givenName + ' ' + name.familyName,
      firstName: name.givenName,
      googleId: id,
      ProfilePicture: photos[0].value,
      profilePictureMetaData: photos[0].value,
      lastName: name.familyName,
      phoneNumber: displayName,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}
