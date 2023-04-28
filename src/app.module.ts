import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { DefaultController } from './core/code/default.controller';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    AuthModule,
    MailModule,
  ],
  controllers: [DefaultController],
  providers: [],
})
export class AppModule {

}
