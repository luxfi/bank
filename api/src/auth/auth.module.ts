import { GetLoggedUserUseCase } from '../use-cases';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module, forwardRef } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MikroOrmRegisteredForUser, MikroOrmRegisteredForUserClients } from '@cdaxfx/tools-models';
import { MailerModule } from '../mailer/mailer.module';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';
import { TwoFaVerificationController } from './2fa-verification/2fa-verification.controller';
import { TwoFaVerificationService } from './2fa-verification/2fa-verification.service';
import { ApprovalGuard } from './approval.guard';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtConstants } from './constants';
import { JwtAuthGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { MobileVerificationEntity } from './model/mobile-verification.entity';
import { RecaptchaGuard } from './recaptcha.guard';
import { RolesGuard } from './roles.guard';

@Module({
    providers: [
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        RecaptchaGuard,
        TwoFaVerificationService,
        {
            provide: APP_GUARD,
            useClass: JwtAuthGuard
        },
        {
            provide: APP_GUARD,
            useClass: ApprovalGuard
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard
        },
        GetLoggedUserUseCase
    ],
    imports: [
        MikroOrmRegisteredForUserClients(),
        MikroOrmRegisteredForUser(),
        SessionsModule,
        forwardRef(() => UsersModule),
        PassportModule,
        MikroOrmModule.forFeature([MobileVerificationEntity]),
        JwtModule.register({
            secret: JwtConstants.Secret,
            signOptions: { expiresIn: '8h', issuer: JwtConstants.Issuer }
        }),
        MailerModule
    ],
    exports: [AuthService, TwoFaVerificationService],
    controllers: [AuthController, TwoFaVerificationController]
})
export class AuthModule { }
