import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Roles } from '../../../auth/decorators/auth.decorator';
import { ROLES } from '../../../auth/interfaces';
import { RolesGuard } from '../../../auth/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { AddonsService } from '../../services/addons/addons.service';
import { CreateAddonDto } from '../../dto/create-subscription.dto';
import { UpdateAddonDto } from '../../dto/update-subscription.dto';

@Controller('addons')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddonsController {
  constructor(private readonly addonService: AddonsService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  create(
    @Body() payload: CreateAddonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    console.log(payload);
    return this.addonService.create(payload, image);
  }

  @Get()
  @Roles(ROLES.SuperAdmin, ROLES.User)
  findAll(@Query() payload: any) {
    const { page, limit, sort, ...others } = payload;
    return this.addonService.findAll({
      page: page,
      limit: limit,
      sort: sort,
      conditions: { ...others },
    });
  }

  @Get(':id')
  @Roles(ROLES.SuperAdmin, ROLES.User)
  findOne(@Param('id') id: any) {
    return this.addonService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    }),
  )
  @Roles(ROLES.SuperAdmin)
  update(
    @Param('id') id: any,
    @Body() payload: UpdateAddonDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.addonService.update(id, payload, image);
  }

  @Delete(':id')
  @Roles(ROLES.SuperAdmin)
  remove(@Param('id') id: any) {
    return this.addonService.remove(id);
  }
}
