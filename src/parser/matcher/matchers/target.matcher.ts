import { Matcher } from './matcher.interface'
import { Injectable } from '@nestjs/common'
import { ContextMatcher } from './context.matcher'
import { BasicMatcher } from './basic.matcher'

@Injectable()
export class TargetMatcher implements Matcher {
  constructor(
    private readonly contextMatcher: ContextMatcher,
    private readonly basicMatcher: BasicMatcher
  ) {}

  public firstMatch(substrate, triggers): boolean {
    return this.matches(substrate, triggers).some((m) => !!m)
  }

  public match(substrate, triggers): boolean {
    return this.matches(substrate, triggers).every((m) => !!m)
  }

  public matches(substrate, triggers): string[] {
    const matches = []

    for (const targetKey in triggers) {
      if (!substrate[targetKey]) continue
      const target = substrate[targetKey],
        targetTriggers = triggers[targetKey]
      if (targetKey === 'label') {
        const match = this.basicMatcher.match(target, targetTriggers)
        matches.push(match ? target : false)
      }
      if (targetKey === 'value') {
        const valueTriggers = Array.isArray(targetTriggers)
          ? { regex: targetTriggers }
          : targetTriggers

        const match = this.basicMatcher.match(target, valueTriggers)
        matches.push(match ? target : false)
      }
      if (targetKey === 'context') {
        const match = this.contextMatcher.match(target, targetTriggers)
        matches.push(match ? target : false)
      }
    }
    return matches
  }
}
