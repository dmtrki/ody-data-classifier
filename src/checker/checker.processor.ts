import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { CheckerService } from './checker.service'
import { Logger } from '@nestjs/common'

@Processor('checking')
export class CheckerProcessor {
  constructor(private service: CheckerService, private logger: Logger) {}

  @Process()
  async process({ data }: Job) {
    return await this.service.check(data)
  }
}
