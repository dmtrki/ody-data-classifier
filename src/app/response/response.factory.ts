import {
  ErrorResponseStatusCode,
  ErrorResponseStatusKey,
  errorStatusesMap,
  ResponseStatusCode,
  ResponseStatusKey,
  successStatusesMap,
} from './response-statuses.map'
import { HttpArgumentsHost } from '@nestjs/common/interfaces/features/arguments-host.interface'
import { Request } from 'express'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { ErrorResponseDto } from './dtos/error.response.dto'
import { SuccessResponseDto } from './dtos/success.response.dto'
import { ReportDataDto } from '../../report/dtos/report-data-groups.dto'
import { EnquiryAcceptedDto } from '../../enquiry/dtos/enquiry-accepted.dto'

@Injectable()
export class ResponseFactory {
  private readonly errorStatuses = { ...errorStatusesMap }
  private readonly successStatuses = { ...successStatusesMap }
  private readonly codeToKey: Record<ResponseStatusCode, ResponseStatusKey>
  private readonly errorMessages = {
    400: 'Request invalidated',
    404: 'No items found for this id',
    408: 'Timeout',
    500: 'Internal server error',
  }

  constructor() {
    this.codeToKey = this.swapCodeToKey()
  }

  report(enquiryContext, data): SuccessResponseDto<ReportDataDto> {
    const statusCode = 200,
      {
        responseStatus,
        actualDate,
        originRequest,
        requestToken,
        isDataFromCache,
      } = enquiryContext
    return {
      statusCode,
      responseStatus,
      isError: false,
      actualDate,
      originRequest,
      requestToken,
      isDataFromCache,
      data,
      isCached: true,
      currentProcessingDuration: '',
    }
  }

  enquiry(enquiry): SuccessResponseDto<EnquiryAcceptedDto> {
    const statusCode = 200,
      {
        responseStatus,
        actualDate,
        originRequest,
        requestToken,
        isDataFromCache,
      } = enquiry.getLastRequest()
    return {
      statusCode,
      responseStatus,
      isError: false,
      actualDate,
      originRequest,
      requestToken,
      isDataFromCache,
      data: { id: requestToken },
      isCached: true,
      currentProcessingDuration: '',
    }
  }

  error(
    exception: HttpException,
    ctx: HttpArgumentsHost
  ): ErrorResponseDto<ErrorResponseStatusCode> {
    const { method, url, params, body, headers }: Request = ctx.getRequest()
    const statusCode = exception.getStatus(),
      responseStatus = this.getStatusKey(statusCode) as ErrorResponseStatusKey

    return {
      responseStatus,
      statusCode,
      isError: true,
      errorMessage: this.getErrorMessage(exception),
      ...(params?.enquiryId && { requestToken: params.enquiryId }),
      originRequest: {
        method,
        url,
        params,
        headers,
        body,
      },
    }
  }

  private getStatusKey(statusCode: number): ResponseStatusKey {
    return this.codeToKey[statusCode] ?? 'ERROR'
  }

  private getErrorMessage(exception: HttpException) {
    const messages = []
    const statusMessage = this.errorMessages[exception.getStatus()] ?? null
    if (statusMessage) messages.push(statusMessage)
    const exceptionMessage = exception.message ?? null
    if (exceptionMessage) messages.push(JSON.stringify(exceptionMessage))
    const stack = exception.stack ?? null
    if (stack) messages.push(JSON.stringify(stack))
    return messages.join(' | ')
  }

  private swapCodeToKey() {
    return Object.fromEntries(
      Object.entries({
        ...this.successStatuses,
        ...this.errorStatuses,
      }).map((it) => it.reverse())
    )
  }
}
