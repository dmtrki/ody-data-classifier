import { IParserPipe } from './types/parsing-pipe.interface'
import { SourceBlock } from '../types/pipeline-entities'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { map, OperatorFunction } from 'rxjs'
import { PipelineBlockDto } from '../dtos/pipeline-block.dto'

export class SourceMappingPipe
  implements IParserPipe<SourceBlock, PipelineBlockDto>
{
  public pipe(): OperatorFunction<SourceBlock, PipelineBlockDto> {
    return map(
      (source: SourceBlock): PipelineBlockDto => ({
        enquiryRef: source.enquiryRef,
        data: source.body.map(
          ([label, value]): PipelineRowDto => ({
            value,
            label,
            type: null,
          })
        ),
        title: source.title,
      })
    )
  }
}
