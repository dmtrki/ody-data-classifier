export declare type ObjectMapSource = {
  [key: string]: any
}

export declare type ObjectMapTemplate = {
  [key: string]: string | ObjectMapSource
}

function findValue(keysTree: string[], data: ObjectMapSource) {
  if (!data) {
    return undefined
  }
  const key = keysTree.shift()
  if (keysTree.length) {
    return findValue(keysTree, data[key])
  }
  return data[key]
}

function mapDataIntoTemplate(
  source: ObjectMapSource,
  skeleton: ObjectMapTemplate,
  addUndefinedFields: boolean
) {
  const keys = Object.keys(skeleton)
  const r = {}
  keys.map((key) => {
    if (skeleton[key] instanceof Object) {
      r[key] = mapDataIntoTemplate(
        source,
        skeleton[key] as ObjectMapSource,
        addUndefinedFields
      )
    } else {
      const value = findValue((skeleton[key] as string).split('.'), source)
      if (value || addUndefinedFields) {
        r[key] = value
      }
    }
  })
  return r
}

export function mapObjectTo(
  source: ObjectMapSource | ObjectMapSource[],
  skeleton: ObjectMapTemplate,
  addUndefinedFields = false
): ObjectMapSource | ObjectMapSource[] {
  if (source instanceof Array) {
    return source.map((sourceElement) =>
      mapDataIntoTemplate(sourceElement, skeleton, addUndefinedFields)
    )
  }
  return mapDataIntoTemplate(source, skeleton, addUndefinedFields)
}
