import { ReportDataDto } from '../../../report/dtos/report-data-groups.dto'
import { EnquiryAcceptedDto } from '../../../enquiry/dtos/enquiry-accepted.dto'
import { BaseResponseDto } from './base.response.dto'
import { ApiProperty, getSchemaPath } from '@nestjs/swagger'
import {
  SuccessResponseStatusCode,
  SuccessResponseStatusKey,
  successStatusesMap,
} from '../response-statuses.map'

export class SuccessResponseDto<
  D extends ReportDataDto | EnquiryAcceptedDto
> extends BaseResponseDto {
  @ApiProperty({
    readOnly: true,
    enum: Object.values(successStatusesMap),
  })
  statusCode: SuccessResponseStatusCode

  @ApiProperty({
    readOnly: true,
    enum: Object.keys(successStatusesMap),
  })
  responseStatus: SuccessResponseStatusKey
  isError = false

  @ApiProperty({
    type: 'string',
    format: 'datetime',
    readOnly: true,
    description: 'Дата последнего обновления данных',
  })
  readonly actualDate: Date

  @ApiProperty({
    type: 'string',
    readOnly: true,
    description: 'Время на обработку',
  })
  readonly currentProcessingDuration: string

  @ApiProperty({
    readOnly: true,
    oneOf: [
      {
        $ref: getSchemaPath(EnquiryAcceptedDto),
      },
      {
        $ref: getSchemaPath(ReportDataDto),
      },
    ],
  })
  readonly data: D

  @ApiProperty({
    readOnly: true,
  })
  readonly isCached?: boolean

  @ApiProperty({
    readOnly: true,
  })
  readonly isDataFromCache?: boolean
}
