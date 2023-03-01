import { Controller, Get } from '@nestjs/common';
import { Response, response } from 'express';

@Controller()
export class DefaultController {
    constructor() { }

    @Get()
    get() {
        return JSON.stringify({ data: 'This is the default controller. See the docs on /docs' });
    }
}