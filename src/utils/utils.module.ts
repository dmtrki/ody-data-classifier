import {Logger, Module} from '@nestjs/common'
import { UtilsController } from './utils.controller'
import { ReportModule } from '../report/report.module'
import { UtilsService } from './utils.service'
import { ParserModule } from '../parser/parser.module'
import { EnquiryModule } from '../enquiry/enquiry.module'
import { UnknownModule } from './unknown/unknown.module'

@Module({
  controllers: [UtilsController],
  imports: [ParserModule, ReportModule, EnquiryModule, UnknownModule],
  providers: [UtilsService, Logger],
})
export class UtilsModule {}
