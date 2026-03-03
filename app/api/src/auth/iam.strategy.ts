import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { passportJwtSecret } from 'jwks-rsa';
import { UsersRepository } from '@luxbank/tools-models';

const IAM_ISSUER = process.env.IAM_ISSUER || 'https://hanzo.id';
const IAM_JWKS_URI = process.env.IAM_JWKS_URI || `${IAM_ISSUER}/.well-known/jwks`;

interface IamPayload {
    sub: string;
    iss: string;
    email?: string;
    preferred_username?: string;
    name?: string;
}

@Injectable()
export class IamStrategy extends PassportStrategy(Strategy, 'iam') {
    private readonly logger = new Logger(IamStrategy.name);

    constructor(private readonly usersRepository: UsersRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKeyProvider: passportJwtSecret({
                cache: true,
                rateLimit: true,
                jwksRequestsPerMinute: 10,
                jwksUri: IAM_JWKS_URI
            }),
            issuer: IAM_ISSUER,
            algorithms: ['RS256'],
            ignoreExpiration: false
        } as StrategyOptions);
    }

    async validate(payload: IamPayload) {
        // Try to find user by oidc_subject first
        let user = await this.usersRepository.findOne(
            { oidcSubject: payload.sub, deletedAt: null },
            { populate: ['clients', 'contact', 'userClients.metadata'] }
        );

        // If no linked user found, try matching by email
        if (!user && payload.email) {
            user = await this.usersRepository.findByUsername(payload.email);
            if (user) {
                // Link the IAM identity to the existing user
                user.oidcSubject = payload.sub;
                await this.usersRepository.store(user);
                this.logger.log(`Linked IAM subject ${payload.sub} to user ${user.username}`);
            }
        }

        if (!user)
            return false;

        // Set current client and role (same pattern as JwtStrategy)
        const client = user.clients.getItems()[0];
        if (client) {
            user.setCurrentClient(client.uuid);
            const role = user.userClients.getItems().find(
                (uc) => uc.client.uuid === client.uuid
            )?.metadata.role;
            user.setRole(role);
        }

        return user;
    }
}
