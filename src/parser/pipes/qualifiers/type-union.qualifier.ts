import { unionTypesMap } from '../../maps/union-types-map'
import { RowTypeKey } from '../../../report/dtos/report-tree-leaf-dto'
import { RowUnionKey, UnionsMap } from '../../../bearer/types/data-row-union'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TypeUnionQualifier {
  protected grammar: UnionsMap

  constructor() {
    this.grammar = { ...unionTypesMap } as UnionsMap
  }
  public qualify(type: RowTypeKey): RowUnionKey | null {
    for (const unionKey in this.grammar) {
      if (this.grammar[unionKey].types.includes(type)) {
        return unionKey as RowUnionKey
      }
    }
    return null
  }
}
