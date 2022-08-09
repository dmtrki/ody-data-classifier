import {
  Controller,
  Get,
  HttpException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common'
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger'
import { PrismaService } from '../app/prisma/prisma.service'
import { UtilsService } from './utils.service'
import { ParserService } from '../parser/parser.service'
import { EnquiryStatus, Prisma } from '@prisma/client'
import deterministicHash from 'deterministic-object-hash'
import { EventEmitter2 } from '@nestjs/event-emitter'

@ApiTags('utils')
@Controller('utils')
export class UtilsController {
  constructor(
    private parser: ParserService,
    private prisma: PrismaService,
    private service: UtilsService,
    private emitter: EventEmitter2
  ) {}

  @Get('identity/:uuid')
  async getIdentityData(@Param('uuid', ParseUUIDPipe) id: string) {
    return await this.prisma.identity.findFirst({
      where: {
        id: id,
      },
      include: {
        enquiries: true,
        rows: true,
      },
    })
  }

  @Get('cache/purge')
  @ApiOperation({
    description: 'Удаляет все накопленные данные',
  })
  async purgeCache() {
    const deleteEnquiries = this.prisma.enquiry.deleteMany({
      where: {},
    })
    const deleteIdentities = this.prisma.identity.deleteMany({
      where: {},
    })
    const deleteUnions = this.prisma.rowUnion.deleteMany({
      where: {},
    })
    const deleteRows = this.prisma.row.deleteMany({
      where: {},
    })
    await this.prisma.$transaction([
      deleteEnquiries,
      deleteIdentities,
      deleteUnions,
      deleteRows,
    ])
  }

  @ApiExcludeEndpoint()
  @Get('parse/odyssey/:odysseyId')
  async parseOdyssey(@Param('odysseyId') odysseyId: string) {
    const sourceUrl = 'https://odyssey-search.info/request?v=' + odysseyId,
      rawHtml = await this.service.fetchSourceHtml(sourceUrl)
    const simulatedEnquiry = this.service.likeEnquiryRequest(rawHtml)
    if (!simulatedEnquiry) {
      throw new HttpException('Not found', 404)
    }

    const hash = deterministicHash(simulatedEnquiry)

    const exists = await this.prisma.enquiry.findUnique({
      where: {
        hash: hash,
      },
      select: {
        id: true,
        meta: true,
      },
    })
    let existsMeta = null
    if (exists) {
      await this.service.clearEnquiryCache(exists.id)
      if (exists?.meta) {
        existsMeta = { ...existsMeta, ...simulatedEnquiry } as Prisma.JsonObject
        existsMeta['odyssey'] = {
          ...existsMeta['odyssey'],
          odyssey: {
            resultUrl: sourceUrl,
          },
        }
      }
    }

    const enquiry = await this.prisma.enquiry.upsert({
      where: {
        hash,
      },
      update: {
        status: EnquiryStatus.PROCESSING,
        meta: existsMeta ?? {
          odyssey: {
            resultUrl: sourceUrl,
          },
        },
      },
      create: {
        hash,
        status: EnquiryStatus.PROCESSING,
        meta: existsMeta ?? {
          odyssey: {
            resultUrl: sourceUrl,
          },
        },
      },
      select: {
        id: true,
        status: true,
        meta: true,
      },
    })
    const responseData = { data: { url: sourceUrl } }
    this.emitter.emit('checking.success', { enquiry, responseData })
    return enquiry.id
  }
}
