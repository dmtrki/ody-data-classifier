import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'reflect-metadata'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app/app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import * as basicAuth from 'express-basic-auth'
import { PrismaService } from './app/prisma/prisma.service'
import { EnquiryModule } from './enquiry/enquiry.module'
import { ReportModule } from './report/report.module'
import { GlobalInternalExceptionFilter } from './app/filters/global-internal-exception.filter'
import { EnquiryAcceptedDto } from './enquiry/dtos/enquiry-accepted.dto'
import { ReportDataDto } from './report/dtos/report-data-groups.dto'
import ProcessTerminator from './app/process/terminator'
import { GlobalHttpExceptionFilter } from './app/filters/global-http-exception.filter'
import { UtilsModule } from './utils/utils.module'
import Logger from './logger/logger'

type AppHostConfig = {
  port: string
  host: string
  basicAuthUser: {
    [username: string]: string
  }
  swaggerPath: string
  loggerHost: string
  loggerPort: number
}

ProcessTerminator.onError()

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule)
  const { host, port, basicAuthUser, swaggerPath, loggerHost, loggerPort } =
    getConfig(app)
  app.useLogger(Logger.getInstance({ loggerHost, loggerPort }))
  app
    .useGlobalPipes(getGlobalPipe())
    .useGlobalFilters(
      new GlobalHttpExceptionFilter(),
      new GlobalInternalExceptionFilter()
    )
    .use(
      basicAuth({
        challenge: true,
        users: { ...basicAuthUser },
      })
    )
    .enableCors(getCorsOptions())
  await app.get(PrismaService).enableShutdownHooks(app)
  initSwagger(app, swaggerPath)

  await app.listen(port || 3000)
  console.log(`Application is running on: ${host}:${port}`)
}
bootstrap().then()

function initSwagger(app, path) {
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Sweep-net Odyssey adapter API')
    .setVersion('0.3.3')
    .addApiKey(
      {
        description: 'Ключ доступа для запросов к REST API',
        in: 'header',
        name: 'apiKey',
        type: 'apiKey',
      },
      'apiKey'
    )
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    include: [EnquiryModule, ReportModule, UtilsModule],
    extraModels: [EnquiryAcceptedDto, ReportDataDto],
    deepScanRoutes: false,
    ignoreGlobalPrefix: true,
  })

  SwaggerModule.setup(path, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  })
}

function getConfig(app): AppHostConfig {
  const config = app.get(ConfigService)
  return {
    port: config.get('API_PORT'),
    host: config.get('API_HOST'),
    basicAuthUser: {
      [config.get('API_BASIC_USER', 'hello')]: config.get(
        'API_BASIC_PASSWORD',
        'world'
      ),
    },
    swaggerPath: config.get('SWAGGER_PATH', '/'),
    loggerHost: config.get('LOGGER_HOST', '/'),
    loggerPort: parseInt(config.get('LOGGER_PORT', '')),
  }
}

function getGlobalPipe(): ValidationPipe {
  return new ValidationPipe({
    forbidUnknownValues: true,
    transform: true,
    enableDebugMessages: true,
  })
}

function getCorsOptions() {
  return {
    origin: '*',
    methods: 'GET,HEAD,POST',
  }
}
