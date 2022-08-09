import { IParserPipe } from './types/parsing-pipe.interface'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { pipe, distinct, OperatorFunction, filter } from 'rxjs'

export class ClearingPipe
  implements IParserPipe<PipelineRowDto, PipelineRowDto>
{
  public pipe(): OperatorFunction<PipelineRowDto, PipelineRowDto> {
    return pipe(
      filter((row) => !!row.value),
      distinct((row) => row.value)
    )
  }
}
