import { ObservableInput } from 'rxjs'

/**
 * A function that takes one or more parameters and returns a boolean value based on the function calculation
 *
 * @typeParam T The type of the value being checked
 *
 * @example
 * Return is a number is boolean `true`
 * ```ts
 * const isTruthy: PredicateFn<number> = (item: number) => Boolean(number);
 * ```
 *
 * @example
 * Return is a number is greater than 10
 * ```ts
 * const isTruthy: PredicateFn<number> = (item: number) => item > 10;
 * ```
 *
 * @example
 * Return if two numbers match
 * ```ts
 * const isTruthy: PredicateFn<number> = (item1: number, item2: number) => item1 === item2;
 * ```
 */
export type PredicateFn<T> = (...args: T[]) => boolean

/**
 * A function used to map values to a modified value, either of the same type (String.toUpperCase) or of a different
 * type (Number.parseInt)
 *
 * @typeParam T The type of value as input to the method
 * @typeParam K The type of value returned from the method
 *
 * @example
 * Map a string to a number
 * ```ts
 * const mapToNumber: MapFn<string, number> = (input: string): number => parseInt(input);
 * ```
 *
 * @example
 * Map any string to an upper case string
 * ```ts
 * const mapToNumber: MapFn<string> = (input: string): string => input.toUpperCase();
 * ```
 */
export type MapFn<T = unknown, K = T | unknown> = (value: T) => K
