import { Prisma } from '@prisma/client'

export class CreateEnquiryDto {
  meta?: Prisma.InputJsonValue
  hash?: string
}
