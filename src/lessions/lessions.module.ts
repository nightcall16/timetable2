import { Module } from '@nestjs/common';
import { LessionsController } from './lessions.controller';
import { LessionsService } from './lessions.service';

@Module({
  controllers: [LessionsController],
  providers: [LessionsService],
})
export class LessionsModule {}
