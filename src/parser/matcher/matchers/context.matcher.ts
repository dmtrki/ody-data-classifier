import { Matcher } from './matcher.interface'
import { ContextTargets } from '../../types/triggers'
import { Injectable } from '@nestjs/common'
import { BasicMatcher } from './basic.matcher'

@Injectable()
export class ContextMatcher implements Matcher {
  constructor(private readonly basicMatcher: BasicMatcher) {}

  public firstMatch(testingContext, contextTriggers: ContextTargets): boolean {
    const matches = this.matches(testingContext, contextTriggers)
    return matches.some((m) => !!m)
  }

  public match(testingContext, contextTriggers: ContextTargets): boolean {
    const matches = this.matches(testingContext, contextTriggers)
    return matches.every((m) => !!m)
  }

  public matches(testingContext, contextTriggers: ContextTargets): string[] {
    const matches = []
    if (
      contextTriggers?.tags &&
      testingContext?.tags &&
      Array.isArray(testingContext.tags)
    ) {
      const tagsMatches = []
      for (const testingTag of testingContext.tags) {
        tagsMatches.push(
          this.basicMatcher.matches(testingTag, contextTriggers.tags)
        )
      }
      matches.push(tagsMatches.some((m) => !!m))
    }
    return matches
  }
}
