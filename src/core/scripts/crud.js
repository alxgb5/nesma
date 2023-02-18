const fs = require('fs');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let modulePath = './src/modules/';
let entityName;
let fileName;
let bddEntity;

rl.question("Nom de l'entité à créer ?", function (name) {
    fileName = name;
    entityName = setUpperCase(fileName);
    rl.question('Nom en base de données ? ', function (bddName) {
        bddEntity = bddName;
        modulePath = modulePath + '' + bddName;
        rl.close();
    });
});

rl.on('close', function () {
    if (fs.existsSync(modulePath)) {
        console.log('Le dossier existe déjà.');
    } else
        fs.mkdirSync(modulePath, { recursive: true });

    // CREATE ENTITY FILE 
    fs.writeFile(modulePath + '/' + fileName + '.entity.ts',
        `
    import { Entity, Column } from 'typeorm';
    import { BaseEntity } from '../../core/base.entity';
    import { ${entityName}Dto } from './${fileName}.dto';

    @Entity({ name: '${bddEntity}' })
    export class ${entityName} extends BaseEntity {

    public toDto(): ${entityName}Dto {
        return {
        id: this.id,
        creationDate: this.creationDate,
        modifDate: this.modifDate,
        archived: this.archived,
        };
    }

    public fromDto(dto: ${entityName}) {
        this.id = dto.id;

        if (!this.id) this.id = undefined;
    }
}
    `, function (err) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m', '[Nest] Entité créé avec succés.');
    });

    // CREATE DTO FILE
    fs.writeFile(modulePath + '/' + fileName + '.dto.ts',
        `
    import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
    import { BaseSearchRequest } from '../../core/base-search-request';
    import { BaseDto } from '../../core/base.dto';
    import { GenericResponse } from '../../core/generic-response'; 
    import { BaseSearchResponse } from '../../core/search-response';

    export class ${entityName}Dto extends BaseDto {
  
    }

    export class Get${entityName}Response extends GenericResponse {
        @ApiProperty({ type: () => ${entityName}Dto })
        ${fileName}: ${entityName}Dto;
    }

    export class Get${entityName}sResponse extends BaseSearchResponse {
        @ApiProperty({ type: () => ${entityName}Dto, isArray: true })
        ${fileName}s: ${entityName}Dto[] = [];
    }

    export class Get${entityName}sRequest extends BaseSearchRequest {
   
    }
    `, function (err) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m', '[Nest] DTO créé avec succés.');
    });

    // CREATE CONTROLLER FILE
    fs.writeFile(modulePath + '/' + fileName + 's.service.ts',
        `
    import { Injectable } from '@nestjs/common';
    import { InjectRepository } from '@nestjs/typeorm';
    import { Repository } from 'typeorm';
    import { ApplicationBaseModelService } from '../../core/base-model.service';
    import { Get${entityName}Response, Get${entityName}sResponse, ${entityName}Dto } from './${fileName}.dto';
    import { ${entityName} } from './${fileName}.entity';
    
    @Injectable()
    export class ${entityName}sService extends ApplicationBaseModelService<
        ${entityName},
        ${entityName}Dto,
        Get${entityName}Response,
        Get${entityName}sResponse
    > {
      constructor(
        @InjectRepository(${entityName})
        public readonly repository: Repository<${entityName}>,
      ) {
        super();
        this.modelOptions = {
          getManyResponse: Get${entityName}sResponse,
          getOneResponse: Get${entityName}Response,
          getManyResponseField: '${fileName}s',
          getOneResponseField: '${fileName}',
          repository: this.repository,
          entity: ${entityName},
          archiveField: 'disabled',
          archiveFieldValue: true,
        };
      }
    }
    `, function (err) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m', '[Nest] Service créé avec succés.');
    });

    // CREATE SERVICE FILE 
    fs.writeFile(modulePath + '/' + fileName + 's.controller.ts',
        `
    import {
        BadRequestException,
        Body,
        Controller,
        Delete,
        Get,
        HttpStatus,
        Param,
        Post,
        Query,
    } from '@nestjs/common';
    import { ApiTags } from '@nestjs/swagger';
    import {
        Get${entityName}Response,
        Get${entityName}sRequest,
        Get${entityName}sResponse,
        ${entityName}Dto,
    } from './${fileName}.dto';
    import { ${entityName}sService } from './${fileName}s.service';
    import { ${entityName} } from './${fileName}.entity';
    import { BaseController } from '../../core/base.controller';
    import { BaseSearchRequest } from '../../core/base-search-request';
    import { GenericResponse } from '../../core/generic-response';
    import { ApiDocs } from '../../decorators/api.decorator';
    import { AuthToolsService } from '../../helpers/auth-helper';
    
    @ApiTags('${fileName}s')
    @Controller('${fileName}s')
    export class ${entityName}sController extends BaseController {
        constructor(
            private readonly ${fileName}sService: ${entityName}sService,
            private readonly authToolsService: AuthToolsService,
            ) {
                super();
            }
            
            @Get()
            @ApiDocs({
                summary: 'Get all ${fileName}s',
                operationId: 'getAll${entityName}s',
                resStatus: HttpStatus.OK,
                resType: Get${entityName}sResponse,
            })
            async getAll(@Query() request: Get${entityName}sRequest): Promise<Get${entityName}sResponse> {
                const findOptions = BaseSearchRequest.getDefaultFindOptions<${entityName}>(request);
                if (request.search) {
                    if (!findOptions.where) findOptions.where = [{}];
                    findOptions.where = [
                    ];
                }
                return await this.${fileName}sService.findAll(findOptions);
            }
            
            @Get(':id')
            @ApiDocs({
                summary: 'Get ${fileName}',
                operationId: 'get${entityName}',
                resStatus: HttpStatus.OK,
                resType: Get${entityName}Response,
            })
            async get(@Param('id') id: string): Promise<Get${entityName}Response> {
                if (!id)
                throw new BadRequestException("Impossible de trouver l'utilisateur");
                return await this.${fileName}sService.findOne({ where: { id: id } });
            }
            
            @Post()
            @ApiDocs({
                summary: 'Create or update ${fileName}',
                operationId: 'createOrUpdate${entityName}',
                resStatus: HttpStatus.CREATED,
                resType: Get${entityName}Response,
            })
            async createOrUpdate(@Body() ${fileName}Dto: ${entityName}Dto): Promise<Get${entityName}Response> {
                if (!${fileName}Dto) throw new BadRequestException('Invalid Request');
                return await this.${fileName}sService.createOrUpdate(${fileName}Dto);
            }
            
            @Delete()
            @ApiDocs({
                summary: 'Delete ${fileName}s',
                operationId: 'delete${entityName}s',
                resStatus: HttpStatus.OK,
                resType: GenericResponse,
            })
            async delete${entityName}s(
                @Query('${fileName}Ids') ${fileName}Ids: string,
                ): Promise<GenericResponse> {
                    return await this.${fileName}sService.delete(${fileName}Ids.split(','));
                }
            }
    
`, function (err) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m', '[Nest] Controller créé avec succés.');
    });

    // CREATE MODULE FILE 
    fs.writeFile(modulePath + '/' + fileName + 's.module.ts',
        `
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { ${entityName} } from './${fileName}.entity';
    import { ${entityName}sController } from './${fileName}s.controller';
    import { ${entityName}sService } from './${fileName}s.service';
    
    @Module({
      imports: [TypeOrmModule.forFeature([${entityName}])],
      controllers: [${entityName}sController],
    
      providers: [${entityName}sService],
      exports: [${entityName}sService],
    })
    export class ${entityName}sModule {}
`, function (err) {
        if (err) throw err;
        console.log('\x1b[36m%s\x1b[0m', '[Nest] Module créé avec succés.');
    });
});


function setUpperCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}