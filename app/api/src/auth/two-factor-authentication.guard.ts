import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { totp } from 'otplib';

@Injectable()
export class TwoFactorAuthenticationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const token = request.headers['2fa-token'];

        const secret = user.twoFactorAuthenticationSecret;

        if (!token || !secret)
            throw new ForbiddenException('2FA token or secret not provided');

        const isTokenValid = totp.verify({ token, secret });

        if (!isTokenValid)
            throw new ForbiddenException('Invalid 2FA token');

        return true;
    }
}
