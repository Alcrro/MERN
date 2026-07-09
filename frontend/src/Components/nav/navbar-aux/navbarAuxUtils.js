export const catHref = (cat) => {
  if (!cat.kind) return "/products";
  return `/products?kind=${cat.kind}`;
};

export const subLink = (item, parentKind) => {
  const kind = item.kind ?? parentKind;
  if (!kind) return "/products";
  if (item.tip) return `/products?kind=${kind}&tip=${encodeURIComponent(item.tip)}`;
  return `/products?kind=${kind}`;
};
