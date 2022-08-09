import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { OdysseyCreateResponseDto } from '../../app/client/dtos/odyssey-post-response.dto'
import { IncomingEnquiryRequest } from './enquiry-request.dto'
import { OdysseyCheckResponseDto } from '../../app/client/dtos/odyssey-check-response.dto'

export class OdysseyDataDto {
  @ApiProperty()
  requestId: number | string

  @ApiPropertyOptional()
  resultUrl?: string

  @ApiPropertyOptional({
    readOnly: true,
  })
  post?: OdysseyCreateResponseDto

  @ApiPropertyOptional()
  result?: OdysseyCheckResponseDto
}

export class EnquiryMetaDto {
  @ApiPropertyOptional()
  method?: string

  @ApiPropertyOptional()
  fields?: IncomingEnquiryRequest

  @ApiPropertyOptional({
    properties: {},
  })
  odyssey?: OdysseyDataDto
}
