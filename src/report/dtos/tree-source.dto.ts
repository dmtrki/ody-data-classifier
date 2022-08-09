import { Prisma } from '@prisma/client'
import { DataGroupKey } from '../../bearer/types/tree-group-branch'

export class TreeSourceDto {
  value: string
  hash: string
  createdAt: Date
  meta: Prisma.JsonValue
  enquiryId: string
  identityId: string
  type: {
    key: string
    group: { key: DataGroupKey }
  }
  union: { hash: string; type: { key: string } }
}
