import { RowTypeModel } from './row-type.model'
import { BaseModel } from './base.model'

export class TypeDetectionCaseModel extends BaseModel {
  id!: string
  hash!: string
  type!: RowTypeModel
  typeId!: number
}
