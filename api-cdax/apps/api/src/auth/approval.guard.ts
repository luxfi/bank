import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { SKIP_ACCOUNT_SETUP_KEY } from './skip-account-setup.decorator';
import { User } from '@cdaxfx/tools-models';

@Injectable()
export class ApprovalGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const req = context.switchToHttp().getRequest<{ user: User }>();
        if (!req.user)
            return true;

        const skipAccountSetup = this.reflector.getAllAndOverride<boolean>(
            SKIP_ACCOUNT_SETUP_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (skipAccountSetup)
            return true;

        if (req.user.role !== 'admin:super' && !req.user.getCurrentClient()?.account?.isApproved)
            throw new UnauthorizedException('Logged in user is not approved.');

        return true;
    }
}
