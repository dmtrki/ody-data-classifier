import { PipelineBlockDto } from '../../dtos/pipeline-block.dto'
import { IdentitiesReflector } from '../identities-reflector'
import { IdentityRefProps } from '../../types/identification'
import { ParserIdentityRef } from '../../parser-identity-ref'

export class IdentityRelevanceQualifier {
  qualify(
    block: PipelineBlockDto,
    references: IdentitiesReflector
  ): ParserIdentityRef | null {
    const blockProps = references.castToProps(block.data)
    for (const reference of references.getRefs()) {
      if (reference.compareProps(blockProps)) {
        return reference
      }
    }
    return null
  }
}
