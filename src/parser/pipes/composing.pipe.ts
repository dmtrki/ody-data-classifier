import { IParserPipe } from './types/parsing-pipe.interface'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import {
  concatMap,
  from,
  groupBy,
  GroupedObservable,
  map,
  mergeMap,
  Observable,
  OperatorFunction,
  toArray,
  pipe,
} from 'rxjs'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { ComposedBlock } from '../types/pipeline-container'

export class ComposingPipe
  implements IParserPipe<PipelineBlockDto, ComposedBlock>
{
  public pipe(): OperatorFunction<PipelineBlockDto, ComposedBlock> {
    return pipe(
      concatMap(
        ({ data, ...block }: PipelineBlockDto): Observable<ComposedBlock> => {
          return from(data ?? []).pipe(
            map(
              (row: PipelineRowDto): PipelineRowDto => ({
                ...row,
                parent: { ...block },
              })
            ),
            groupBy((row: PipelineRowDto) => row.union),
            mergeMap((row) => row.pipe(toArray())),
            map(
              (rows: PipelineRowDto[]): ComposedBlock => ({
                ...rows[0].parent,
                union: rows[0].union,
                data: rows,
              })
            )
          )
        }
      )
    )
  }
}
