import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { join } from 'path';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Environment } from '../../core/environments';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: Environment.SMTP_HOST,
        port: parseInt(Environment.SMTP_PORT),
        secure: false,
        auth: {
          user: Environment.SMTP_USER,
          pass: Environment.SMTP_PASS,
        },
      },
      defaults: {
        from: '"Nept" <noreply@nept.fr>',
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
