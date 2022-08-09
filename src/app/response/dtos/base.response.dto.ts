import { ApiProperty } from '@nestjs/swagger'
import {
  ResponseStatusCode,
  responseStatusesMap,
  ResponseStatusKey,
} from '../response-statuses.map'
import { Request } from 'express'
import { EnquiryRequestDto } from '../../../enquiry/dtos/enquiry-request.dto'

export type OriginRequest = {
  method?: string
  url?: string
  params?: Record<string, unknown>
  headers?: Record<string, unknown>
  body?: Record<string, unknown>
}

export class BaseResponseDto {
  @ApiProperty({
    readOnly: true,
    enum: Object.values(responseStatusesMap),
  })
  readonly statusCode: ResponseStatusCode

  @ApiProperty({
    enum: Object.keys(responseStatusesMap),
    readOnly: true,
  })
  readonly responseStatus: ResponseStatusKey

  @ApiProperty({
    readOnly: true,
  })
  readonly isError: boolean

  @ApiProperty({
    readOnly: true,
    description: 'Внутренний ID заявки',
  })
  readonly requestToken: string

  @ApiProperty({
    readOnly: true,
  })
  readonly originRequest: OriginRequest
}
