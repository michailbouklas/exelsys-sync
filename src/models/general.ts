
export enum IPrismaOperators {
  equals = 'equals',
  contains = 'contains',
  startsWith = 'startsWith',
  endsWith = 'endsWith',
  in = 'in',
  notIn = 'notIn',
  lt = 'lt',
  lte = 'lte',
  gt = 'gt',
  gte = 'gte',
  not = 'not',
  notEquals = 'notEquals',
  containsNot = 'containsNot',
  startsWithNot = 'startsWithNot',
  endsWithNot = 'endsWithNot',
  notContains = 'notContains',
  notStartsWith = 'notStartsWith',
  notEndsWith = 'notEndsWith',
  ncontains = 'ncontains',
  notnull = 'notnull',
  isnull = 'isnull',
}

export interface IQueryParamFilter {
    field: string;
    value: string;
    operator: IPrismaOperators;
}

export interface IUserSession  {

}

export interface IGenericObject<T = any> {
  [key: string]: T;
}