import { Logger, Module } from '@nestjs/common'
import { ParserService } from './parser.service'
import { CheckingSuccessListener } from '../checker/listeners/checking-success.listener'
import { UnknownObserver } from './observers/unknown.observer'
import { InterpretationObserver } from './observers/interpretation.observer'
import { BearerModule } from '../bearer/bearer.module'
import { MockObserver } from './observers/mock.observer'
import { ParserMockingListener } from './listeners/parser-mockingListener'
import { SourceExtractor } from './source-extractor'
import { InterpretationPipeline } from './lines/interpretation.pipeline'
import { CompositionPipeline } from './lines/composition.pipeline'
import { RowTypeMatchingQualifier } from './pipes/qualifiers/row-type-matching.qualifier'
import { TitleTagsQualifier } from './pipes/qualifiers/title-tags.qualifier'
import { TaxonomizingPipe } from './pipes/taxonomizing.pipe'
import { ContextualizingPipe } from './pipes/contextualizing.pipe'
import { TypeUnionQualifier } from './pipes/qualifiers/type-union.qualifier'
import { MatcherModule } from './matcher/matcher.module'
import { ReferencingPipe } from './pipes/referencing.pipe'
import { IdentityModel } from '../bearer/models/identity/identity.model'
import { IdentifyingPipe } from './pipes/identifying.pipe'
import { IdentificationObserver } from './observers/identification.observer'
import { ParserCompleteListener } from './listeners/parser-complete.listener'

@Module({
  imports: [BearerModule, MatcherModule, IdentityModel],
  providers: [
    Logger,
    ParserService,
    SourceExtractor,
    InterpretationPipeline,
    TaxonomizingPipe,
    ContextualizingPipe,
    TypeUnionQualifier,
    RowTypeMatchingQualifier,
    TitleTagsQualifier,
    CompositionPipeline,
    ReferencingPipe,
    IdentifyingPipe,
    UnknownObserver,
    InterpretationObserver,
    MockObserver,
    IdentificationObserver,
    ParserMockingListener,
    ParserCompleteListener,
  ],
  exports: [ParserService],
})
export class ParserModule {}
