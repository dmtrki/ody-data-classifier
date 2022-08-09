import { MonoTypeOperatorFunction, pipe } from 'rxjs'
import { tap } from 'rxjs/operators'
import {
  bgBlack,
  bgBlueBright,
  bgCyanBright,
  bgGreenBright,
  bgYellow,
  bgYellowBright,
  black,
  blue,
  blueBright,
  cyan,
  gray,
  magenta,
  whiteBright,
} from 'colorette'
import { isFunction } from '@nestjs/common/utils/shared.utils'
import { tapOnce } from './tap-once.operator'
import { Logger } from '@nestjs/common'

const logger = new Logger()

export function logRx<T>(
  tag: string,
  once?: boolean,
  ...params
): MonoTypeOperatorFunction<T> {
  let disabled, predicate
  if (params) {
    for (const param of params) {
      if (typeof param === 'boolean') disabled = true
      if (isFunction(param)) predicate = param
    }
  }
  if (once) {
    return pipe(
      tapOnce((value) => {
        if (
          !disabled &&
          (!predicate || (isFunction(predicate) && predicate(value)))
        ) {
          logObs(tag, value)
        }
      })
    )
  } else {
    return pipe(
      tap((value) => {
        if (
          !disabled &&
          (!predicate || (isFunction(predicate) && predicate(value)))
        ) {
          logObs(tag, value)
        }
      })
    )
  }
}

function logObs(tag?, value?: unknown) {
  if (!tag) tag = value.constructor.name
  const colors = getTagColor(tag)
  console.debug('---')
  logger.debug(value, colors.bg ? colors.bg(colors.fg(tag)) : colors.fg(tag))
}

function getTagColor(tag) {
  const colors = {
    in: {
      fg: black,
      bg: bgBlueBright,
    },
    mid: {
      fg: black,
      bg: bgCyanBright,
    },
    out: {
      fg: black,
      bg: bgGreenBright,
    },
    sourceMapping: {
      fg: gray,
      bg: bgYellowBright,
    },
    contextualizing: {
      fg: gray,
      bg: bgYellowBright,
    },
    formatting: {
      fg: blue,
      bg: bgYellowBright,
    },
    taxonomizing: {
      fg: blueBright,
      bg: bgYellow,
    },
    composing: {
      fg: cyan,
    },
    computing: {
      fg: magenta,
    },
    referencing: {
      fg: magenta,
    },
    identifying: {
      fg: magenta,
    },
  }

  if (!colors[tag]) {
    return {
      bg: bgBlack,
      fg: whiteBright,
    }
  }

  return colors[tag]
}
