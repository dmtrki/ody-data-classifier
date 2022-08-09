import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../app/prisma/prisma.service'
import { Enquiry } from '@prisma/client'
import { EnquiryService } from '../enquiry.service'

@Injectable()
export class EnquiryIncomingListener {
  constructor(private prisma: PrismaService, private service: EnquiryService) {}

  @OnEvent('enquiry.incoming', { async: true })
  public async onEnquiryIncoming(enquiry: Enquiry) {
    this.service.processIncoming(await enquiry)
  }
}
