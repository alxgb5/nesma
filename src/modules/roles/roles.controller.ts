import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RoleDto } from './role.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('roles')
@ApiTags('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) { }

    @Post()
    create(@Body() roleDto: RoleDto) {
        return this.rolesService.createOrUpdate(roleDto);
    }

    @Get()
    findAll() {
        return this.rolesService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.rolesService.remove(id);
    }
}
