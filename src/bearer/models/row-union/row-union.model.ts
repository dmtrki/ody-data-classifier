import { RowModel } from '../row/row.model'
import { BaseModel } from '../base.model'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { PipelineUnionDto } from '../../../parser/dtos/pipeline-block.dto'
import { Prisma, PrismaClient, PrismaPromise } from '@prisma/client'
import { PipelineRowDto } from '../../../parser/dtos/pipeline-row.dto'
import { AdaptedPipelineRowDto } from '../row/row-reference.dto'
import { RowUnionReferenceDto } from './row-union-reference.dto'
import { InternalError } from '../../../app/filters/internal-error.exception'
import { PrismaService } from '../../../app/prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { InjectMapper } from '@automapper/nestjs'
import { Mapper } from '@automapper/core'
import { UpsertRowUnionDto } from '../../dtos/prisma/row-union/upsert-row-union.dto'

@Injectable()
export class RowUnionModel extends BaseModel {
  protected prismaMemberKey = 'rowUnion'
  protected ref: RowUnionReferenceDto
  protected db: PrismaClient['rowUnion']

  constructor(
    protected prisma: PrismaService,
    protected emitter: EventEmitter2,
    @InjectMapper() protected mapper: Mapper,
    protected logger: Logger
  ) {
    super(prisma, emitter, mapper)
    this.setDatabaseClient(prisma)
  }

  handlePipelineDto(union: PipelineUnionDto): PrismaPromise<UpsertRowUnionDto> {
    try {
      return this.db.upsert(this.makeUpsertInput(union))
    } catch (e) {
      throw new InternalError(
        e,
        'pipeline union handling failed',
        'RowUnionModel'
      )
    }
  }

  private makeUpsertInput({
    unionHash,
    union,
  }: PipelineUnionDto): Prisma.RowUnionUpsertArgs {
    return {
      where: {
        hash: unionHash,
      },
      create: {
        hash: unionHash,
        type: {
          connect: {
            key: union,
          },
        },
      },
      update: {},
    }
  }

  private makeConnectOrCreateRowsInput(
    rows: PipelineRowDto[]
  ): Prisma.Enumerable<Prisma.RowCreateOrConnectWithoutUnionInput> {
    return rows.map(
      (pipelineRow): Prisma.RowCreateOrConnectWithoutUnionInput => {
        const row = this.mapper.map(
          pipelineRow,
          PipelineRowDto,
          AdaptedPipelineRowDto
        )
        return {
          where: {
            hash: row.hash,
          },
          create: {
            ...RowModel.makeCreateInput(row),
          },
        }
      }
    )
  }
}
