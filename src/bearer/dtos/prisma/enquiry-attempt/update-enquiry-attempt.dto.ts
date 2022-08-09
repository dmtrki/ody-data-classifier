import { Prisma, EnquiryAttemptProducedType } from '@prisma/client'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateEnquiryAttemptDto {
  @ApiProperty({ enum: EnquiryAttemptProducedType })
  produced?: EnquiryAttemptProducedType
  meta?: Prisma.InputJsonValue
}
