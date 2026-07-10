export const getUniqueValues = (products, field) =>
  [...new Set((products ?? []).map(p => p[field]).filter(Boolean))];

export const countByField = (products, field, value) =>
  (products ?? []).filter(p => p[field] === value).length;
