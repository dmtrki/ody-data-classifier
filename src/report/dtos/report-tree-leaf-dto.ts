import { rowTypeTriggersMap } from '../../parser/maps/row-type-triggers.map'
import { Identity } from '@prisma/client'
import { DataGroupKey } from '../../bearer/types/tree-group-branch'
import { RowUnionKey } from '../../bearer/types/data-row-union'
import { RowMetaDto } from '../../bearer/models/row/row-reference.dto'
import { AutoMap } from '@automapper/classes'

export type RowTypeKey = keyof typeof rowTypeTriggersMap | 'unknown'
export class ReportTreeLeafDto {
  @AutoMap()
  value: string

  @AutoMap()
  type?: RowTypeKey

  @AutoMap()
  group?: DataGroupKey

  @AutoMap()
  union?: RowUnionKey

  @AutoMap()
  identityId?: string

  @AutoMap()
  from?: string

  @AutoMap(() => RowMetaDto)
  meta?: RowMetaDto

  @AutoMap()
  hash?: string

  @AutoMap()
  createdAt: Date
}
