import {
  filter,
  groupBy,
  map,
  mergeMap,
  OperatorFunction,
  pipe,
  toArray,
} from 'rxjs'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'
import { composeBlockBy } from './compose-block-by.operator'

export function composeBlock(): OperatorFunction<
  PipelineRowDto,
  PipelineBlockDto
> {
  return pipe(
    filter((row) => !!row),
    composeBlockBy((row) => row.parent.hash)
  )
}
