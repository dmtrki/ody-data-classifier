import { Qualifier } from '../types/qualifier.interface'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'

enum IdentityPropsByTypesEnum {
  itn = 'itn',
  insurance = 'insurance',
  passportSerialNum = 'passport',
  fullname = 'fullname',
  birth = 'birth',
}

export const typesToPropsMap = {
  itn: 'itn',
  insurance: 'insurance',
  passportSerialNum: 'passport',
  fullname: 'fullname',
  birth: 'birth',
} as const

export type TypesToPropsKeys = keyof typeof typesToPropsMap
export type PropTypeKey = typeof typesToPropsMap[TypesToPropsKeys]
export type TypesToPropsMap = Partial<Record<TypesToPropsKeys, PropTypeKey>>
export type PropValue = {
  [key in PropTypeKey]?: string
}

export class RowDeterminismQualifier
  implements Qualifier<PipelineRowDto, PropValue | null>
{
  private typesToPropsMap: TypesToPropsMap = {
    ...typesToPropsMap,
  }

  public qualify(row: PipelineRowDto): PropValue | null {
    const propKey = this.typesToPropsMap[row.type]
    return propKey ? { [propKey]: row.value } : null
  }
}
