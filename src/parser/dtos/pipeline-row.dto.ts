import { RowTypeKey } from '../../report/dtos/report-tree-leaf-dto'
import { IdentifiedBlockDto, PipelineBlockDto } from './pipeline-block.dto'
import { RowUnionKey } from '../../bearer/types/data-row-union'

export class PipelineRowDto {
  label: string
  value: string
  type?: RowTypeKey
  union?: RowUnionKey
  unionHash?: string
  parent?: PipelineBlockDto
}
