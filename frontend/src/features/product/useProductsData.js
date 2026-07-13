import { useGetAllProductsQuery, useGetProductsQuery } from "./rtkProducts";

const applyFilters = (products, { kind, tip, brand, model, availability, stocare, ram, culoare }) =>
  products.filter((p) => {
    if (kind               && p.kind !== kind)                                         return false;
    if (tip                && p.tip  !== tip)                                          return false;
    if (brand.length       && !brand.includes(p.brand))                               return false;
    if (model.length       && !model.includes(p.model))                               return false;
    if (availability.length && !availability.includes(p.stock?.availability))         return false;
    if (stocare.length     && !stocare.includes(p.stocare))                           return false;
    if (ram.length         && !ram.includes(p.RAM))                                   return false;
    if (culoare.length     && !p.culoare?.some?.((c) => culoare.includes(c)))         return false;
    return true;
  });

export const useProductsData = ({ limit, page, sort, brand, rating, model, availability, stocare, ram, culoare, kind, tip }) => {
  const { data: allData }               = useGetAllProductsQuery();
  const { data, isFetching, isLoading } = useGetProductsQuery({ limit, page, sort, brand, rating, model, availability, stocare, ram, culoare, kind, tip });

  const displayAllProducts = allData?.totalProducts ?? [];
  const numberOfPages      = data?.numberOfPages ?? 0;
  const pagesArray         = Array.from({ length: numberOfPages }, (_, i) => i + 1);

  const base = { kind, tip, brand, model, availability, stocare, ram, culoare };

  // Per-filter context: all products matching every OTHER active filter
  // so each filter only shows options valid in the current context
  const brandContext        = applyFilters(displayAllProducts, { ...base, brand: [] });
  const modelContext        = applyFilters(displayAllProducts, { ...base, model: [] });
  const culoareContext      = applyFilters(displayAllProducts, { ...base, culoare: [] });
  const availabilityContext = applyFilters(displayAllProducts, { ...base, availability: [] });
  const stocareContext      = applyFilters(displayAllProducts, { ...base, stocare: [] });
  const ramContext          = applyFilters(displayAllProducts, { ...base, ram: [] });
  const ratingContext       = applyFilters(displayAllProducts, base);

  return {
    singleProductData: data, displayAllProducts, pagesArray, isFetching, isLoading,
    brandContext, modelContext,
    culoareContext, availabilityContext, stocareContext, ramContext, ratingContext,
  };
};
