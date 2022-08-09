import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { ParserService } from '../../parser/parser.service'
import { CheckedEnquiry } from '../../parser/types/parser-payload'
import { EnquiryModel } from '../../bearer/models/enquiry.model'

@Injectable()
export class CheckingSuccessListener {
  constructor(
    private readonly enquiries: EnquiryModel,
    private readonly parser: ParserService,
    private readonly logger: Logger
  ) {}

  @OnEvent('checking.success', { async: true })
  public async onEnquiryChecked({ enquiry, responseData }) {
    enquiry.meta.odyssey['resultUrl'] = responseData.data.url
    enquiry.meta.odyssey['result'] = responseData
    this.logger.debug(enquiry, 'enquiry checked')
    await this.enquiries.setSourceMeta(enquiry)
    await this.parser.handleEnquiry(enquiry as CheckedEnquiry)
  }
}
