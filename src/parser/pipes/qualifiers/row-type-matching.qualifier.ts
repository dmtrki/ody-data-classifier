import { rowTypeTriggersMap } from '../../maps/row-type-triggers.map'
import { extractSubset } from '../../../app/utils/functions/extract-subset'
import { RowTypeTriggersMap } from '../../types/row-type-triggers'
import { RowTypeKey } from '../../../report/dtos/report-tree-leaf-dto'
import { Qualifier } from '../types/qualifier.interface'
import { PipelineRowDto } from '../../dtos/pipeline-row.dto'
import { tagSpecificTypesMap } from '../../maps/tag-specific-types.map'
import { MatcherService } from '../../matcher/matcher.service'
import { MatcherTarget } from '../../matcher/types/matcher-target'
import { Injectable } from '@nestjs/common'
import { commonTypesTriggers } from '../../maps/row-type-triggers/common'
import { personalTypesTriggers } from '../../maps/row-type-triggers/personal'
import { contactsTypesTriggers } from '../../maps/row-type-triggers/contacts'
import { relatedPersonsTypesTriggers } from '../../maps/row-type-triggers/related-persons'

@Injectable()
export class RowTypeMatchingQualifier
  implements Qualifier<PipelineRowDto, RowTypeKey | null>
{
  private readonly triggersMap: RowTypeTriggersMap = { ...rowTypeTriggersMap }
  private readonly tagSpecificTypesMap = { ...tagSpecificTypesMap }
  private readonly commonTriggers: RowTypeTriggersMap = {
    ...commonTypesTriggers,
    ...personalTypesTriggers,
    ...contactsTypesTriggers,
    ...relatedPersonsTypesTriggers,
  }

  constructor(private readonly matcher: MatcherService) {}

  public qualify({
    label,
    value,
    parent: { title, tags, data: siblings },
  }: PipelineRowDto): RowTypeKey {
    const target = { label, value, context: { title, tags, siblings } }
    return this.findMatchingType(target)
  }

  protected findMatchingType(input: MatcherTarget): RowTypeKey {
    const grammar = this.getGrammarFor(input.context?.tags)
    for (const typeKey in grammar) {
      const match = this.matcher.test(input, grammar[typeKey])
      if (match) {
        return typeKey as RowTypeKey
      }
    }

    return null
  }

  private getGrammarFor(tags: string[]): RowTypeTriggersMap {
    if (!tags || !tags.length) return this.triggersMap
    const specificTriggers = Object.values(
      extractSubset(this.tagSpecificTypesMap, [...tags])
    )
      .flat()
      .pop()

    return {
      ...specificTriggers,
      ...this.commonTriggers,
    } as RowTypeTriggersMap
  }
}
