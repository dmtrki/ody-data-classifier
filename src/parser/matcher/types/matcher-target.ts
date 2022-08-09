import { PipelineRowDto } from '../../dtos/pipeline-row.dto'

export type MatcherTargetContext = {
  tags?: string[]
  title: string
  siblings?: PipelineRowDto[] | string[]
}

export type MatcherTarget = {
  label: string
  value: string
  context: MatcherTargetContext
}
