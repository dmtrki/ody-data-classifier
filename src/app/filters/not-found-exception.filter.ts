import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Scope,
  Injectable,
  HttpException,
} from '@nestjs/common'
import { ResponseFactory } from '../response/response.factory'

@Catch(HttpException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  private responseFactory: ResponseFactory

  constructor() {
    this.responseFactory = new ResponseFactory()
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      response = this.responseFactory.error(exception, ctx)
    ctx.getResponse().status(response.statusCode).json(response)
  }
}
