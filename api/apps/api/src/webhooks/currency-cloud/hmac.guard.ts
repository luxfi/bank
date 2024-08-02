import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class HmacGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const hmacHeader = request.headers['x-hmac-digest-sha-512'];
        const rawBody = request.rawBody;

        const hmac = createHmac('sha512', `${process.env.HMAC_SECRET}`);
        const calculatedHMAC = hmac.update(rawBody).digest('hex');

        if (calculatedHMAC === hmacHeader)
            return true;
        else
            throw new ForbiddenException('Not allowed');
    }
}
