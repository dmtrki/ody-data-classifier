import { Injectable } from '@nestjs/common'
import { SourceBlock } from '../types/pipeline-entities'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { OperatorFunction, pipe } from 'rxjs'
import { SourceMappingPipe } from '../pipes/source-mapping.pipe'
import { ContextualizingPipe } from '../pipes/contextualizing.pipe'
import { FormattingPipe } from '../pipes/formatting.pipe'
import { extractRows } from '../pipes/operators/extract-rows.operator'
import { TaxonomizingPipe } from '../pipes/taxonomizing.pipe'
import { ClearingPipe } from '../pipes/clearing.pipe'
import { logRx } from '../../app/utils/operators/log-rx.operator'

@Injectable()
export class InterpretationPipeline {
  private pipes = {
    sourceMapping: new SourceMappingPipe().pipe(),
    contextualizing: this.contextualizing.pipe(),
    formatting: new FormattingPipe().pipe(),
    taxonomizing: this.taxonomizing.pipe(),
    clearing: new ClearingPipe().pipe(),
  }

  constructor(
    private contextualizing: ContextualizingPipe,
    private taxonomizing: TaxonomizingPipe
  ) {}

  pipe(): OperatorFunction<SourceBlock, PipelineRowDto> {
    return pipe(
      this.formalize(),
      this.pipes.taxonomizing,
      logRx('taxonomizing', false, (it) => it.type === 'zipped'),
      this.pipes.formatting
    )
  }

  private formalize(): OperatorFunction<SourceBlock, PipelineRowDto> {
    return pipe(
      this.pipes.sourceMapping,
      this.pipes.contextualizing,
      extractRows()
    )
  }
}
