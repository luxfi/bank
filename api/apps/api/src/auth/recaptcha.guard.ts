import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RecaptchaGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      if (process.env.NODE_ENV === 'development') {
        return true;
      }
      const { body } = context.switchToHttp().getRequest();

      const url = `https://www.google.com/recaptcha/api/siteverify`;

      const { data } = await axios.post(
        url,
        {},
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
          },
          params: {
            secret: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
            response: body.r,
          },
        },
      );

      if (!data.success) {
        throw new ForbiddenException();
      }
    } catch (error) {
      throw new ForbiddenException();
    }

    return true;
  }
}
