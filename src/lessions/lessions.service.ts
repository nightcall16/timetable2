import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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
}
