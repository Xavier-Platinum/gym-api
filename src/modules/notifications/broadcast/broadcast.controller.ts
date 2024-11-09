import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { CreateBroadcastDto } from './dto/create-broadcast.dto';
import { UpdateBroadcastDto } from './dto/update-broadcast.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/auth.decorator';
import { ROLES } from '../../auth/interfaces';

@Controller('broadcast')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BroadcastController {
  constructor(private readonly broadcastService: BroadcastService) {}

  @Post()
  @Roles(ROLES.SuperAdmin, ROLES.Admin)
  async createBroadcast(
    @Body() createBroadcastDto: CreateBroadcastDto,
  ): Promise<any> {
    const broadcast =
      await this.broadcastService.createBroadcast(createBroadcastDto);
    if (broadcast.scheduledAt) {
      await this.broadcastService.scheduleBroadcast(broadcast);
    }
    return broadcast;
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async getBroadcastById(@Param('id') id: string): Promise<any> {
    return this.broadcastService.getBroadcastById(id);
  }

  @Put(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async updateBroadcast(
    @Param('id') id: string,
    @Body() updateBroadcastDto: UpdateBroadcastDto,
  ): Promise<any> {
    return this.broadcastService.updateBroadcast(id, updateBroadcastDto);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  async deleteBroadcast(@Param('id') id: string): Promise<any> {
    return this.broadcastService.deleteBroadcast(id);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User, ROLES.Admin)
  async getAllBroadcasts(): Promise<any> {
    return this.broadcastService.getAllBroadcasts();
  }
}
