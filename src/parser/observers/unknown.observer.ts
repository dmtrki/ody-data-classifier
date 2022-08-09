import { Injectable } from '@nestjs/common'
import { BaseObserver } from '../../app/base.observer'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'

@Injectable()
export class UnknownObserver extends BaseObserver<
  PipelineBlockDto | PipelineRowDto
> {
  complete(): void {
    this.emitter.emit('unknown.coming', this.collector)
  }
}
