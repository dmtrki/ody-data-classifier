import { applyDecorators, Type } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
} from '@nestjs/swagger'
import { EnquiryAcceptedDto } from './dtos/enquiry-accepted.dto'
import { SuccessResponseDto } from '../app/response/dtos/success.response.dto'
import { ErrorResponseDto } from '../app/response/dtos/error.response.dto'

export function EnquiryApiMethod(summary: string, fieldGroupDto: Type) {
  return applyDecorators(
    ApiOperation({
      summary: summary,
    }),
    ApiBody({
      type: fieldGroupDto,
      required: true,
    }),
    ApiCreatedResponse({
      type: SuccessResponseDto,
      description: 'Запрос на поиск был успешно создан',
    }),
    ApiForbiddenResponse({
      type: ErrorResponseDto,
      description: 'Доступ запрещен',
    }),
    ApiBadRequestResponse({
      type: ErrorResponseDto,
    })
  )
}
