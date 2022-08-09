import { Logger, Module } from '@nestjs/common'
import { CheckerService } from './checker.service'
import { BullModule } from '@nestjs/bull'
import { CheckerProcessor } from './checker.processor'
import { PrismaModule } from '../app/prisma/prisma.module'
import { CheckingErrorListener } from './listeners/checking-error.listener'
import { CheckingSuccessListener } from './listeners/checking-success.listener'
import { ParserModule } from '../parser/parser.module'

@Module({
  imports: [
    BullModule.registerQueueAsync({
      name: 'checking',
    }),
    PrismaModule,
    ParserModule,
  ],
  providers: [
    CheckerService,
    CheckerProcessor,
    CheckingSuccessListener,
    CheckingErrorListener,
    Logger,
  ],
})
export class CheckerModule {}
