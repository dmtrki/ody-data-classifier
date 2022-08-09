import { OperatorFunction } from 'rxjs'

export interface IParserPipe<IN, OUT = IN> {
  pipe(): OperatorFunction<IN, OUT>
}
