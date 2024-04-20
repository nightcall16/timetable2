import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LessionsService } from './lessions.service';
import { PrismaClient } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request, Response } from 'express';
import { lession } from './interfaces';

@Controller('api')
export class LessionsController {
  constructor(
    private readonly lessionsService: LessionsService,
    private readonly prisma: PrismaClient,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add-lession')
  async addLession(
    @Body('lessionName') lessionName: string,
    @Body('teacher') teacher: string,
    @Body('startsAt') startsAt: string,
    @Body('endsAt') endsAt: string,
    @Body('classroomNumber') classroomNumber: number,
    @Body('groupNumber') groupNumber: number,
    @Body('faculty') faculty: string,
    @Res() response: Response,
  ) {
    try {
      if (
        !lessionName ||
        !teacher ||
        !startsAt ||
        !endsAt ||
        !classroomNumber ||
        !groupNumber ||
        !faculty
      ) {
        return response.status(400).json({
          error: 'какое-то из обязательных свойств для занятия пропущено',
        });
      }

      const lession = await this.lessionsService.addLession(
        lessionName,
        teacher,
        startsAt,
        endsAt,
        classroomNumber,
        groupNumber,
        faculty,
      );

      return response.status(200).json({
        lession,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  @Get('take-lessions/:faculty?/:groupNumber?')
  async takeLessions(
    @Param('faculty') faculty: string,
    @Param('groupNumber') groupNumber: string,
    @Res() response: Response,
  ) {
    try {
      const result = await this.lessionsService.takeLessions(
        faculty,
        groupNumber,
      );

      return response.status(200).json({
        result,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }

  @Get('faculties')
  async faculties(@Res() response: Response) {
    try {
      const result = await this.prisma.lessions.findMany({
        select: {
          faculty: true,
        },
      });

      const uniqueFaculties = [...new Set(result.map((item) => item.faculty))];

      return response.status(200).json({
        result: uniqueFaculties,
      });
    } catch (error) {
      return response.status(400).json({
        error: error.message,
      });
    }
  }
}
