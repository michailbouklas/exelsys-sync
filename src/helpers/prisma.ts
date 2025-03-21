import { IPrismaOperators, IQueryParamFilter } from '@models/general';
import { Prisma } from '@prisma/client';

export interface IIncomingFilter {
  operator?: string;
  value: string;
}
export function queryParametersFilterToPrismaWhere(
  filters: Record<string, any>[]|string,
  modelName: string
) {

  if (typeof filters === 'string') {
    try {
      filters = JSON.parse(decodeURIComponent(filters));
    } catch (e) {
      return {};
    }
  }

  if (!Array.isArray(filters)) {
    return {};
  }

  const fields = getPrismaModelFields(modelName);
  const where = {};
  // run a first pass to find out if there are any composite filters. These are filter that their keys are separated by -
  const compositeFilters = filters.filter((filter) => {
    if (filter.field) {
      return filter.field.includes('-');
    }

    return Object.keys(filter)[0].includes('-');
  });
  // split the composite filters into their individual filters
  compositeFilters.forEach((filter) => {
    const key =  filter.field || Object.keys(filter)[0];
    const keys = key.split('-');
    const value = filter.value || filter[key as any];
    const operator = filter.operator || IPrismaOperators.equals;
    const newFilters: any = [];
    keys.forEach((k) => {
      const tmpFilter = {};
      tmpFilter[k] = { value, operator, groupAs: 'OR', groupKey: key };
      // @ts-ignore
      filters.push(tmpFilter);
    });
  });
  // remove them from the filters array
  filters = filters.filter((filter) => !Object.keys(filter)[0].includes('-'));

  filters.forEach((filter) => {
    if (filter.field) {
      const tmpFilter = {};
      tmpFilter[filter.field as any] = filter;
      delete tmpFilter['field'];
      filter = tmpFilter;

    }

    const key = Object.keys(filter)[0];


    if (filter[key] && !filter[key].value) {

      filter[key] = {
        value: filter[key] as any,
        operator: filter.operator ? IPrismaOperators[filter.operator as any] : IPrismaOperators.equals
      };
    }

    const tmp = {
      field: key,
      value: sanitizeFieldValues(key, filter[key].value, fields),
      operator: filter[key].operator ? IPrismaOperators[filter[key].operator] : IPrismaOperators.equals,
    };

    where[key] = queryParameterFilterToPrismaWhere(tmp);
  });

  // if there is a key groupAs, group the filters into an OR group. It should created arrays of groups based on the groupAs key
  const groupAs = filters.filter((filter) => filter[Object.keys(filter)[0]]['groupKey']);
  // now create an or statement for each group. it should create an object like
  /**
   *  OR: [
      { email: { contains: 'test' } },
      { first_name: { contains: 'test' } },
      { last_name: { contains: 'test' } }
    ]
   */
  const orGroups = {};

  groupAs.forEach((group) => {
    const key = Object.keys(group)[0];
    const groupKey = group[key]['groupKey'];
    const groupFilters = filters.filter((filter) => filter[Object.keys(filter)[0]]['groupKey'] === groupKey);
    const orGroup = groupFilters.map((filter) => {
      const key = Object.keys(filter)[0];
      return { [key]: where[key] };
    });

    if (!orGroups[groupKey]) {
      orGroups[groupKey] = [];
    }

    orGroups[groupKey].push(...orGroup);
  });

  Object.keys(orGroups).forEach((groupKey) => {
    where['OR'] = orGroups[groupKey];
  });

   // remove the individual filters from the where object
  filters.forEach((filter) => {
    const key = filter.field || Object.keys(filter)[0];
    if (key.includes('-')) {
      const parts = key.split('-');
      parts.forEach((part) => {
        delete where[part];
      });
      delete where[key as any];
      return;
    }

  });


  return where;
}

