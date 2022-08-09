import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common'
import { ResponseFactory } from '../response/response.factory'
import { InternalError } from './internal-error.exception'

@Catch(InternalServerErrorException)
export class GlobalInternalExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger = new Logger()
  private readonly responseFactory: ResponseFactory = new ResponseFactory()

  catch(exception: InternalError, host: ArgumentsHost) {
    const ctx = host.switchToHttp(),
      response = this.responseFactory.error(exception, ctx)
    this.logger.error(exception, exception?.stack, exception?.context)
    ctx.getResponse().status(response.statusCode).json(response)
  }
}
