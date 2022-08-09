import { Injectable, Logger } from '@nestjs/common'
import { catchError, map, Observable, partition, Subscription } from 'rxjs'
import { SourceExtractor } from './source-extractor'
import { UnknownObserver } from './observers/unknown.observer'
import { CheckedEnquiry } from './types/parser-payload'
import { SourceBlock } from './types/pipeline-entities'
import { PipelineRowDto } from './dtos/pipeline-row.dto'
import { ModuleRef } from '@nestjs/core'
import { InterpretationPipeline } from './lines/interpretation.pipeline'
import { CompositionPipeline } from './lines/composition.pipeline'
import { InterpretationObserver } from './observers/interpretation.observer'
import { InternalError } from '../app/filters/internal-error.exception'

@Injectable()
export class ParserService {
  private pipes

  constructor(
    private sourceExtractor: SourceExtractor,
    private interpretation: InterpretationPipeline,
    private composition: CompositionPipeline,
    private moduleRef: ModuleRef,
    private logger: Logger
  ) {}

  async handleEnquiry(enquiry: CheckedEnquiry) {
    this.logger.debug(enquiry, 'Starting enquiry parsing')
    const source$ = await this.sourceExtractor.fromEnquiry(enquiry)
    return this.parse(source$)
  }

  private async parse(data$: Observable<SourceBlock>) {
    const [interpreted$, unknown$] = partition(
      data$.pipe(
        this.interpretation.pipe(),
        catchError((error) => {
          throw new InternalError(
            error,
            'error on interpretation pipeline',
            'ParserService'
          )
        })
      ),
      ({ value, type }) => !!value && !!type
    )

    unknown$.subscribe(await this.moduleRef.create(UnknownObserver))
    await this.directInterpretation(interpreted$)
  }

  private async directInterpretation(
    interpreted$: Observable<PipelineRowDto>
  ): Promise<Subscription> {
    const data$ = await this.composition.handle(interpreted$)
    return data$
      .pipe(
        catchError((error) => {
          throw new InternalError(
            error,
            'error on composition pipeline',
            'ParserService'
          )
        })
      )
      .subscribe(await this.moduleRef.resolve(InterpretationObserver))
  }
}
