import { KIND_TO_CATEGORY_SLUG, TIP_TO_TIP_SLUG } from "../../../utils/categorySlugMap";

export const catHref = (cat) => {
  const slug = KIND_TO_CATEGORY_SLUG[cat.kind];
  if (!slug) return "/products";
  return `/products/${slug}`;
};

export const subLink = (item, parentKind) => {
  const kind = item.kind ?? parentKind;
  const categorySlug = KIND_TO_CATEGORY_SLUG[kind];
  if (!categorySlug) return "/products";
  if (item.tip) {
    const tipSlug = TIP_TO_TIP_SLUG[item.tip];
    if (tipSlug) return `/products/${categorySlug}/${tipSlug}`;
  }
  return `/products/${categorySlug}`;
};
