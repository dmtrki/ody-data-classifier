import {
  OptionalExistenceWrap,
  TriggerJunction,
  TriggersTargets,
} from './triggers'
import { RowTypeKey } from '../../report/dtos/report-tree-leaf-dto'
import { Arrable } from '../../app/utils/types/arrable'

export type RowTypeTriggers = TriggerJunction<
  OptionalExistenceWrap<TriggersTargets>
>
export type RowTypeTriggersMap = {
  [typeKey in RowTypeKey]?: Arrable<RowTypeTriggers>
}
