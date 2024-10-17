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
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { EmailService } from 'src/common/services/email/email.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
  ) {}
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

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findByEmail(email, password);
      if (user) {
        return await this.login(user);
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

  async login(user: any) {
    const payload = {
      email: user.email,
      sub: user._id,
      role: user.roles,
    };
    user.password = '';

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
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Token verification failed or expired');
      }

      const user = await this.userService.findUserByToken(payload.token);
      if (!user || user.authToken === null) {
        throw new NotFoundException('Verification failed, please try again');
      }

      const newToken = this.jwtService.sign(
        { email: user.email, sub: user.id },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '3h', // Token expires in 3 hours
        },
      );

      await this.userService.update(user.id, { authToken: null });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Verification successful',
        data: newToken,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async resetPassword(token: string, payload: any): Promise<any> {
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      if (!decoded) {
        throw new UnauthorizedException('Session expired please try again');
      }

      const user = await this.userService.findUserByEmail(token);
      if (!user) {
        throw new NotFoundException('User not found');
      }
      await this.userService.update(user.id, { password: payload.password });

      return {
        statusCode: HttpStatus.NO_CONTENT,
        message: 'Password reset successfully',
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
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
