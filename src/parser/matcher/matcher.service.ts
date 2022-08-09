import { Injectable } from '@nestjs/common'
import { BasicTriggers, TriggersTargets } from '../types/triggers'
import { RowTypeTriggers } from '../types/row-type-triggers'
import { Arrable } from '../../app/utils/types/arrable'
import { BasicMatcher } from './matchers/basic.matcher'
import { TargetMatcher } from './matchers/target.matcher'
import { ExistenceMatcher } from './matchers/existence.matcher'

@Injectable()
export class MatcherService {
  private basicKeys = ['occurs', 'exacts', 'regex']
  private existenceKeys = ['has', 'not']
  private positionKeys = ['anywhere', 'before', 'after', 'previous', 'next']
  private targetKeys = ['label', 'value', 'context']
  private junctionKeys = ['OR', 'AND']

  constructor(
    private readonly basicMatcher: BasicMatcher,
    private readonly targetMatcher: TargetMatcher,
    private readonly existenceMatcher: ExistenceMatcher
  ) {}

  public test(
    target,
    triggers: Arrable<RowTypeTriggers | BasicTriggers>
  ): boolean {
    if (this.isEmptyTriggers(triggers)) return false
    if (typeof target === 'string') {
      return this.basicMatcher.match(target, triggers)
    } else if (Array.isArray(triggers)) {
      triggers = { OR: triggers }
    }

    for (const triggerKey in triggers) {
      if (triggerKey === 'OR') {
        return this.testOr(target, triggers[triggerKey])
      } else if (triggerKey === 'AND') {
        return this.testAnd(target, triggers[triggerKey])
      }
      if (this.basicKeys.includes(triggerKey)) {
        return this.basicMatcher.match(target, triggers)
      }
      if (this.targetKeys.includes(triggerKey)) {
        return this.targetMatcher.match(target, triggers as TriggersTargets)
      }
      if (this.existenceKeys.includes(triggerKey)) {
        return this.existenceMatcher.match(target, triggers)
      }
    }
    return false
  }

  private testOr(target, triggers): boolean {
    if (Array.isArray(triggers)) {
      return triggers.reduce(
        (acc: boolean, currentTriggers: RowTypeTriggers) =>
          acc || this.test(target, currentTriggers),
        false
      )
    } else {
      return false
    }
  }

  private testAnd(target, triggers): boolean {
    if (Array.isArray(triggers)) {
      return triggers.reduce(
        (acc: boolean, currentTriggers: RowTypeTriggers) =>
          acc && this.test(target, currentTriggers),
        true
      )
    }
    return false
  }

  private isEmptyTriggers(triggers): boolean {
    return (
      !triggers ||
      (typeof triggers === 'object' && !Object.keys(triggers).length)
    )
  }

  private prepareComplexFormat(
    triggers: Arrable<RowTypeTriggers | BasicTriggers>
  ): RowTypeTriggers | BasicTriggers {
    const keys = Object.keys(triggers)
    if (
      Array.isArray(triggers) &&
      ('has' in keys ||
        'not' in keys ||
        keys.some((k) => this.targetKeys.includes(k)))
    ) {
      return { OR: [...triggers] }
    } else if (typeof triggers === 'object') {
      return {
        AND: [
          ...Object.entries(triggers).map(([key, inner]) => {
            return {
              [key]: inner,
            }
          }),
        ],
      }
    }
    return triggers
  }
}
