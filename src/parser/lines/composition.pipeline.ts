import {
  concatMap,
  Observable,
  of,
  concatWith,
  lastValueFrom,
  distinct,
} from 'rxjs'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { ComposingPipe } from '../pipes/composing.pipe'
import { ReferencingPipe } from '../pipes/referencing.pipe'
import { IdentifyingPipe } from '../pipes/identifying.pipe'
import { ComputingPipe } from '../pipes/computing.pipe'
import { Injectable } from '@nestjs/common'
import { IdentifiedBlockDto } from '../dtos/pipeline-block.dto'
import { composeBlockBy } from '../pipes/operators/compose-block-by.operator'
import { logRx } from '../../app/utils/operators/log-rx.operator'

@Injectable()
export class CompositionPipeline {
  private pipes

  constructor(
    private referencing: ReferencingPipe,
    private identifying: IdentifyingPipe
  ) {
    this.pipes = {
      composing: new ComposingPipe().pipe(),
      computing: new ComputingPipe().pipe(),
      referencing: referencing.pipe(),
      identifying: identifying.pipe(),
    }
  }

  async handle(
    interpreted$: Observable<PipelineRowDto>
  ): Promise<Observable<IdentifiedBlockDto>> {
    const refs$ = await lastValueFrom(
        interpreted$.pipe(this.pipes.referencing)
      ),
      computed$ = interpreted$.pipe(
        this.pipes.computing,
        distinct((row: PipelineRowDto) => row.value)
      )
    return interpreted$.pipe(
      concatWith(computed$),
      composeBlockBy((row) => row.parent.hash),
      concatMap((block) => of([block, refs$])),
      this.pipes.identifying,
      this.pipes.composing
    )
  }
}
