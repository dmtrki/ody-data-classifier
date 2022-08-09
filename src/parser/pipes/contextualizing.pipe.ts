import { IParserPipe } from './types/parsing-pipe.interface'
import { pipe, map, OperatorFunction } from 'rxjs'
import { TitleTagsQualifier } from './qualifiers/title-tags.qualifier'
import { TitleDateQualifier } from './qualifiers/title-date.qualifier'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'
import deterministicHash from 'deterministic-object-hash'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { Injectable } from '@nestjs/common'

@Injectable()
export class ContextualizingPipe
  implements IParserPipe<PipelineBlockDto, PipelineBlockDto>
{
  private readonly dateQualifier = new TitleDateQualifier()

  constructor(private readonly tagsQualifier: TitleTagsQualifier) {}

  public pipe(): OperatorFunction<PipelineBlockDto, PipelineBlockDto> {
    return pipe(
      map((block: PipelineBlockDto): PipelineBlockDto => {
        return {
          ...block,
          tags: this.tagsQualifier.qualify(block.title),
          year: this.dateQualifier.qualify(block.title),
          hash: deterministicHash(block),
        }
      })
    )
  }
}
