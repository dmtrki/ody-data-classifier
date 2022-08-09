import { RowUnionKey } from '../../types/data-row-union'
import { RowReferenceDto } from '../row/row-reference.dto'

export class RowUnionReferenceDto {
  id?: string
  hash?: string
  createdAt?: Date
  updatedAt?: Date
  rows: RowReferenceDto[]
  type: RowUnionKey | unknown
  rowUnionTypeId!: number
}
