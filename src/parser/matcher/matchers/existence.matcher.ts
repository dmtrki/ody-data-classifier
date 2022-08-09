import { Matcher } from './matcher.interface'
import { Injectable } from '@nestjs/common'
import { TargetMatcher } from './target.matcher'

@Injectable()
export class ExistenceMatcher implements Matcher {
  constructor(private readonly targetMatcher: TargetMatcher) {}

  public firstMatch(substrate, triggers): boolean {
    return this.match(substrate, triggers)
  }

  public match(substrate, triggers): boolean {
    const has =
        'has' in triggers
          ? this.targetMatcher.match(substrate, triggers.has)
          : true,
      not =
        'not' in triggers
          ? !this.targetMatcher.match(substrate, triggers.not)
          : true
    return has && not
  }

  public matches(substrate, triggers): string[] {
    return []
  }
}
