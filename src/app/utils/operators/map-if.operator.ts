import { MapFn, PredicateFn } from '../types/rxjs'
import { map, OperatorFunction } from 'rxjs'

export function mapIf<I, T = I | unknown, F = I | unknown>(
  predicate: PredicateFn<I>,
  trueResult: MapFn<I, T>,
  falseResult: MapFn<I, F>
): OperatorFunction<I, T | F> {
  return (source) =>
    source.pipe(
      map((value: I) =>
        predicate(value) ? trueResult(value) : falseResult(value)
      )
    )
}
