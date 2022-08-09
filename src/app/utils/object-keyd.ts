type ObjectKeydOptions = {
  separator?: string
  depth?: number
  tester?: () => boolean
  allowArrays?: boolean
}

export class ObjectKeydUtils {
  private targetObject
  private options: ObjectKeydOptions

  constructor(options?: ObjectKeydOptions) {
    if (!options) {
      this.options = { separator: '.' }
    }
  }

  public target(targetObject): this {
    this.targetObject = { ...targetObject }
    return this
  }

  private _components(keyPath: string): string[] {
    if (typeof keyPath !== 'string')
      throw new Error('`keyPath` must be a string.')
    return (keyPath || '')
      .split(this.options.separator || '.')
      .filter((part) => part)
  }

  private _unfold(keyPath: string | string[]): string[] {
    if (!Array.isArray(keyPath)) return this._components(keyPath)
    return keyPath.slice()
  }

  get(keyPath) {
    return this._unfold(keyPath).reduce((obj, key) => {
      return (obj || {})[key]
    }, this.targetObject)
  }

  set(keyPath, value) {
    let target = this.targetObject
    const segments = this.splitPath(keyPath)
    for (let i = 0; i < segments.length; ++i) {
      const currSegment = segments[i]
      const nextSegment = segments[i + 1]
      if (!(currSegment in target)) {
        target[currSegment] = this.isInt(nextSegment) ? [] : {}
      }

      if (i === segments.length - 1) {
        if (Array.isArray(value) && Array.isArray(target[currSegment])) {
          target[currSegment].push(...value)
        } else {
          target[currSegment] = value
        }
      }

      target = target[currSegment]
    }
    return this.targetObject
  }

  private splitPath(path) {
    if (this.isInt(path)) {
      return [path]
    }

    if (typeof path === 'string') {
      return path.length === 0 ? [] : path.split(this.options.separator)
    }

    throw TypeError('path is not a string or number')
  }

  private isInt(val) {
    if (typeof val === 'number') {
      return Number.isInteger(val)
    }

    if (typeof val === 'string') {
      return parseInt(val, 10).toString() === val
    }

    return false
  }
}
