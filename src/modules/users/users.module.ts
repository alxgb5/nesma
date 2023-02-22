import { Global, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Global()
@Module({
  controllers: [UsersController],
  exports: [UsersService],
  providers: [UsersService],
  imports: [PrismaModule]
})
export class UsersModule { }
