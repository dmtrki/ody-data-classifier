import { groupBy, map, mergeMap, OperatorFunction, pipe, toArray } from 'rxjs'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'

export function toArrayByGroup(predicate: (row: PipelineRowDto) => unknown) {
  return pipe(
    groupBy(predicate),
    mergeMap((row) => row.pipe(toArray()))
  )
}

export function composeBlockFrom() {
  return map(
    (rows: PipelineRowDto[]): PipelineBlockDto => ({
      ...rows[0].parent,
      ...(rows[0].union && { union: rows[0].union }),
      data: rows.map(({ parent: { data, ...block }, ...row }) => ({
        ...row,
        parent: block,
      })),
    })
  )
}

export function composeBlockBy(
  predicate: (row: PipelineRowDto) => unknown
): OperatorFunction<PipelineRowDto, PipelineBlockDto> {
  return pipe(toArrayByGroup(predicate), composeBlockFrom())
}
