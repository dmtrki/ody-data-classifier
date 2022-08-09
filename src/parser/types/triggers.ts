import { XOR } from '../../app/utils/types'
import { Arrable } from '../../app/utils/types/arrable'

export type ExistenceCondition<T> = {
  has?: T
  not?: T
}

export type TriggerJunction<T> = {
  OR?: OptionalExistenceWrap<T> | Array<OptionalExistenceWrap<T>>
  AND?: OptionalExistenceWrap<T> | Array<OptionalExistenceWrap<T>>
} & Arrable<T>

export type OptionalExistenceWrap<T> = XOR<T, ExistenceCondition<T>>

export type BasicTriggers = {
  exacts?: string[]
  occurs?: string[]
  regex?: RegexTriggers
}

export type RegexTriggers = RegExp[] | string[]

export type TriggersTargets = {
  label?: BasicTriggers | string[] | string
  value?: RegexTriggers
  context?: ContextTargets
}

export type ContextTargets = {
  title?: OptionalExistenceWrap<BasicTriggers>
  siblings?: OptionalExistenceWrap<PositionCondition>
  tags?: string[]
}

export type PositionCondition = {
  anywhere?: Pick<TriggersTargets, 'label' | 'value'>
  before?: Pick<TriggersTargets, 'label' | 'value'>
  after?: Pick<TriggersTargets, 'label' | 'value'>
  previous?: Pick<TriggersTargets, 'label' | 'value'>
  next?: Pick<TriggersTargets, 'label' | 'value'>
}
