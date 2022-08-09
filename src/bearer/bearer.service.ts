import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../app/prisma/prisma.service'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { PipelineUnionDto } from '../parser/dtos/pipeline-block.dto'
import { ComposedBlock } from '../parser/types/pipeline-container'
import { InternalError } from '../app/filters/internal-error.exception'
import { RowModel } from './models/row/row.model'
import { RowUnionModel } from './models/row-union/row-union.model'
import { PrismaPromise, Row } from '@prisma/client'
import deterministicHash from 'deterministic-object-hash'
import { RowUnion } from './types/tree-group-branch'
import { UpsertRowUnionDto } from './dtos/prisma/row-union/upsert-row-union.dto'

@Injectable()
export class BearerService {
  constructor(
    private prisma: PrismaService,
    private emitter: EventEmitter2,
    private rowModel: RowModel,
    private rowUnionModel: RowUnionModel,
    private logger: Logger
  ) {}

  async handleParserComposedBlocks(data: Set<ComposedBlock>) {
    try {
      const [unions, rows] = this.composeTransaction(data)
      await this.prisma.$transaction(unions)
      await this.prisma.$transaction(rows)
    } catch (error) {
      throw new InternalError(error, 'transaction failed')
    }
  }

  private composeTransaction(
    dataset: Set<ComposedBlock>
  ): [PrismaPromise<UpsertRowUnionDto>[], PrismaPromise<Row>[]] {
    const unions: PrismaPromise<UpsertRowUnionDto>[] = [],
      rows: PrismaPromise<Row>[] = [],
      transactedEnquiries: string[] = []

    for (const { data, enquiryRef, ...block } of dataset) {
      if (!transactedEnquiries.includes(enquiryRef.id)) {
        transactedEnquiries.push(enquiryRef.id)
      }
      const unionHash = block.union ? deterministicHash(data) : null
      if (unionHash) {
        unions.push(
          this.rowUnionModel.handlePipelineDto({
            ...block,
            unionHash,
          } as PipelineUnionDto)
        )
      }
      for (const row of data) {
        rows.push(this.rowModel.handlePipelineDto({ ...row, unionHash }))
      }
    }
    if (transactedEnquiries.length) {
      this.completeEnquiries(transactedEnquiries)
    }
    return [unions, rows]
  }

  private completeEnquiries(transactedEnquiries: string[]): void {
    this.emitter.emit('enquiry.complete', transactedEnquiries)
  }
}
