import { unionTypesMap } from '../../parser/maps/union-types-map'
import { DataGroupKey } from './tree-group-branch'
import { RowTypeKey } from '../../report/dtos/report-tree-leaf-dto'

export type RowUnionKey = keyof typeof unionTypesMap

export type DataRowUnion = {
  types: RowTypeKey[]
  isMultiple: boolean
  id?: string
  key?: RowUnionKey
  hash?: string
  parent?: string
  group?: DataGroupKey | number
  createdAt?: Date
  updatedAt?: Date
}

export type UnionsMap = Record<RowUnionKey, DataRowUnion>
