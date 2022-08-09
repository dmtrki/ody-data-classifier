export function extractSubset<O>(object: O, properties: string[]): Partial<O> {
  return properties.reduce(function (prev, prop) {
    if (Array.isArray(prop)) {
      prev[prop[0]] = extractSubset(object[prop[0]], prop[1])
    } else if (
      object !== undefined &&
      object !== null &&
      Object.prototype.hasOwnProperty.call(object, prop)
    ) {
      prev[prop] = object[prop]
    }
    return prev
  }, {})
}
