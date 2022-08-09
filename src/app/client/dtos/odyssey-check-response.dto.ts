import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class OdysseyResultDataDto {
  type: string
  query: string
  date_create?: string
  url?: string
  pdf?: string
}

export enum OdysseyCheckStatus {
  ok = 'ok',
  not_found = 'not_found',
  progress = 'progress',
}

export class OdysseyCheckResponseDto {
  @ApiProperty()
  status: OdysseyCheckStatus

  @ApiProperty()
  data: OdysseyResultDataDto

  @ApiPropertyOptional()
  error?: string
}
