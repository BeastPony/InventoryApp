function toSnakeCase(str) {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

function toCamelCase(str) {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function objectToSnakeCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => objectToSnakeCase(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[toSnakeCase(key)] = objectToSnakeCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

export function objectToCamelCase(obj) {
  if (Array.isArray(obj)) {
    return obj.map(item => objectToCamelCase(item));
  }
  if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      acc[toCamelCase(key)] = objectToCamelCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}