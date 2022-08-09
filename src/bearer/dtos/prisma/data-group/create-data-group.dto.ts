import { Prisma } from '@prisma/client'

export class CreateDataGroupDto {
  key: string
  meta?: Prisma.InputJsonValue
}
