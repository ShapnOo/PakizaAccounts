/**
 * Performs a deep merge of two objects.
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: any): T {
  if (!source || typeof source !== 'object') {
    return target;
  }

  const output = { ...target } as Record<string, any>;

  for (const key of Object.keys(source)) {
    const sourceVal = source[key];
    const targetVal = output[key];

    if (
      sourceVal &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      targetVal &&
      typeof targetVal === 'object' &&
      !Array.isArray(targetVal)
    ) {
      output[key] = deepMerge(targetVal, sourceVal);
    } else if (sourceVal !== undefined) {
      output[key] = sourceVal;
    }
  }

  return output as T;
}
