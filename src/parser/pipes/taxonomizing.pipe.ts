import { RowTypeMatchingQualifier } from './qualifiers/row-type-matching.qualifier'
import { TypeUnionQualifier } from './qualifiers/type-union.qualifier'
import { map, pipe, OperatorFunction } from 'rxjs'
import { IParserPipe } from './types/parsing-pipe.interface'
import { ProcessedRow, UnknownRow } from '../types/pipeline-entities'
import { Injectable } from '@nestjs/common'

@Injectable()
export class TaxonomizingPipe implements IParserPipe<UnknownRow, ProcessedRow> {
  constructor(
    private readonly rowTypeQualifier: RowTypeMatchingQualifier,
    private readonly typeUnionQualifier: TypeUnionQualifier
  ) {}

  public pipe(): OperatorFunction<UnknownRow, ProcessedRow> {
    return pipe(
      map((row: UnknownRow) => ({
        ...row,
        type: this.rowTypeQualifier.qualify(row),
      })),
      map((row: ProcessedRow) => ({
        ...row,
        union: row.type ? this.typeUnionQualifier.qualify(row.type) : null,
      }))
    )
  }
}
