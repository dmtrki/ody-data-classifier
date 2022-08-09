import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { PrismaService } from '../../app/prisma/prisma.service'
import { Enquiry } from '@prisma/client'
import { EnquiryService } from '../enquiry.service'

@Injectable()
export class EnquiryRefreshListener {
  constructor(private prisma: PrismaService, private service: EnquiryService) {}

  @OnEvent('enquiry.refresh', { async: true })
  public async onEnquiryRefresh(enquiry: Enquiry) {
    //TODO:?
  }
}
