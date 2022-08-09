import { Injectable } from '@nestjs/common'
import { PipelineBlockDto, PipelineUnionDto } from '../dtos/pipeline-block.dto'
import { BaseObserver } from '../../app/base.observer'
import { XOR } from '../../app/utils/types'

@Injectable()
export class MockObserver extends BaseObserver<
  XOR<PipelineBlockDto, PipelineUnionDto>
> {
  public complete(): void {
    this.emitter.emit('parser.mocking', this.collector)
  }
}
