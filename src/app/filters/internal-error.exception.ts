import {
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common'

export class InternalError extends InternalServerErrorException {
  public constructor(
    public readonly exception: typeof HttpException,
    public readonly message: string,
    public readonly context?: unknown
  ) {
    super({
      message: message ?? null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    })
  }
}
