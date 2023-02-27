import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { GetUser, GetUsers, UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ApiCreatedResponse({ type: GetUser })
  @ApiBadRequestResponse({ description: 'Email already exists' })
  @ApiAcceptedResponse({ description: 'User updated', type: GetUser })
  async createOrUpdate(@Body() userDto: UserDto): Promise<GetUser> {
    return this.usersService.createOrUpdate(userDto);
  }

  @Get()
  @ApiOkResponse({ type: GetUsers })
  async findAll(): Promise<GetUsers> {
    return this.usersService.findAll();
  }


  @Get(':id')
  @ApiOkResponse({ type: GetUser })
  @ApiBadRequestResponse({ description: 'Unable to find user' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUser> {
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
