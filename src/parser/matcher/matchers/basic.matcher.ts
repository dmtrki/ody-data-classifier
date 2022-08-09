import { Matcher } from './matcher.interface'
import { BasicTriggers } from '../../types/triggers'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BasicMatcher implements Matcher {
  public firstMatch(target, triggers): boolean {
    triggers = this.prepareBasicFormat(triggers)
    for (const triggerKey in triggers) {
      if (triggerKey === 'occurs') {
        return this.occurs(target, triggers.occurs)
      }
      if (triggerKey === 'exacts') {
        return this.exacts(target, triggers.exacts)
      }
      if (triggerKey === 'regex') {
        return this.regex(target, triggers.regex)
      }
    }
    return false
  }

  public match(target, triggers): boolean {
    return this.firstMatch(target, triggers)
  }

  public matches(target, triggers): string[] {
    return []
  }

  private prepareBasicFormat(triggers): BasicTriggers {
    if (Array.isArray(triggers)) {
      return {
        occurs: triggers,
      }
    } else if (typeof triggers === 'string') {
      return {
        exacts: [triggers],
      }
    }
    return triggers
  }

  private regex(target: string, triggers: RegExp[] | RegExp) {
    if (Array.isArray(triggers)) {
      for (const regexp of triggers) {
        if (!(regexp instanceof RegExp)) continue
        return regexp.test(target)
      }
    } else if (triggers instanceof RegExp) {
      return triggers.test(target)
    }
    return false
  }

  private exacts(target: string, triggers: string[]) {
    return triggers.some(
      (trig) => trig.toLocaleUpperCase() === target.toLocaleUpperCase()
    )
  }

  private occurs(substrate: string, triggers: string[]): boolean {
    for (const trigger of triggers) {
      if (substrate.toLocaleUpperCase().includes(trigger.toLocaleUpperCase())) {
        return true
      }
    }
    return false
  }

  private getAllOccurs(target: string, substrate: string[]) {
    const matches = []
    substrate.forEach((trig) => {
      if (target.toLocaleLowerCase().includes(trig)) {
        matches.push(trig)
      }
    })
    return matches
  }
}
