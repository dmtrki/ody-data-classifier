import { PipelineRowDto } from './pipeline-row.dto'
import { RowUnionKey } from '../../bearer/types/data-row-union'
import { EnquiryReference } from '../types/parser-payload'
import { IdentityRefProps } from '../types/identification'

export class PipelineBlockDto {
  enquiryRef: EnquiryReference
  title: string
  data?: PipelineRowDto[]
  tags?: string[]
  year?: number
  hash?: string
  union?: RowUnionKey
  unionHash?: string
  identityId?: string
  identityRef?: IdentityRefProps
}

export class PipelineUnionDto extends PipelineBlockDto {
  union: RowUnionKey
}

export class IdentifiedBlockDto extends PipelineBlockDto {
  identityId: string | null
  identityRef?: IdentityRefProps | null
}
