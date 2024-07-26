import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ANONYMOUS_ENDPOINT_KEY } from './anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private readonly reflector: Reflector) {
        super();
    }

    public canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            ANONYMOUS_ENDPOINT_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic)
            return true;

        return super.canActivate(context);
    }
}
