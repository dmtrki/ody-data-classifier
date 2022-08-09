import { RowTypeKey } from '../../report/dtos/report-tree-leaf-dto'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { XOR } from '../../app/utils/types'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import { EnquiryReference } from './parser-payload'

export type SourceRow = [string, string]
export type SourceBlockBody = SourceRow[]

export type SourceBlock = {
  enquiryRef?: EnquiryReference
  title: string
  body: SourceBlockBody
}

export type ExtractionSet = Set<SourceBlock>

export type UnknownBlock = PipelineBlockDto & {
  isUnknownContainer: true
}

export type UnknownRow = Omit<PipelineRowDto, 'type'> & {
  type: null
}

export type InterpretedRow = Omit<PipelineRowDto, 'type'> & {
  type: RowTypeKey
}

export type ProcessedRow = XOR<InterpretedRow, UnknownRow>
