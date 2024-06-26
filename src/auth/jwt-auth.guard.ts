import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let accessToken = request.cookies['accessToken'];

    if (!accessToken) {
      const authHeader = request.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        accessToken = authHeader.substring(7);
      }
    }

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }

    try {
      const decodedAccessToken = jwt.verify(
        accessToken,
        process.env.JWT_SECRET,
      ) as {
        login: string;
        password: string;
        exp: number;
      };

      request.headers['authorization'] = `Bearer ${accessToken}`;
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
