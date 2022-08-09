import {
  concatMap,
  filter,
  from,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
} from 'rxjs'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { fullnameToSex } from '../transformers/fullname-to-sex'
import { Arrable } from '../../../app/utils/types/arrable'

export class FullnameEffector {
  private type = 'fullname'

  async compute(row: PipelineRowDto): Promise<PipelineRowDto> {
    const value = await fullnameToSex(row.value)
    return {
      ...row,
      value: value ?? null,
      label: 'computed from fullname',
      type: value ? 'sex' : null,
    }
  }

  private isPermitted(rowType): boolean {
    return rowType === this.type
  }
}
