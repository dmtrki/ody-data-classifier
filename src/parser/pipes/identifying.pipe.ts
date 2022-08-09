import { map, OperatorFunction, pipe } from 'rxjs'
import {
  IdentifiedBlockDto,
  PipelineBlockDto,
} from '../dtos/pipeline-block.dto'
import { IParserPipe } from './types/parsing-pipe.interface'
import { IdentityRelevanceQualifier } from './qualifiers/identity-relevance.qualifier'
import { IdentitiesReflector } from './identities-reflector'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class IdentifyingPipe
  implements
    IParserPipe<[PipelineBlockDto, IdentitiesReflector], IdentifiedBlockDto>
{
  private qualifier = new IdentityRelevanceQualifier()

  constructor(private log: Logger) {}

  pipe(): OperatorFunction<
    [PipelineBlockDto, IdentitiesReflector],
    IdentifiedBlockDto
  > {
    return pipe(
      map(([block, reflector]) => {
        return this.identifyBlock(block, reflector)
      })
    )
  }

  private identifyBlock(
    block: PipelineBlockDto,
    reflector: IdentitiesReflector
  ): IdentifiedBlockDto {
    let reference = reflector.findByReferer(block.hash)
    if (!reference) {
      reference = this.qualifier.qualify(block, reflector)
    }
    return {
      ...block,
      identityId: reference ? reference.id : null,
      identityRef: reference ? reference.getFilledProps() : null,
    }
  }
}
