interface QueryTemplateType {
  [x: string]: 'string' | 'number';
}

export function QueryParser<T extends QueryTemplateType = QueryTemplateType>(
  template: T,
  query: { [x: string]: any },
) {
  const result = {} as T;
  for (const key in template) {
    if (typeof query[key] === template[key]) {
      result[key] = query[key];
    } else if (typeof query[key] !== 'undefined') {
      result[key] = convertToValue(template[key], query[key]);
    }
  }
  return result;
}

function convertToValue(type: 'string' | 'number', value: any) {
  if (type === 'string') {
    return value.toString();
  }
  if (type === 'number') {
    if (isNaN(Number(value))) {
      throw new Error(`${value} is not a number`);
    }
    return Number(value);
  }
}
