/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ObjectId } from 'mongoose';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/common/services/email/email.service';
import { ConfigService } from '@nestjs/config';
import { CloudinaryService } from 'src/common/services/cloudinary/cloudinary.service';
import moment from 'moment';
import { UserRepository } from '../users/entities/user.repository';
import { RoleRepository } from './entities/auth.repository';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
    private readonly uploadService: CloudinaryService,
    private readonly userRepository: UserRepository,
    private readonly rolesRepository: RoleRepository,
  ) {}

  private otps: Map<string, { otp: string; expiration: Date; email: string }> =
    new Map();

  generateOtp(): string {
    const now = new Date();
    const otp = (now.getTime() % 1000000).toString().padStart(6, '0');
    return otp;
  }

  async sendOtp(email: string): Promise<any> {
    const otp = this.generateOtp();
    const expiration = moment().add(10, 'minutes').toDate();
    this.otps.set(otp, { otp, expiration, email });

    await this.userService.updateOtp(email, { secretToken: otp.toString() });

    console.log(`Sending OTP ${otp} to email: ${email}`);

    return otp;
  }

  // Verify OTP
  async verifyOtp(otp: string): Promise<boolean> {
    const record = this.otps.get(otp);

    if (!record) {
      throw new BadRequestException('No OTP was sent to this email.');
    }

    const { otp: savedOtp, expiration, email: savedEmail } = record;

    if (moment().isAfter(expiration)) {
      this.otps.delete(savedOtp);
      throw new BadRequestException('OTP has expired.');
    }

    if (savedOtp !== otp) {
      throw new BadRequestException('Invalid OTP.');
    }

    await this.userService.updateOtp(savedEmail, {
      secretToken: 'null',
      status: 'active',
      confirmed: true,
    });

    await this.emailService.sendMail(
      savedEmail,
      'Verification successful',
      'Your account has been verified successfully',
      `<div>
        <h1>Your account has been verified successfully.</h1>
      </div>`,
      // attachments,
    );

    // Remove OTP after successful verification
    this.otps.delete(savedOtp);
    return true;
  }

  async register(payload: CreateUserDto) {
    try {
      const isEmailExist = await this.userRepository.exists({
        $or: [
          { email: payload?.email },
          // { fullName: payload?.fullName },
          // { phoneNumber: payload?.phoneNumber },
        ],
      });

      const isPhoneExist = await this.userRepository.exists({
        $or: [
          // { email: payload?.email },
          // { fullName: payload?.fullName },
          { phoneNumber: payload?.phoneNumber },
        ],
      });

      if (isEmailExist) {
        throw new BadRequestException('This email already exists');
      }

      if (isPhoneExist) {
        throw new BadRequestException('This phone number already exists');
      }

      const role = await this.rolesRepository.byQuery({ name: 'User' });

      // TODO: Implement attachments
      const attachments = [
        // {
        //   filename: 'example.pdf',
        //   path: './path-to-file/example.pdf',
        // },
        // {
        //   filename: 'image.png',
        //   path: './path-to-image/image.png',
        //   cid: 'unique@image.cid',
        // },
      ];

      const user = await this.userRepository.create({
        ...payload,
        roles: [
          {
            roleId: role.id,
            customPermissions: [],
          },
        ],
        // secretToken: otp.toString(),
        // status: 'pending',
        // confirmed: false,
      });
      const otp = await this.sendOtp(payload?.email);
      await this.emailService.sendMail(
        payload?.email,
        'Registration successful',
        'Your account has been registered successfully',
        `<div>
          <h1>Your account has been registered successfully.</h1>
          <p>To verify your email, please use the token below</p>
          <span>${otp}</span>
        </div>`,
        // attachments,
      );

      return {
        statusCode: HttpStatus.CREATED,
        message:
          'User created successfully, please verify account with token sent to your email',
        // data: user,
      };
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  // Resend OTP
  async resendOtp(email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user?.confirmed) {
      // check status also
      throw new BadRequestException('User has already confirmed their email.');
    }

    const record = this.otps.get(email);
    if (record && moment().isBefore(record.expiration)) {
      throw new BadRequestException(
        'You can only request a new OTP after the previous one expires.',
      );
    }

    // Generate and send new OTP
    return await this.sendOtp(email);
  }

  async validateOAuthLogin(
    email: string,
    fullName: string,
    googleId: any,
    ProfilePicture: any,
    phoneNumber: string,
    firstName?: string,
    profilePictureMetaData?: any,
    lastName?: string,
    accessToken?: any,
    refreshToken?: any,
  ): Promise<any> {
    try {
      const user = await this.userService.findUserByEmail(email);

      if (!user) {
        // If the user doesn't exist, create a new one
        const newUser = await this.userService.create({
          email,
          fullName,
          googleId,
          ProfilePicture,
          phoneNumber,
          // accessToken,
          // refreshToken,
          password: '',
        });
        return {
          statusCode: HttpStatus.OK,
          message: 'Successfully signed up',
          data: {
            accessToken: this.jwtService.sign(
              {
                email: newUser?.data?.email,
                sub: newUser?.data?._id,
                role: newUser?.data?.roles,
              },
              {
                secret: this.configService.get<string>('JWT_SECRET'),
              },
            ),
            user,
          },
        };
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Successfully signed in',
        data: {
          accessToken: this.jwtService.sign(
            {
              email: user.email,
              sub: user._id,
              role: user.roles,
            },
            {
              secret: this.configService.get<string>('JWT_SECRET'),
            },
          ),
          user,
        },
      };
    } catch (err) {
      throw new BadRequestException('Failed to validate OAuth login');
    }
  }

  async create(payload: CreateAuthDto) {
    try {
      return 'This action adds a new auth';
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async validateUser(
    email: string,
    password: string,
    deviceToken: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email, password);
      if (user) {
        return await this.login(user, deviceToken);
      }
      throw new UnauthorizedException();
    } catch (error) {
      if (error instanceof HttpException) {
        throw new BadRequestException(error?.message);
      } else {
        throw new HttpException(error?.message, error?.statusCode);
      }
    }
  }

  async login(user: any, deviceToken: string) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.roles,
    };
    user.password = '';

    await this.userRepository.findAndUpdate(
      { email: user?.email },
      {
        $set: {
          deviceToken: deviceToken,
        },
      },
    );

    return {
      status: HttpStatus.OK,
      message: 'Login successful',
      data: {
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('JWT_SECRET'),
        }),
        user: user,
      },
    };
  }

  private generateToken(): string {
    const token = Math.floor(100000 + Math.random() * 900000);
    return token.toString();
  }

  async forgotPassword(email: string): Promise<any> {
    try {
      if (!email) {
        throw new HttpException('Email is required', 400);
      }

      const user = await this.userService.findUserByEmail(email);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const authToken = this.generateToken();

      const token = this.jwtService.sign(
        { email: user.email, sub: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '10m', // Token expires in 10 minutes
        },
      );

      await this.userService.update(user?._id, { authToken });
      await this.emailService.sendMail(
        user?.email,
        'Reset Password',
        'You requested to reset your password use this token to reset your password token: ' +
          authToken,
        `<h1>You requested to reset your password.</h1><p>Use this token to reset your password: <strong>${authToken}</strong></p>`,
        // attachments,
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Otp has been sent to your email to reset your password',
        data: token,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async verifyToken(token: string, payload: any): Promise<any> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded) {
        throw new HttpException('Token verification failed or expired', 400);
      }

      const user = await this.userService.findUserByEmail(decoded.email);

      if (!user || user.authToken === 'null') {
        throw new NotFoundException('Verification failed, please try again');
      }

      const newToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '3h', // Token expires in 3 hours
        },
      );

      await this.userRepository.findAndUpdate(user?._id, {
        $set: { authToken: 'null' },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Verification successful',
        data: newToken,
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error?.message === 'jwt expired') {
          throw new HttpException('Token session expired.', 400);
        }
        throw new HttpException(error?.message, 400);
      }
      if (
        error instanceof HttpException ||
        error.message === 'User not found'
      ) {
        throw new HttpException('Verification failed or invalid token', 400);
      }
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(token: string, payload: any): Promise<any> {
    try {
      if (!token) {
        throw new HttpException('auth-token header is required', 400);
      }

      if (!payload.password) {
        throw new HttpException('password is required', 400);
      }

      const decoded = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded) {
        throw new HttpException('Session expired please try again', 400);
      }

      const user = await this.userRepository.byQuery({ email: decoded?.email });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userRepository.findAndUpdate(user._id, {
        $set: { password: payload.password },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof JsonWebTokenError) {
        if (error?.message === 'jwt expired') {
          throw new HttpException('Session expired please try again.', 400);
        }
        throw new HttpException(error?.message, 400);
      }
      if (
        error instanceof HttpException ||
        error.message === 'User not found'
      ) {
        throw new HttpException('Verification failed or invalid token', 400);
      }
      throw new InternalServerErrorException();
    }
  }

  async changePassword(
    userId: any,
    oldPassword: string,
    newPassword: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findOne(userId);

      if (!user || !(await user.data.comparePassword(oldPassword))) {
        throw new UnauthorizedException('Old password is incorrect');
      }

      await this.userService.update(userId, { password: newPassword });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Password changed successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    return `This action returns all auth`;
  }

  async findOne(id: any) {
    return `This action returns a #${id} auth`;
  }

  async update(id: any, payload: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  async remove(id: any) {
    return `This action removes a #${id} auth`;
  }
}
