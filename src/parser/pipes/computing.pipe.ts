import {
  concatMap,
  from,
  merge,
  MonoTypeOperatorFunction,
  Observable,
  pipe,
  filter,
  of,
  map,
  toArray,
  mergeMap,
  ObservableInput,
  distinct,
} from 'rxjs'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { IParserPipe } from './types/parsing-pipe.interface'
import { RowTypeKey } from '../../report/dtos/report-tree-leaf-dto'
import { FullnameEffector } from './effectors/fullname.effector'
import { MovementFromEffector } from './effectors/movement-from.effector'
import { isUndefined } from '@nestjs/common/utils/shared.utils'

export class ComputingPipe implements IParserPipe<PipelineRowDto> {
  private typeEffectsMap = {
    fullname: new FullnameEffector(),
    movementFrom: new MovementFromEffector(),
  }
  private effectTypeKeys: string[]

  constructor() {
    this.effectTypeKeys = Object.keys(this.typeEffectsMap)
  }

  pipe(): MonoTypeOperatorFunction<PipelineRowDto> {
    return pipe(
      filter((row) => this.hasEffect(row.type)),
      mergeMap((row: PipelineRowDto) => this.destruct(row)),
      filter((row) => !!(!isUndefined(row) && row.type)),
      distinct()
    )
  }

  private hasEffect(rowType: RowTypeKey): boolean {
    return this.effectTypeKeys.includes(rowType)
  }

  private destruct(row: PipelineRowDto): ObservableInput<PipelineRowDto> {
    const effect = this.typeEffectsMap[row.type]
    return effect.compute(row)
  }
}
