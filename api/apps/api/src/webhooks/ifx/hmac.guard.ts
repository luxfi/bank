import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class HmacIFXGuard implements CanActivate {
  private notificationSecret = '186e5875-416c-4af4-82cd-6fa6319eef62';

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const userAgent = request.headers['user-agent'];
    const timestamp = request.headers['x-ibanq-timestamp'];
    const receivedSignature = request.headers['x-ibanq-signature'];
    const body = JSON.stringify(request.body);

    if (!userAgent || !timestamp || !receivedSignature || !body) {
      throw new HttpException(
        'Missing required headers or body',
        HttpStatus.BAD_REQUEST,
      );
    }

    const version = userAgent.split('/')[1];
    if (!version) {
      throw new HttpException(
        'Invalid User-Agent format',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkString = `${timestamp}|${body}|${version}`;
    const hmac = crypto.createHmac('sha256', this.notificationSecret);
    hmac.update(checkString);
    const calculatedSignature = hmac.digest('hex');

    if (calculatedSignature !== receivedSignature) {
      throw new HttpException('Invalid signature', HttpStatus.BAD_REQUEST);
    }

    return true;
  }
}
