/**
 * Simple object check.
 * @param item
 * @returns {boolean}
 */
export function isObject(item: any): boolean {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

/**
 * Deep merge two objects.
 * @param target
 * @param sources
 */
export function mergeDeep(target: any, ...sources: any[]): any {
  if (!sources.length) {
    return target;
  }
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (source.hasOwnProperty(key) && isObject(source[key])) {
        if (!target[key]) {Object.assign(target, {[key]: {}})}
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, {[key]: source[key]});
      }
    }
  }

  return mergeDeep(target, ...sources);
}

export const memoize = (fn) => {
  const cache = {};
  return (x) => {
    if (x in cache) {
      return cache[x];
    }
    return cache[x] = fn(x);
  };
};
