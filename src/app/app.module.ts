import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ParserModule } from '../parser/parser.module'
import { CheckerModule } from '../checker/checker.module'
import { ScheduleModule } from '@nestjs/schedule'
import { BullModule } from '@nestjs/bull'
import { PrismaModule } from './prisma/prisma.module'
import { EnquiryModule } from '../enquiry/enquiry.module'
import { ReportModule } from '../report/report.module'
import { UtilsModule } from '../utils/utils.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AutomapperModule } from '@automapper/nestjs'
import { classes } from '@automapper/classes'
import { CamelCaseNamingConvention } from '@automapper/core'
import { ClientModule } from './client/client.module'
import { ResponseModule } from './response/response.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        return {
          redis: {
            host: config.get('REDIS_HOST', 'localhost'),
            port: +config.get('REDIS_PORT', 6379),
            password: config.get('REDIS_PASSWORD'),
          },
          prefix: config.get('PREFIX', 'sweep-ody'),
        }
      },
    }),
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
      namingConventions: new CamelCaseNamingConvention(),
    }),
    EventEmitterModule.forRoot(),
    PrismaModule,
    ClientModule,
    ParserModule,
    CheckerModule,
    EnquiryModule,
    ReportModule,
    UtilsModule,
    ResponseModule,
  ],
})
export class AppModule {}
