import { ApiProperty } from '@nestjs/swagger'

export class EnquiryAcceptedDto {
  @ApiProperty({
    readOnly: true,
  })
  readonly id: string
}
