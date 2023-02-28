import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Patch } from '@nestjs/common';
import { ApiAcceptedResponse, ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../core/decorators/api.decorator';
import { UserLogged } from '../../core/decorators/user-logged.decorator';
import { GetUser, GetUsers, UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @Get()
  @UserLogged()
  @ApiOkResponse({ type: GetUsers })
  @ApiDocs({ summary: 'Get users', operationId: 'getUsers', badRequestMessage: 'Unable to get users' })
  async findAll(): Promise<GetUsers> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @UserLogged()
  @ApiOkResponse({ type: GetUser })
  @ApiDocs({ summary: 'Get user', operationId: 'getUser', badRequestMessage: 'Unable to find user' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUser> {
    return this.usersService.findOne(id);
  }

  @Post()
  @UserLogged()
  @ApiDocs({ summary: 'Create user', operationId: 'createUser', badRequestMessage: 'Unable to create user' })
  @ApiCreatedResponse({ type: GetUser })
  async create(@Body() userDto: UserDto): Promise<GetUser> {
    return this.usersService.create(userDto);
  }

  @Patch(':id')
  @UserLogged()
  @ApiAcceptedResponse({ description: 'User updated', type: GetUser })
  @ApiDocs({ summary: 'Update user', operationId: 'updateUser', badRequestMessage: 'Unable to find user' })
  async update(@Body() userDto: UserDto): Promise<GetUser> {
    return this.usersService.update(userDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User deleted', type: Boolean })
  @ApiDocs({ summary: 'Delete user', operationId: 'deleteUser', badRequestMessage: 'Unable to find user' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
