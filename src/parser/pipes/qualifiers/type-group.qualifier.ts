import { RowTypeKey } from '../../../report/dtos/report-tree-leaf-dto'
import { Qualifier } from '../types/qualifier.interface'
import { DataGroupKey } from '../../../bearer/types/tree-group-branch'
import { dataGroupRowTypesMap } from '../../maps/data-group-row-types-map'

export class TypeGroupQualifier implements Qualifier<RowTypeKey, DataGroupKey> {
  protected grammar

  constructor() {
    this.grammar = this.mapTypesToGroups()
  }

  public qualify(type: RowTypeKey): DataGroupKey {
    return this.grammar[type] ?? null
  }

  private mapTypesToGroups() {
    return Object.assign(
      {},
      ...Object.entries(dataGroupRowTypesMap)
        .map(([group, types]) =>
          Object.fromEntries(types.map((typeKey) => [typeKey, group]))
        )
        .flat()
    )
  }
}
