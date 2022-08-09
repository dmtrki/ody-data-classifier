import { Qualifier } from '../types/qualifier.interface'
import { Injectable } from '@nestjs/common'
import { MatcherService } from '../../matcher/matcher.service'
import { tagTriggersMap } from '../../maps/tag-triggers.map'

@Injectable()
export class TitleTagsQualifier implements Qualifier<string, string[] | null> {
  private readonly triggersMap

  constructor(private readonly matcher: MatcherService) {
    this.triggersMap = this.generateTriggersMap()
  }

  protected generateTriggersMap(): Map<string, string[]> {
    return new Map(Object.entries(tagTriggersMap))
  }

  public qualify(title: string): string[] {
    const tags = []
    for (const [tagKey, occurs] of this.triggersMap) {
      if (this.matcher.test(title, occurs)) {
        tags.push(tagKey)
      }
    }
    return tags
  }
}
