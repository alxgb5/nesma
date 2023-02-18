import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Email already exists' })
  @ApiAcceptedResponse({ description: 'User updated', type: UserDto })
  async createOrUpdate(@Body() userDto: UserDto) {
    return this.usersService.createOrUpdate(userDto);
  }

  @Get()
  @ApiOkResponse({ type: [UserDto] })
  async findAll() {
    return this.usersService.findAll();
  }


  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Unable to find user' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Unable to find user');
    }
    return this.usersService.findOne(id);
  }


  @Delete(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Unable to find user' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('Unable to find user');
    }
    return this.usersService.remove(id);
  }
}
