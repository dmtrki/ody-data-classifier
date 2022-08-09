import { Prisma, PrismaClient } from '@prisma/client'
import { EnquiryMetaDto } from '../../../enquiry/dtos/enquiry-meta.dto'
import { CreateRowDto } from '../../dtos/prisma/row/create-row.dto'
import { PipelineRowDto } from '../../../parser/dtos/pipeline-row.dto'
import { BaseModel } from '../base.model'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { AdaptedPipelineRowDto, RowReferenceDto } from './row-reference.dto'
import { RowAdapterMapper } from './row-adapter.mapper'
import { PipelineBlockDto } from '../../../parser/dtos/pipeline-block.dto'
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs'
import { addProfile, Mapper } from '@automapper/core'
import { InternalError } from '../../../app/filters/internal-error.exception'
import { PrismaService } from '../../../app/prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'

@Injectable()
export class RowModel extends BaseModel {
  protected prismaMemberKey = 'row'
  protected ref: RowReferenceDto
  @Inject(RowAdapterMapper)
  protected mapperProfile: RowAdapterMapper
  protected db: PrismaClient['row']

  private enquiryMethodFieldsToRowsMap = {
    personal: {
      firstname: 'firstname',
      lastname: 'lastname',
      patronymic: 'patronymic',
      birth: 'birth',
    },
    phone: {
      query: 'phoneNum',
    },
    passport: {
      query: 'passportSerialNum',
    },
    email: {
      query: 'email',
    },
    itn: {
      query: 'itn',
    },
    insurance: {
      query: 'insurance',
    },
    plate: {
      query: 'vehicleNum',
    },
    vin: {
      query: 'vehicleVin',
    },
  }

  constructor(
    protected prisma: PrismaService,
    protected emitter: EventEmitter2,
    @InjectMapper() protected mapper: Mapper,
    protected logger: Logger
  ) {
    super(prisma, emitter, mapper)
    this.setDatabaseClient(prisma)
  }

  handlePipelineDto(parserRow: PipelineRowDto) {
    try {
      const input = RowModel.makeUpsertInput(this.adaptParserItem(parserRow))
      return this.db.upsert(input)
    } catch (e) {
      throw new InternalError(e, 'pipeline block handling failed', 'RowModel')
    }
  }

  public adaptParserItem(row: PipelineRowDto): AdaptedPipelineRowDto {
    return this.mapper.map(row, PipelineRowDto, AdaptedPipelineRowDto)
  }

  public mapToRef(source: AdaptedPipelineRowDto): RowReferenceDto {
    return this.mapper.map(source, AdaptedPipelineRowDto, RowReferenceDto)
  }

  public static makeUpsertInput(
    row: AdaptedPipelineRowDto
  ): Prisma.RowUpsertArgs {
    return {
      where: {
        hash: row.hash,
      },
      create: this.makeCreateInput(row),
      update: {
        meta: row.meta,
      },
    }
  }

  public static makeCreateInput(
    row: AdaptedPipelineRowDto
  ): Prisma.RowCreateInput {
    return {
      value: row.value,
      hash: row.hash,
      type: {
        connect: {
          key: row.typeKey,
        },
      },
      enquiry: {
        connect: {
          id: row.enquiryId,
        },
      },
      ...(row?.identityId && {
        identity: {
          connect: {
            id: row.identityId,
          },
        },
      }),
      ...(row?.unionHash && {
        union: {
          connect: {
            hash: row.unionHash,
          },
        },
      }),
      meta: row.meta,
    }
  }
}
