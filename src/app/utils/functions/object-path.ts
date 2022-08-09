const separator = '.'

export function oHas(obj, path) {
  const segments = split(path)
  for (const segment of segments) {
    if (segment in Object(obj)) {
      obj = obj[segment]
    } else {
      return false
    }
  }

  return obj !== undefined
}

export function oGet(obj, path, fallback = undefined) {
  const segments = split(path)
  for (const segment of segments) {
    if (segment in Object(obj)) {
      obj = obj[segment]
    } else {
      obj = undefined
      break
    }
  }

  if (obj !== undefined) {
    return obj
  }

  if (fallback !== undefined) {
    return fallback
  }

  throw Error(`'${path}' object property not found`)
}

export function oSet(obj, path, value) {
  const root = obj
  const segments = split(path)
  for (let i = 0; i < segments.length; ++i) {
    const currSegment = segments[i]
    const nextSegment = segments[i + 1]
    if (!(currSegment in obj)) {
      obj[currSegment] = isInt(nextSegment) ? [] : {}
    }

    if (i === segments.length - 1) {
      obj[currSegment] = value
    }

    obj = obj[currSegment]
  }

  return root
}

function split(path) {
  if (isInt(path)) {
    return [path]
  }

  if (isStr(path)) {
    return path.length === 0 ? [] : path.split(separator)
  }

  throw TypeError('path is not a string or number')
}

function isInt(val) {
  if (typeof val === 'number') {
    return Number.isInteger(val)
  }

  if (typeof val === 'string') {
    return parseInt(val, 10).toString() === val
  }

  return false
}

function isStr(val) {
  return typeof val === 'string'
}

export default {
  oHas,
  oGet,
  oSet,
}
