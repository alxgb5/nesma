import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';

@Module({
  imports: [PrismaModule, UsersModule, RolesModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
