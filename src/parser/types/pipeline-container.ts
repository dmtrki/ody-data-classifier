import { PipelineBlockDto, PipelineUnionDto } from '../dtos/pipeline-block.dto'

export type ComposedBlock = PipelineBlockDto | PipelineUnionDto
