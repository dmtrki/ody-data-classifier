import { Prisma } from '@prisma/client'

export class UpdateRowDto {
  value?: string
  hash?: string
  meta?: Prisma.InputJsonValue
}
