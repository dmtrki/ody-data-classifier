import {
  concatMap,
  filter,
  from,
  MonoTypeOperatorFunction,
  Observable,
  of,
} from 'rxjs'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { fullnameToSex } from '../transformers/fullname-to-sex'
import { tagsToMovementType } from '../transformers/tags-to-movement-type'

export class MovementFromEffector {
  private type = 'movementFrom'

  compute(row: PipelineRowDto): Observable<PipelineRowDto> | null {
    if (!this.isPermitted(row.type)) return null
    return of(row).pipe(concatMap((row) => this.castMovementFromToType(row)))
  }

  private isPermitted(rowType): boolean {
    return rowType === this.type
  }

  private async castMovementFromToType(row): Promise<PipelineRowDto> {
    const value = tagsToMovementType(row.parent.tags)

    if (value) {
      return {
        ...row,
        value,
        label: 'computed from movementFrom',
        type: 'movementType',
      }
    }
  }
}
