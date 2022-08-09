import { Prisma } from '@prisma/client'

export class CreateRowDto {
  value?: string
  hash: string
  meta?: Prisma.InputJsonValue
}
