import { Prisma } from '@prisma/client'

export class UpdateEnquirySourceDto {
  raw?: string
  parsed?: Prisma.InputJsonValue
}
