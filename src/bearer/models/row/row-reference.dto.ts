import { AutoMap } from '@automapper/classes'
import { Identity, Prisma } from '@prisma/client'
import { RowTypeModel } from '../row-type.model'
import { RowTypeKey } from '../../../report/dtos/report-tree-leaf-dto'
import { RowUnionModel } from '../row-union/row-union.model'
import { RowUnionKey } from '../../types/data-row-union'
import { XOR } from '../../../app/utils/types'
import {
  IdentifiedBlockDto,
  PipelineBlockDto,
} from '../../../parser/dtos/pipeline-block.dto'
import { MapperOmitType } from '@automapper/classes/mapped-types'
import {
  IdentityPropsDto,
  IdentityRefProps,
} from '../../../parser/types/identification'
import { ParserIdentityRef } from '../../../parser/parser-identity-ref'

export class RowMetaParentDto extends MapperOmitType(IdentifiedBlockDto, [
  'data',
  'identityId',
  'enquiryRef',
]) {}

export class RowMetaDto {
  label: string
  parent: RowMetaParentDto
}

export class AdaptedPipelineRowDto {
  value: string
  hash: string
  enquiryId: string
  meta: RowMetaDto & Prisma.JsonObject
  typeKey?: RowTypeKey
  identityId?: string
  unionType?: string
  unionHash?: string
}

export class RowReferenceDto extends AdaptedPipelineRowDto {
  id?: string
  createdAt?: Date
  type?: RowTypeModel
  typeId?: number
  union?: RowUnionModel
  unionId?: string
  identity?: Identity
}
