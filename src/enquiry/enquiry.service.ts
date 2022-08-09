import { Injectable } from '@nestjs/common'
import { EnquiryAcceptedDto } from './dtos/enquiry-accepted.dto'
import { EnquiryMetaDto } from './dtos/enquiry-meta.dto'
import { EnquiryModel } from '../bearer/models/enquiry.model'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { EnquiryStatus } from './types/enquiry-status.enum'
import { OdysseyClient } from '../app/client/odyssey.client'
import { OdysseyCreateResponseDto } from '../app/client/dtos/odyssey-post-response.dto'
import { PrismaService } from '../app/prisma/prisma.service'

@Injectable()
export class EnquiryService {
  private enquiry: EnquiryModel

  constructor(
    private client: OdysseyClient,
    private emitter: EventEmitter2,
    private enquiries: EnquiryModel,
    private prisma: PrismaService
  ) {
    this.enquiries.setDatabaseClient(prisma)
  }

  async handleIncoming(method, fields): Promise<EnquiryAcceptedDto> {
    const enquiry = await this.enquiries.makeAttempt({ method, fields })
    return {
      id: enquiry.id,
    } as EnquiryAcceptedDto
  }

  async processIncoming(enquiry) {
    const data = await this.client.create(enquiry.meta)
    enquiry.status = data.error ? EnquiryStatus.ERROR : EnquiryStatus.WAITING
    enquiry.meta = this.fillMetaWithResponse(enquiry.meta, data)
    return await this.enquiries.updateOnExternalResponse(enquiry)
  }

  private fillMetaWithResponse(
    meta: EnquiryMetaDto,
    data: OdysseyCreateResponseDto
  ): EnquiryMetaDto {
    if (data.error) {
      meta['error'] = data.error
    } else {
      meta['requestId'] = data?.request_id
      meta['odyssey'] = {
        requestId: data?.request_id,
        post: data,
        resultUrl: null,
        result: null,
      }
    }
    return meta
  }
}
