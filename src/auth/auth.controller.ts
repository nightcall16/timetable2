import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { user, createUser, loginUser } from './interfaces';
import * as jwt from 'jsonwebtoken';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response, Request } from 'express';

@Controller('api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body('login') login: string,
    @Body('password') password: string,
    @Body('username') username?: string,
  ) {
    try {
      return await this.authService.createUser(login, password, username);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'Пользователь с таким логином уже существует',
        );
      }
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body('login') login: string,
    @Body('password') password: string,
    @Res() res: Response,
  ) {
    try {
      const user = await this.authService.validateUser(login, password);
      if (!user) {
        throw new UnauthorizedException('Неверное имя пользователя или пароль');
      }

      const accessToken = jwt.sign(
        { login: user.login, password: user.password },
        process.env.JWT_SECRET,
        {
          expiresIn: '30m',
        },
      );

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/',
      });

      return res.status(HttpStatus.OK).json({ ...{ ...user }, accessToken });
    } catch (error) {
      return res
        .status(error.status || HttpStatus.UNAUTHORIZED)
        .json({ error: error.message });
    }
  }
}
