import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PayloadInterface } from './payload.interface';
import PasswordResetEmail from '../users/emails/password-reset-email';
import { MailerService } from '../mailer/mailer.service';
import { User, UserClientsRepository } from '@luxbank/tools-models';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly userClientsRepository: UserClientsRepository,
        private readonly jwtService: JwtService,
        private readonly mailer: MailerService
    ) { }

    async validateUserToken(user: User, token: string): Promise<boolean | null> {
        if (user) {
            const tokenIsValid = await this.usersService.is2FAValid(user, token);
            if (tokenIsValid)
                return true;
        }
        return null;
    }

    async getRole(userUUID: string, clientUUID: string) {
        return (await this.userClientsRepository.findByUserAndClientUuid(userUUID, clientUUID))?.metadata.role;
    }

    async validateUser(username: string, password: string): Promise<User | null> {
        const user = await this.usersService.getByUsername(username);
        if (!user || user.deletedAt)
            return null;

        const passwordIsValid = await user.comparePassword(password);
        if (!passwordIsValid)
            return null;

        if (user.getPasswordStrength() < 14) {
            await user.setPassword(password);
            await this.usersService.store(user);
        }
        return user;
    }

    async validateUserEmail(email: string): Promise<User | null> {
        const user = await this.usersService.getByUsername(email);
        return user;
    }

    async sendPasswordResetLink(user: User): Promise<void> {
        const token = await user.generatePasswordResetToken();
        await this.usersService.store(user);

        const resetUrl = `${process.env.FRONTEND_URL || 'https://app.lux.financial'}/reset-password?token=${token}&email=${encodeURIComponent(user.username)}`;
        await this.mailer.send(new PasswordResetEmail(user.username, resetUrl));
    }

    async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
        const user = await this.usersService.getByUsername(email);
        if (!user)
            throw new BadRequestException('Invalid or expired reset token.');

        const isValid = await user.validatePasswordResetToken(token);
        if (!isValid)
            throw new BadRequestException('Invalid or expired reset token.');

        await user.setPassword(newPassword);
        user.clearPasswordResetToken();
        await this.usersService.store(user);
    }

    async login(user: User, twoFA: boolean, superAdminToken?: string) {
        const payload: PayloadInterface = {
            username: user.username,
            mobileNumber: user?.contact?.mobileNumber,
            role: user.role,
            twoFA,
            ...(user.clients.length && user.getCurrentClient() ? { clientUUID: user.getCurrentClient()!.uuid } : {}),
            ...(user.personatedBy ? { personatedBy: user.personatedBy } : {})
        };

        return {
            accessToken: this.jwtService.sign(payload),
            ...(superAdminToken ? { superAdminToken } : {})
        };
    }

    async findByUserByUuid(userUUID: string): Promise<User | null> {
        return this.usersService.getByUuid(userUUID);
    }
}
