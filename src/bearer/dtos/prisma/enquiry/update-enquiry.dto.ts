import { Prisma } from '@prisma/client'

export class UpdateEnquiryDto {
  meta?: Prisma.InputJsonValue
  hash?: string
}
