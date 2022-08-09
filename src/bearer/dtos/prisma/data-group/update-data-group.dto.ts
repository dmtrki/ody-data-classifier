import { Prisma } from '@prisma/client'

export class UpdateDataGroupDto {
  key?: string
  meta?: Prisma.InputJsonValue
}
