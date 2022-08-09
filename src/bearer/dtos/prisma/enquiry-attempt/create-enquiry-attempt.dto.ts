import { Prisma, EnquiryAttemptProducedType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class CreateEnquiryAttemptDto {
  @ApiProperty({ enum: EnquiryAttemptProducedType })
  produced: EnquiryAttemptProducedType
  meta?: Prisma.InputJsonValue
}
