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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, ValidateUserDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './auth.decorator';
import { ROLES } from './interfaces';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Post('protected')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async getProtected(@Request() req: any) {
    return {
      message: 'This is a protected route!',
      user: req.user,
    };
  }

  @Post('/validate-user')
  @HttpCode(200)
  async validateUser(@Body() payload: ValidateUserDto) {
    return this.authService.validateUser(payload?.email, payload?.password);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() payload: ValidateUserDto | any) {
    return this.authService.validateUser(payload?.email, payload?.password);
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
    console.log(token);

    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return this.authService.verifyToken(token, payload);
  }

  @Post('/resetPassword')
  async resetPassword(
    @Body() payload: { password: string } | any,
    @Req() req: Request,
  ) {
    const token = req.headers?.['auth-token'] as string;
    console.log(token);

    if (!token) {
      throw new BadRequestException('Token is required');
    }

    return this.authService.resetPassword(token, payload);
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
