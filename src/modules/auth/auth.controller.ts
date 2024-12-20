/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  // UnauthorizedException,
  BadRequestException,
  HttpCode,
  UseGuards,
  Request,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  CreateAuthDto,
  ResendOtpDto,
  ValidateUserDto,
  VerifyOtpDto,
} from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './auth.decorator';
import { ROLES } from './interfaces';
import { RolesGuard } from './guards/roles.guard';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('/register')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async register(@Body() payload: CreateUserDto) {
    return await this.authService.register(payload);
  }

  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async registerSuperAdmin(@Body() payload: CreateUserDto) {
    return await this.authService.register(payload);
  }

  @Post('/protected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async getProtected(@Request() req: any) {
    return {
      message: 'This is a protected route!',
      user: req.user,
    };
  }

  @Post('/validate-user')
  @HttpCode(200)
  async validateUser(@Body() payload: ValidateUserDto) {
    return this.authService.validateUser(
      payload?.email,
      payload?.password,
      payload?.deviceToken,
    );
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload: ValidateUserDto | any) {
    return this.authService.validateUser(
      payload?.email,
      payload?.password,
      payload?.deviceToken,
    );
  }

  @Post('/forgotPassword')
  async forgotPassword(@Body() payload: { email: string } | any) {
    return this.authService.forgotPassword(payload?.email);
  }

  @Post('/verifyToken')
  async verifyToken(
    @Body() payload: { token: string } | any,
    @Req() req: Request,
  ) {
    const token = req.headers?.['auth-token'] as string;

    if (!token) {
      throw new BadRequestException('auth-token header is required');
    }

    return this.authService.verifyToken(token, payload);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() payload: { password: string } | any,
    @Req() req: Request,
  ) {
    const token = req.headers?.['auth-token'] as string;

    if (!token) {
      throw new HttpException('auth-token header is required', 400);
    }

    return this.authService.resetPassword(token, payload);
  }

  @Post('/verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const { otp } = verifyOtpDto;
    const isValid = await this.authService.verifyOtp(otp);

    if (isValid) {
      return {
        statusCode: HttpStatus.OK,
        message: 'OTP verified successfully.',
        data: {},
      };
    }
  }

  @Post('/resend-otp')
  @HttpCode(200)
  async resendOtp(@Body() payload: ResendOtpDto) {
    const email = payload.email;
    const newOtp = await this.authService.resendOtp(email);

    if (newOtp) {
      return {
        statusCode: HttpStatus.OK,
        message: 'A new OTP has been sent to your email.',
        data: {}, // Only for development/debugging purposes, remove this in production
      };
    }
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // Guard will redirect to Google, nothing to do here
  }

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req, @Res() res) {
    console.log('GOOGLE USER ', req.user);
    const { email, fullName, googleId, ProfilePicture, phoneNumber } = req.user;
    console.log(
      'GOOGLE USER>>>>>> ',
      email,
      fullName,
      googleId,
      ProfilePicture,
      phoneNumber,
    );
    const jwt = await this.authService.validateOAuthLogin(
      email,
      fullName,
      googleId,
      ProfilePicture,
      phoneNumber,
    );

    res.redirect(`/login/success?token=${jwt}`);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: any, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: any) {
    return this.authService.remove(id);
  }
}
