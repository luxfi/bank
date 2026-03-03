import { ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ANONYMOUS_ENDPOINT_KEY } from './anonymous.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    private readonly logger = new Logger(JwtAuthGuard.name);

    constructor(private readonly reflector: Reflector) {
        super();
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            ANONYMOUS_ENDPOINT_KEY,
            [context.getHandler(), context.getClass()]
        );

        if (isPublic)
            return true;

        // Try to identify the token issuer from the raw JWT
        const request = context.switchToHttp().getRequest();
        const token = this.extractToken(request);

        if (token && this.isIamToken(token)) {
            // Delegate to IAM strategy
            const iamGuard = new (AuthGuard('iam'))();
            try {
                const result = await iamGuard.canActivate(context);
                if (result)
                    return true;
            } catch (err) {
                this.logger.debug(`IAM auth failed, falling back to local JWT: ${(err as Error).message}`);
            }
        }

        // Fall back to local JWT strategy
        return super.canActivate(context) as Promise<boolean>;
    }

    private extractToken(request: any): string | null {
        const authHeader = request.headers?.authorization;
        if (authHeader && authHeader.startsWith('Bearer '))
            return authHeader.slice(7);

        return request.cookies?.['jwt-token'] || null;
    }

    private isIamToken(token: string): boolean {
        try {
            // Decode the payload without verification to check the issuer
            const parts = token.split('.');
            if (parts.length !== 3)
                return false;

            const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
            const iamIssuer = process.env.IAM_ISSUER || 'https://hanzo.id';
            return payload.iss === iamIssuer;
        } catch {
            return false;
        }
    }
}
