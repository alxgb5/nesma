import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SentMessageInfo } from 'nodemailer';
import { Environment } from 'src/core/environments';
import { UserDto } from '../users/user.dto';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) { }

  async sendActiveAccountMail(user: UserDto): Promise<SentMessageInfo> {
    const url =
      Environment.CLIENT_APP_URL +
      'activate-account?token=' +
      user.activateAccountToken;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Bienvenue sur alxgb ! Activez votre compte',
      template: './activate-account',
      context: {
        username: user.username,
        url,
      },
    });
  }

  async sendForgotPasswordMail(user: UserDto): Promise<SentMessageInfo> {
    const url =
      Environment.CLIENT_APP_URL + 'reset-password?token=' + user.resetPasswordToken;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Réinitialisez votre mot de passe',
      template: './forgot-password',
      context: {
        username: user.username,
        url,
      },
    });
  }

  async sendResetPasswordMail(user: UserDto): Promise<SentMessageInfo> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Mot de passe modifié',
      template: './reset-password',
      context: {
        username: user.username,
      },
    });
  }
}
