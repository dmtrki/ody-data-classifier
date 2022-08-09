import { DataGroupModel } from '../models/data-group.model'
import { RowModel } from '../models/row/row.model'
import { RowTypeModel } from '../models/row-type.model'
import { RowUnionModel } from '../models/row-union/row-union.model'
import { RowUnionTypeModel } from '../models/row-union-type.model'
import { TypeDetectionCaseModel } from '../models/type-detection-case.model'
import { EnquiryModel } from '../models/enquiry.model'

export const modelsMap = {
  dataGroup: DataGroupModel,
  row: RowModel,
  rowType: RowTypeModel,
  rowUnion: RowUnionModel,
  rowUnionType: RowUnionTypeModel,
  typeDetectionCase: TypeDetectionCaseModel,
  enquiry: EnquiryModel,
}

export type ModelKey = keyof typeof modelsMap
export type ModelInstance<T> = T extends new () => infer R ? R : T
