import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { Response } from 'express'
import { ResponseFactory } from '../response/response.factory'

@Catch(HttpException)
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger(GlobalHttpExceptionFilter.name)
  private readonly responseFactory: ResponseFactory = new ResponseFactory()

  catch(exception: any, host: ArgumentsHost): void {
    const ctx: HttpArgumentsHost = host.switchToHttp()
    const response = this.responseFactory.error(exception, ctx)
    this.logger.error(response)
    ctx.getResponse().status(exception.getStatus()).send(response)
  }
}
