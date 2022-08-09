import { pipe, OperatorFunction, reduce, concatMap } from 'rxjs'
import { IParserPipe } from './types/parsing-pipe.interface'
import { IdentityModel } from '../../bearer/models/identity/identity.model'
import { Injectable } from '@nestjs/common'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { composeBlock } from './operators/compose-block.operator'
import { IdentitiesReflector } from './identities-reflector'
import { PrismaService } from '../../app/prisma/prisma.service'

@Injectable()
export class ReferencingPipe
  implements IParserPipe<PipelineRowDto, IdentitiesReflector>
{
  constructor(
    private identities: IdentityModel,
    private prisma: PrismaService
  ) {
    this.identities.setDatabaseClient(prisma)
  }

  pipe(): OperatorFunction<PipelineRowDto, IdentitiesReflector> {
    return pipe(
      composeBlock(),
      reduce((reflector: IdentitiesReflector, block: PipelineBlockDto) => {
        return reflector.handleBlock(block)
      }, new IdentitiesReflector()),
      concatMap((reflector) => reflector.prepare(this.identities))
    )
  }
}
