import { IParserPipe } from './types/parsing-pipe.interface'
import { map, MonoTypeOperatorFunction } from 'rxjs'
import { rowValueFormattersMap } from '../maps/row-value-formatters.map'
import { PipelineRowDto } from '../dtos/pipeline-row.dto'
import { baseStringFormatter } from './formatters/base-string.formatter'

export class FormattingPipe
  implements IParserPipe<PipelineRowDto, PipelineRowDto>
{
  private readonly formattersMap = { ...rowValueFormattersMap }

  public pipe(): MonoTypeOperatorFunction<PipelineRowDto> {
    return map(({ label, ...row }: PipelineRowDto) => ({
      ...row,
      label: label && baseStringFormatter(label),
      value: this.format(row),
    }))
  }

  private format({
    value,
    type,
  }: Pick<PipelineRowDto, 'value' | 'type'>): string {
    if (type && this.formattersMap[type]) {
      const formatters = this.formattersMap[type]
      if (Array.isArray(formatters) && formatters.length) {
        formatters.forEach((formatter) => {
          value = formatter(value)
        })
      }
    }
    return value
  }
}
