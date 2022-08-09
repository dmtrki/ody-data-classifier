import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { InjectQueue } from '@nestjs/bull'
import { JobOptions, Queue } from 'bull'
import { OdysseyCheckResponseDto } from '../app/client/dtos/odyssey-check-response.dto'
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
import { OdysseyClient } from '../app/client/odyssey.client'
import { EnquiryModel } from '../bearer/models/enquiry.model'
import { EnquiryReferenceDto } from '../enquiry/dtos/enquiry-reference.dto'
import { PrismaService } from '../app/prisma/prisma.service'
import { InternalError } from '../app/filters/internal-error.exception'
import { isNil } from '@nestjs/common/utils/shared.utils'

export type CheckingPayload = {
  enquiryId: string
  externalId: string
}

export type CheckingJob = {
  data: CheckingPayload
  opts?: Omit<JobOptions, 'repeat'> | undefined
}

@Injectable()
export class CheckerService {
  constructor(
    @InjectQueue('checking') private queue: Queue,
    private client: OdysseyClient,
    private prisma: PrismaService,
    private enquiries: EnquiryModel,
    private emitter: EventEmitter2,
    private logger: Logger
  ) {
    this.enquiries.setDatabaseClient(prisma)
  }

  @Interval(15000)
  async chargeQueue() {
    try {
      const jobs = await this.makeJobsList()
      if (jobs.size > 0) {
        await this.queue.addBulk([...jobs])
      }
      return
    } catch (e) {
      throw new InternalError(e, 'queue charging failed')
    }
  }

  @OnEvent('enquiry.responded')
  async queueIncoming(payload: CheckingPayload) {
    await this.queue.add(payload, {
      removeOnComplete: true,
      jobId: payload.enquiryId,
    })
  }

  async check({ enquiryId, externalId }: CheckingPayload) {
    try {
      const statusResponse = await this.client.check(externalId)
      this.logger.log(statusResponse, 'checking response')
      return await this.handleOdysseyResultStatus(enquiryId, statusResponse)
    } catch (e) {
      throw new InternalError(
        e,
        'checking request failed',
        this.constructor.name
      )
    }
  }

  private async makeJobsList(): Promise<Set<CheckingJob>> {
    const enquiries = await this.enquiries.getCheckingTargets()
    const checkerJobs: Set<CheckingJob> = new Set()

    if (!enquiries.length) {
      return checkerJobs
    }

    for (const partialEnquiry of enquiries) {
      const externalId =
        partialEnquiry?.meta &&
        typeof partialEnquiry.meta === 'object' &&
        'odyssey' in partialEnquiry.meta
          ? partialEnquiry.meta?.odyssey['requestId'] ?? null
          : null

      if (!isNil(externalId)) {
        checkerJobs.add({
          data: {
            enquiryId: partialEnquiry.id,
            externalId: externalId,
          },
          opts: {
            removeOnComplete: true,
            jobId: partialEnquiry.id,
          },
        })
      }
    }

    return checkerJobs
  }

  private async handleOdysseyResultStatus(
    enquiryId,
    responseData: OdysseyCheckResponseDto
  ) {
    try {
      if (responseData['status'] === 'progress') return
      const enquiry = await this.enquiries
        .select(['id', 'meta'])
        .findById(enquiryId)

      return this.client.isError(responseData)
        ? this.handleError(responseData, enquiry)
        : this.handleSuccess(responseData, enquiry)
    } catch (e) {
      throw new InternalError(
        e,
        'result status handling failed',
        'handleOdysseyResultStatus'
      )
    }
  }

  private async handleError(
    responseData: OdysseyCheckResponseDto,
    enquiry: EnquiryReferenceDto
  ): Promise<void> {
    this.emitter.emit('checking.error', { enquiry, responseData })
  }

  private async handleSuccess(
    responseData: OdysseyCheckResponseDto,
    enquiry: EnquiryReferenceDto
  ): Promise<void> {
    this.emitter.emit('checking.success', { enquiry, responseData })
  }
}
