import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
  UseFilters,
} from '@nestjs/common'
import {
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ReportService } from './report.service'
import { SuccessResponseDto } from '../app/response/dtos/success.response.dto'
import { ReportDataDto } from './dtos/report-data-groups.dto'
import { ErrorResponseDto } from '../app/response/dtos/error.response.dto'
import { NotFoundExceptionFilter } from '../app/filters/not-found-exception.filter'
import { ResponseFactory } from '../app/response/response.factory'
import { InternalError } from '../app/filters/internal-error.exception'

@Controller('report')
@ApiConsumes('application/json')
@ApiProduces('application/json')
@ApiTags('report')
@UseFilters(new NotFoundExceptionFilter())
export class ReportController {
  constructor(
    private service: ReportService,
    private responseFactory: ResponseFactory
  ) {}

  @Get('log/:limit')
  @ApiParam({
    name: 'limit',
    required: true,
    description: 'Максимальное количество получаемых заявок',
    type: Number,
    example: 8,
  })
  @ApiQuery({
    type: Boolean,
    example: 'false',
    required: false,
    name: 'withData',
    description: 'Добавить ли связанные данные?',
    allowEmptyValue: true,
  })
  @ApiOkResponse({
    description: 'Массив последних созданных Enquiries',
  })
  async getLast(
    @Param('limit', ParseIntPipe) limit: number,
    @Query('withData') include = false
  ) {
    return await this.service.getLast(limit, include)
  }

  @Get(':enquiryId')
  @ApiOkResponse({
    type: SuccessResponseDto,
    description: 'Данные по завке',
  })
  @ApiNotFoundResponse({
    type: ErrorResponseDto,
    description: 'Запрос с данным UUID не найден',
  })
  async getReport(
    @Param('enquiryId', ParseUUIDPipe) id: string
  ): Promise<SuccessResponseDto<ReportDataDto>> {
    return this.service.getOne(id)
  }
}
