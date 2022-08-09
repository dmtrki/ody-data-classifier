import { Prisma } from '@prisma/client'

export class CreateEnquirySourceDto {
  raw?: string
  parsed?: Prisma.InputJsonValue
}
