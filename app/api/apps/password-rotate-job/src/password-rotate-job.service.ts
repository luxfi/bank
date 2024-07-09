import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@tools/models';
import { MailerService } from './mailer/mailer.service';
import ReminderEmail from './mailer/reminder-email';

@Injectable()
export class CronjobService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly mailer: MailerService,
  ) {}

  async checkPasswordUpdates() {
    const users = await this.usersRepository.findUsersWithOldPasswords();
    for (const user of users) {
      try {
        await this.sendReminderEmail(user.username, user.getFullName());
        await this.usersRepository.updatePasswordUpdatedAt(user.username);
      } catch (e) {
        console.log('Error sending email to: ', user.username);
        console.log(e);
      }
    }
    console.log('Users with old passwords: ', users.length);
    console.log('Password rotate job done');
  }

  private async sendReminderEmail(email: string, name: string) {
    await this.mailer.send(
      new ReminderEmail(email, {
        firstName: name,
        loginUrl: new URL(
          '/profile/reset-password',
          process.env.FRONTEND_URL,
        ).toString(),
      }),
    );
  }
}