export function sanitizeFieldValues(key: string, value: any, fields: Record<string, string>) {
  if (!fields[key]) {
    return value;
  }

  switch (fields[key]) {
    case 'Int':
      return parseInt(value);
    case 'Float':
      return parseFloat(value);
    case 'Boolean':
      return typeof value === 'boolean' ? value : value === 'true';
    default:
      return value;
  }
}

export function queryParameterFilterToPrismaWhere(filter: IQueryParamFilter) {
  const { field, operator, value } = filter;

  switch (operator) {
    case IPrismaOperators.equals:
      return { equals: value };
    case IPrismaOperators.not:
      return { not: { equals: value } };
    case IPrismaOperators.gt:
      return { gt: value };
    case IPrismaOperators.lt:
      return { lt: value };
    case IPrismaOperators.gte:
      return { gte: value };
    case IPrismaOperators.lte:
      return { lte: value };
    case IPrismaOperators.contains:
      return { contains: value, mode: 'insensitive' };
    case IPrismaOperators.ncontains:
      return { in: value.split(',') };
    case IPrismaOperators.in:
      return { not: { in: value.split(',') } };
    case IPrismaOperators.isnull:
      return { equals: null };
    case IPrismaOperators.notnull:
      return { not: { equals: null } };
    default:
      return { equals: value };
  }
}


export function getPrismaModelFields(modelName: string) {
  const model = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === modelName
  );

  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }

  return model.fields.reduce((acc, field) => {
    acc[field.name] = field.type;
    return acc;
  }, {});
}

export function getModelRelations(modelName: string) {
  const dmmf = Prisma.dmmf.datamodel;
  const model = dmmf.models.find(m => m.name === modelName);

  if (!model) {
    return [];
  }

  return model.fields
    .filter(field => field.kind === 'object')
    .map(field => {
      const relatedModel = dmmf.models.find(m => m.name === field.type);

      // A model is a join table if it has exactly two relation fields with foreign keys

      // @ts-ignore
      const isJoinTable = relatedModel?.fields.filter(f => f.kind === 'object' && f.relationFromFields?.length > 0
      ).length === 2;

      let relationType = 'oneToMany';
      if (field.type.includes(modelName) && isJoinTable) {
        relationType = 'manyToMany';
      } else if (!field.isList) {
        relationType = 'oneToOne';
      }

      return {
        name: field.name,
        type: field.type,
        isList: field.isList,
        relationType,
        hasJoinTable: field.type.includes(modelName) && isJoinTable,
        relationName: field.relationName,
        through: field.type.includes(modelName) && isJoinTable ? field.type : null
      };
    });
}


export function setupRelationshipsObject(modelName: string, include: string[]) {
  const availableRelations = getModelRelations(modelName);
  const includeObject = {};

  include.forEach(relation => {
    const relationInfo = availableRelations.find(r => r.name === relation);
    if (relationInfo) {
      // For many-to-many with join tables, include the nested relation
      if (relationInfo.hasJoinTable) {
        includeObject[relation] = {
          include: {
            // Convert the join table type to get the actual relation name
            // e.g., UserRole -> role, BrandDiscount -> discount
            [relationInfo.type.replace(modelName, '').toLowerCase()]: true
          }
        };
      } else {
        // For direct relationships, just set to true
        includeObject[relation] = true;
      }
    }
  });

  return includeObject;
}

export function setupFiltersObject(modelName: string, filters: any) {
  const relationships = getModelRelations(modelName);

  // go through every filter to see if it is a relationship
  for (const filter in filters) {
    const parts = filter.split('.');
    const found = relationships.find(r => r.name === parts[0]);

    if (!found) {
      continue;
    }

    if (found && !found.isList) {
      filters[filter] = {
        is: filters[filter].value || null
      }
      continue;
    }

    if (found?.through && found.isList) {
      filters[parts[0]] = {
        some: {
          [parts[1]]: filters[filter]
        }
      }
    }
    delete filters[filter];
  }

  return filters;
}