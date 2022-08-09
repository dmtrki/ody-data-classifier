import { Enquiry, EnquiryStatus, Prisma, PrismaClient } from '@prisma/client'
import { EnquiryAttemptProducedType } from '../../enquiry/dtos/enquiry-attempt.dto'
import { Injectable } from '@nestjs/common'
import deterministicHash from 'deterministic-object-hash'
import { BaseModel } from './base.model'
import { EnquiryReferenceDto } from '../../enquiry/dtos/enquiry-reference.dto'
import { EnquiryMetaDto } from '../../enquiry/dtos/enquiry-meta.dto'
import { subMinutes } from 'date-fns'
import { IncomingEnquiryRequest } from '../../enquiry/dtos/enquiry-request.dto'

export type AttemptPayload = {
  method: string
  fields: IncomingEnquiryRequest
}

@Injectable()
export class EnquiryModel extends BaseModel {
  prismaMemberKey = 'enquiry'
  protected db: PrismaClient['enquiry']
  protected ref: EnquiryReferenceDto
  protected defaultInputs = {
    select: {
      id: true,
      meta: true,
      status: true,
      hash: true,
    },
  }
  protected selectInputs: Prisma.EnquirySelect = null

  select(inputs: string[] | string | Prisma.EnquirySelect): this {
    if (typeof inputs === 'string') {
      inputs = {
        [inputs]: true,
      }
    } else if (Array.isArray(inputs)) {
      inputs = Object.fromEntries(inputs.map((it) => [it, true]))
    }
    this.selectInputs = { ...inputs }
    return this
  }

  async create(payload) {
    return await this.db.create({
      data: { ...payload },
      ...this.getSelectInputs(),
    })
  }

  async findByHash(hash: string): Promise<EnquiryReferenceDto> {
    const enquiry = await this.db.findUnique({
      where: {
        hash: hash,
      },
      ...this.getSelectInputs(),
    })
    return enquiry ? this.refOn(enquiry) : null
  }

  async findById(id: string) {
    const enquiry = await this.db.findUnique({
      where: {
        id,
      },
      ...this.getSelectInputs(),
    })
    return enquiry ? this.refOn(enquiry) : null
  }

  async getByStatus(status: EnquiryStatus) {
    return await this.prisma.enquiry.findMany({
      where: {
        status: status,
      },
      ...this.getSelectInputs(),
    })
  }

  async getCheckingTargets(): Promise<Partial<Enquiry>[] | []> {
    return await this.db.findMany({
      where: {
        OR: [
          {
            status: EnquiryStatus.WAITING,
          },
          {
            status: EnquiryStatus.PROCESSING,
            updatedAt: {
              lte: subMinutes(new Date(), 5),
            },
          },
        ],
      },
      ...this.getSelectInputs(),
    })
  }

  async makeAttempt(payload: AttemptPayload) {
    const {
        method,
        fields: { options, ...fields },
      } = payload,
      hash = deterministicHash({ method, ...fields }),
      enquiry = await this.findByHash(hash)
    return await (enquiry
      ? this.attemptOn(enquiry, options)
      : this.attemptFresh({ meta: payload, hash }))
  }

  async updateOnExternalResponse(enquiry: Enquiry) {
    const respondedEnquiry = await this.db.update({
      where: {
        id: enquiry.id,
      },
      data: {
        status: enquiry.status,
        meta: enquiry.meta as Prisma.JsonObject,
      },
      select: {
        id: true,
        meta: true,
      },
    })
    this.emitter.emit('enquiry.responded', {
      enquiryId: respondedEnquiry.id,
      externalId: respondedEnquiry.meta['odyssey']?.requestId,
    })
    return respondedEnquiry
  }

  async setSourceMeta(enquiry: EnquiryReferenceDto): Promise<Enquiry> {
    return await this.db.update({
      where: {
        id: enquiry.id,
      },
      data: {
        status: EnquiryStatus.PROCESSING,
        meta: enquiry.meta as Prisma.InputJsonObject,
      },
    })
  }

  makeResponseContext({ meta, ...enquiry }: EnquiryReferenceDto) {
    return {
      ...(meta?.odyssey?.resultUrl && {
        odysseyLink: meta.odyssey.resultUrl,
      }),
      ...(meta?.odyssey?.requestId && {
        odysseyToken: meta.odyssey.requestId,
      }),
      responseStatus: enquiry.status,
      actualDate: enquiry.updatedAt,
      originRequest: {
        ...meta.fields,
        ...enquiry?.lastAttempt?.meta,
      },
      requestToken: enquiry.id,
      isDataFromCache: this.isDataFromCache(enquiry),
    }
  }

  isComplete(enquiry: EnquiryReferenceDto): boolean {
    return enquiry.status === 'COMPLETE'
  }

  private async attemptFresh(payload) {
    const {
        fields: { options, ...fields },
        ...meta
      } = payload.meta,
      enquiryMeta = { ...meta, fields } as Prisma.JsonObject
    const enquiry = this.db.create({
      data: {
        hash: payload.hash,
        status: EnquiryStatus.ACCEPTED,
        meta: enquiryMeta,
        attempts: {
          create: {
            produced: EnquiryAttemptProducedType.CREATE,
            meta: options,
          },
        },
      },
      select: {
        id: true,
        hash: true,
        meta: true,
      },
    })
    this.emitter.emit('enquiry.incoming', enquiry)
    return enquiry
  }

  private async attemptOn(enquiry, options) {
    return options.refresh
      ? this.attemptRefresh(enquiry)
      : this.attemptGive(enquiry)
  }

  private async attemptRefresh(enquiry) {
    return await this.db.update({
      where: {
        id: enquiry.id,
      },
      data: {
        status: EnquiryStatus.WAITING,
        attempts: {
          create: {
            produced: EnquiryAttemptProducedType.REFRESH,
          },
        },
      },
      select: {
        id: true,
      },
    })
  }

  private async attemptGive(enquiry: Enquiry) {
    return await this.db.update({
      where: {
        id: enquiry.id,
      },
      data: {
        attempts: {
          create: {
            produced: EnquiryAttemptProducedType.GIVE,
          },
        },
      },
      select: {
        id: true,
      },
    })
  }

  private makeCreateByRequestPayloadInput({ method, fields }) {
    return {
      data: {
        status: EnquiryStatus.ACCEPTED,
        meta: {
          method: method,
          fields: fields,
        },
      },
    }
  }

  private getSelectInputs() {
    return {
      select: {
        ...(this.selectInputs ?? this.defaultInputs.select),
      },
    }
  }

  private refOn(enquiry: Partial<Enquiry>): EnquiryReferenceDto {
    return {
      ...enquiry,
      meta: enquiry.meta as EnquiryMetaDto,
    }
  }

  private isDataFromCache(enquiry: EnquiryReferenceDto): boolean {
    return !!enquiry?.lastAttempt && enquiry.lastAttempt.produced !== 'GIVE'
  }
}
