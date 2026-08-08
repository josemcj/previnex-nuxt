/**
 * Synchronizes the properties of a given object with the values from a source object.
 *
 * Only properties that already exist in the target object are updated;
 * properties present in the source but not in the target are ignored.
 *
 * @param {Object} object - The target object to be updated.
 * @param {Object} source - The source object containing the new values.
 * @returns {Object} The updated target object, or an empty object if either `object` or `source` is not provided.
 */
export default function <T extends Record<string, unknown>>(object: T, source: Partial<T>): T | Record<string, never> {
  if (object && source) {
    for (const key in source) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        const typedKey = key as keyof T;
        const value = source[typedKey];

        if (value !== undefined) {
          object[typedKey] = value;
        }
      }
    }

    return object;
  }

  return {};
}
