import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { BearerService } from '../../bearer/bearer.service'
import { ComposedBlock } from '../types/pipeline-container'

@Injectable()
export class ParserCompleteListener {
  constructor(private bearer: BearerService, private logger: Logger) {}

  @OnEvent('parser.complete', { async: true })
  async onParserComplete(payload: Set<ComposedBlock>) {
    this.logger.debug(
      'Parsing complete, amount of blocks to transact - ' + payload.size
    )
    this.bearer.handleParserComposedBlocks(await payload)
  }
}
