import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { user } from './interfaces';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaClient) {}

  async createUser(
    login: string,
    password: string,
    username?: string,
  ): Promise<user> {
    if (!username) {
      username = null;
    }

    const existingUser = await this.prisma.users.findUnique({
      where: {
        login,
      },
    });

    if (existingUser) {
      throw new ConflictException(
        'Пользователь с таким логином уже существует',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Хешируем пароль

    return await this.prisma.users.create({
      data: {
        username: username,
        login: login,
        password: hashedPassword, // Сохраняем хешированный пароль
      },
    });
  }

  async validateUser(login: string, password: string): Promise<user | null> {
    const user = await this.prisma.users.findUnique({
      where: {
        login,
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }
}
