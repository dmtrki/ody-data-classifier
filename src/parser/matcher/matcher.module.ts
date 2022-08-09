import { Module } from '@nestjs/common'
import { MatcherService } from './matcher.service'
import { TargetMatcher } from './matchers/target.matcher'
import { ExistenceMatcher } from './matchers/existence.matcher'
import { BasicMatcher } from './matchers/basic.matcher'
import { ContextMatcher } from './matchers/context.matcher'

@Module({
  providers: [
    MatcherService,
    BasicMatcher,
    ExistenceMatcher,
    TargetMatcher,
    ContextMatcher,
  ],
  exports: [MatcherService],
})
export class MatcherModule {}
