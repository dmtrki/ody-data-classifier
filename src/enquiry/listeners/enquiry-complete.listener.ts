import { OnEvent } from '@nestjs/event-emitter'
import { EnquiryStatus } from '../types/enquiry-status.enum'
import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../../app/prisma/prisma.service'

@Injectable()
export class EnquiryCompleteListener {
  constructor(private prisma: PrismaService, private logger: Logger) {}

  @OnEvent('enquiry.complete', { async: true })
  public async onEnquiryComplete(enquiries: string[]) {
    const completed = []
    for (const enquiryId of enquiries) {
      const enquiry = await this.prisma.enquiry.update({
        where: {
          id: enquiryId,
        },
        data: {
          status: EnquiryStatus.COMPLETE,
        },
      })
      completed.push(enquiry)
    }
    this.logger.debug(completed, 'Completed enquiries')
  }
}
