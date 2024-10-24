import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PackagesService } from '../../services/packages/packages.service';
import { CreateSubscribeDto } from '../../dto/create-user.dto';
import { Roles } from '../../../auth/decorators/auth.decorator';
import { ROLES } from '../../../auth/interfaces';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('packages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PackagesController {
  constructor(private readonly packagesService: PackagesService) {}

  @Post('subscribe')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async subscribe(@Body() payload: CreateSubscribeDto, @Req() req: Request) {
    const user = req.user as any;
    return await this.packagesService.create(payload, user?._id);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  async getUserSubscriptions(@Req() req: Request) {
    const user = req.user as any;
    return await this.packagesService.getUserSubscriptions(user?._id);
  }
}
