export default function filterObject(object, predicate) {
  const result = {}

  if (Array.isArray(predicate)) {
    const set = new Set(predicate)
    for (const key of Object.keys(object)) {
      if (set.has(key)) {
        const value = object[key]
        Object.defineProperty(result, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
        })
      }
    }
  } else {
    // `for ... of Object.keys()` is faster than `for ... of Object.entries()`.
    for (const key of Object.keys(object)) {
      const value = object[key]
      if (predicate(key, value, object)) {
        Object.defineProperty(result, key, {
          value,
          writable: true,
          enumerable: true,
          configurable: true,
        })
      }
    }
  }

  return result
}
