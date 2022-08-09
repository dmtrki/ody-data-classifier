import { XOR } from '../../app/utils/types'
import { ReportTreeLeafDto } from '../../report/dtos/report-tree-leaf-dto'
import { DataGroupKeysEnum } from '../../parser/maps/data-groups.enum'

export type RowUnion = XOR<TreeGroupBranch, Array<TreeGroupBranch>> | never

export type RowUnions = {
  [unionKey: string]: Array<TreeGroupBranch>
}

export type DataGroupKey = keyof typeof DataGroupKeysEnum

export type TreeGroupBranch = {
  [typeOrUnionKey: string]: XOR<ReportTreeLeafDto[], RowUnions> | never
}
