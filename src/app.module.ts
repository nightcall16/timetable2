import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LessionsModule } from './lessions/lessions.module';

@Module({
  imports: [AuthModule, LessionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
