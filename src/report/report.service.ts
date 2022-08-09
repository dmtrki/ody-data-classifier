import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../app/prisma/prisma.service'
import { ReportTreeBuilder } from './report-tree.builder'
import { InjectMapper } from '@automapper/nestjs'
import { Mapper } from '@automapper/core'
import { TreeSourceDto } from './dtos/tree-source.dto'
import { DataTree } from './types/data-tree'
import { Enquiry, Identity, Row } from '@prisma/client'
import { EnquiryStatus } from './types/enquiry.status'
import { EnquiryModel } from '../bearer/models/enquiry.model'
import { EnquiryReferenceDto } from '../enquiry/dtos/enquiry-reference.dto'
import { SuccessResponseDto } from '../app/response/dtos/success.response.dto'
import { ReportDataDto } from './dtos/report-data-groups.dto'
import { ResponseFactory } from '../app/response/response.factory'

type LastEnquiriesReport = (Enquiry & {
  identities: Identity[]
  rows: (Row & { type: { key: string; group: { key: string } } })[]
})[]

@Injectable()
export class ReportService {
  constructor(
    private prisma: PrismaService,
    private builder: ReportTreeBuilder,
    private enquiries: EnquiryModel,
    private responseFactory: ResponseFactory,
    @InjectMapper() private mapper: Mapper
  ) {}

  async getOne(enquiryId: string): Promise<SuccessResponseDto<ReportDataDto>> {
    const enquiry = await this.enquiries
      .select({
        id: true,
        status: true,
        meta: true,
        updatedAt: true,
        attempts: {
          select: {
            createdAt: true,
            meta: true,
          },
        },
        identities: true,
      })
      .findById(enquiryId)

    if (!enquiry) {
      throw new NotFoundException({ enquiryId: enquiryId })
    }

    return this.formatReportOutput(enquiry)
  }

  async formatReportOutput(
    enquiry: EnquiryReferenceDto
  ): Promise<SuccessResponseDto<ReportDataDto>> {
    const { odysseyLink, odysseyToken, ...enquiryContext } =
        this.enquiries.makeResponseContext(enquiry),
      data = { odysseyLink, odysseyToken, dataset: null }
    if (this.enquiries.isComplete(enquiry)) {
      data.dataset = await this.getDataTree(enquiry.id)
    }
    return this.responseFactory.report(enquiryContext, {
      odysseyLink,
      odysseyToken,
      ...data,
    })
  }

  async getDataTree(enquiryId: string): Promise<DataTree> {
    const rows = await this.prisma.row.findMany({
      where: {
        enquiryId: enquiryId,
      },
      select: {
        enquiryId: true,
        hash: true,
        value: true,
        meta: true,
        identityId: true,
        createdAt: true,
        union: {
          select: {
            hash: true,
            type: {
              select: {
                key: true,
              },
            },
          },
        },
        type: {
          select: {
            key: true,
            group: {
              select: {
                key: true,
              },
            },
          },
        },
      },
    })
    if (!rows || !rows.length) return null

    return this.builder.distributeRows(rows as TreeSourceDto[]).getTree()
  }

  async getLast(
    limit: number,
    include?: boolean
  ): Promise<LastEnquiriesReport> {
    return await this.prisma.enquiry.findMany({
      take: limit,
      orderBy: {
        updatedAt: 'desc',
      },
      ...(include && {
        include: {
          rows: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              type: {
                select: {
                  key: true,
                  group: {
                    select: {
                      key: true,
                    },
                  },
                },
              },
            },
          },
          identities: true,
        },
      }),
    })
  }

  private getBaseProps(enquiry: EnquiryReferenceDto) {
    return {
      requestToken: enquiry.id,
      responseStatus: enquiry.status,
      statusCode: enquiry.status === EnquiryStatus.ERROR ? 500 : 200,
      actualDate: enquiry.updatedAt,
      currentProcessingDuration: '',
      isError: enquiry.status === EnquiryStatus.ERROR,
      ...(enquiry.status === EnquiryStatus.ERROR && {
        errorMessage: enquiry?.meta?.odyssey?.post?.error || 'unknown error',
      }),
      isCached: true,
      isDataFromCache: true,
      originRequest: enquiry.meta.fields,
    }
  }

  private getDataMeta(enquiry) {
    return {
      createdAt: enquiry.createdAt,
      attempts: enquiry.attempts,
      ...enquiry.meta,
    }
  }
}
