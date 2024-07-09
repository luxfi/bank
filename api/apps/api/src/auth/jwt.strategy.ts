import { GetLoggedUserUseCase } from '@domain/use-cases';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { JwtConstants } from './constants';
import { PayloadInterface } from './payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly getLoggedUserUseCase: GetLoggedUserUseCase) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => {
          return req.cookies['jwt-token'];
        },
      ]),
      secretOrKey: JwtConstants.Secret,
      ignoreExpiration: false,
      issuer: JwtConstants.Issuer,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(req: Request, payload: PayloadInterface) {
    const user = await this.getLoggedUserUseCase.handle(payload);

    const isVerificationEndpoint = req.url.includes('/2fa/verification');

    if (!user) {
      return false;
    }

    if (isVerificationEndpoint || payload.twoFA) {
      return user;
    }

    return false;
  }
}
