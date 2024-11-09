import { Module } from '@nestjs/common';
import { BroadcastService } from './broadcast.service';
import { BroadcastController } from './broadcast.controller';

@Module({
  controllers: [BroadcastController],
  providers: [BroadcastService],
})
export class BroadcastModule {}
