import { Logger, Module } from '@nestjs/common'
import { EnquiryController } from './enquiry.controller'
import { EnquiryService } from './enquiry.service'
import { EnquiryIncomingListener } from './listeners/enquiry-incoming.listener'
import { EnquiryRefreshListener } from './listeners/enquiry-refresh.listener'
import { EnquiryCompleteListener } from './listeners/enquiry-complete.listener'
import { ModelFactory } from '../bearer/model.factory'
import { CheckingSuccessListener } from '../checker/listeners/checking-success.listener'
import { ParserModule } from '../parser/parser.module'

@Module({
  imports: [ModelFactory],
  controllers: [EnquiryController],
  providers: [
    Logger,
    EnquiryService,
    EnquiryIncomingListener,
    EnquiryRefreshListener,
    EnquiryCompleteListener,
  ],
})
export class EnquiryModule {}
