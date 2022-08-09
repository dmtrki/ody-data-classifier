import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EnquiryStatus } from '@prisma/client'
import { PrismaService } from '../../app/prisma/prisma.service'

@Injectable()
export class CheckingErrorListener {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger
  ) {}
  @OnEvent('checking.error', { async: true })
  async onCheckingError({ enquiry: { id, meta }, responseData }) {
    this.logger.debug(id, 'on error')
    const errorMeta = { ...meta }
    errorMeta.odyssey['error'] = responseData?.error ?? responseData.status
    await this.prisma.enquiry.update({
      where: {
        id,
      },
      data: {
        status: EnquiryStatus.ERROR,
        meta: errorMeta,
      },
    })
  }
}
