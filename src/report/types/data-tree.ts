import {
  TreeGroupBranch,
  DataGroupKey,
} from '../../bearer/types/tree-group-branch'

export type DataTree = {
  [groupKey in DataGroupKey]: TreeGroupBranch
}
