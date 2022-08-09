import { concatMap, from, map, OperatorFunction, pipe } from 'rxjs'
import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'

export function extractRows(): OperatorFunction<
  PipelineBlockDto,
  PipelineRowDto
> {
  return concatMap(({ data, ...block }: PipelineBlockDto) =>
    from(data ?? []).pipe(
      map(
        (row: PipelineRowDto): PipelineRowDto => ({
          ...row,
          parent: { ...block },
        })
      )
    )
  )
}
