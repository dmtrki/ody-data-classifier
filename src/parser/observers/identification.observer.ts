import { Injectable } from '@nestjs/common'
import {
  IdentifiedBlockDto,
  PipelineBlockDto,
  PipelineUnionDto,
} from '../dtos/pipeline-block.dto'
import { BaseObserver } from '../../app/base.observer'
import { XOR } from '../../app/utils/types'
import { ParserIdentityRef } from '../parser-identity-ref'

@Injectable()
export class IdentificationObserver extends BaseObserver<ParserIdentityRef[]> {
  public complete() {
    this.emitter.emit('parser.identified', this.collector)
  }
}
