import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateLessionDto } from './create-lession.dto';
import * as ExcelJS from 'exceljs';

@Injectable()
export class LessionsService {
  constructor(private readonly prisma: PrismaClient) {}

  async addLession(
    lessionName: string,
    teacher: string,
    startsAt: string,
    endsAt: string,
    classroomNumber: number,
    groupNumber: number,
    faculty: string,
    weekDay: number,
  ) {
    const lession = await this.prisma.lessions.create({
      data: {
        lessionName,
        teacher,
        startsAt,
        endsAt,
        classroomNumber,
        groupNumber,
        faculty,
        weekDay,
      },
    });

    return lession;
  }

  async takeLessions(faculty?: string, groupNumber?: string) {
    let allLessions = await this.prisma.lessions.findMany();

    if (faculty && groupNumber) {
      allLessions = allLessions.filter((lession) => {
        return (
          lession.faculty === faculty &&
          lession.groupNumber === parseFloat(groupNumber)
        );
      });
    }

    return allLessions;
  }

  async processExcelFile(
    file: Express.Multer.File,
  ): Promise<CreateLessionDto[]> {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(file.buffer);
    const worksheet = workbook.getWorksheet(1);

    const data: CreateLessionDto[] = [];

    worksheet.eachRow((row, rowNumber) => {
      // Пропустить заголовок
      if (rowNumber === 1) {
        return;
      }

      // Получить значения ячеек и обработать их
      const lessionName = row.getCell(1).value as string;
      const teacher = row.getCell(2).value as string;
      const startsAt = row.getCell(3).value as string;
      const endsAt = row.getCell(4).value as string;
      const classroomNumber = row.getCell(5).value as number;
      const groupNumber = row.getCell(6).value as number;
      const faculty = row.getCell(7).value as string;
      const weekDay = row.getCell(8).value as number;

      data.push({
        lessionName,
        teacher,
        startsAt,
        endsAt,
        classroomNumber,
        groupNumber,
        faculty,
        weekDay,
      });
    });

    await this.prisma.lessions.createMany({ data: data });

    return data;
  }
}
