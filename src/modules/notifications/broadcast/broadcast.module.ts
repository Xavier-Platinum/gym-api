import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { BroadcastController } from './broadcast.controller';
import { BroadcastRepository } from './entities/broadcast.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Broadcast, BroadcastSchema } from './entities/broadcast.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Broadcast.name, schema: BroadcastSchema },
    ]),
  ],
  controllers: [BroadcastController],
  providers: [BroadcastService, BroadcastRepository],
  exports: [BroadcastService],
})
export class BroadcastModule {}
