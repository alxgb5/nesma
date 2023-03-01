import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaClientExceptionFilter } from './core/handlers/prisma-client-exception.filter';
import { TimeoutInterceptor } from './core/middlewares/timeout-interceptor';
import { LoggingInterceptor } from './core/middlewares/logging-interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new TimeoutInterceptor(), new LoggingInterceptor());
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  const config = new DocumentBuilder()
    .setTitle('NestJS Prisma Boilerplate')
    .setDescription('The NestJS Prisma Boilerplate API description')
    .setVersion('1.0')
    .addBearerAuth()
    .setContact('Alexandre Brun-Giglio', null, 'alexandre.brungiglio@gmail.com')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  app.use('/docs/swagger.json', (req, res) => res.send(document));

  SwaggerModule.setup('docs', app, document, {
    swaggerUrl: '/docs/swagger.json',
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
    }
  });

  await app.listen(3000);
}
bootstrap();
