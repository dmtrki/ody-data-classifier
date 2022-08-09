import { BaseResponseDto } from './base.response.dto'
import { ApiProperty } from '@nestjs/swagger'
import {
  ErrorResponseStatusCode,
  ErrorResponseStatusKey,
  errorStatusesMap,
  successStatusesMap,
} from '../response-statuses.map'

export class ErrorResponseDto<
  T extends ErrorResponseStatusCode
> extends BaseResponseDto {
  @ApiProperty({
    readOnly: true,
    enum: Object.values(errorStatusesMap),
  })
  readonly statusCode: T

  @ApiProperty({
    readOnly: true,
    enum: Object.keys(errorStatusesMap),
  })
  readonly responseStatus: ErrorResponseStatusKey
  readonly isError = true

  @ApiProperty({
    readOnly: true,
  })
  readonly errorMessage: string
}
