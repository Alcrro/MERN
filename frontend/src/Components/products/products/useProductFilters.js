import { useFilterState } from "./useFilterState";
import { useProductsData } from "../../../features/product/useProductsData";

export const useProductFilters = ({ initialBrand = [] } = {}) => {
  const filterState = useFilterState({ initialBrand });
  const { kind, tip, limit, page, sort, brand, rating, model, availability, stocare, ram, culoare } = filterState;

  const {
    singleProductData, displayAllProducts, pagesArray, isFetching, isLoading,
    brandContext, modelContext,
    culoareContext, availabilityContext, stocareContext, ramContext, ratingContext,
  } = useProductsData({ limit, page, sort, brand, rating, model, availability, stocare, ram, culoare, kind, tip });

  const activeFilterCount =
    brand.length + rating.length + model.length +
    availability.length + stocare.length + ram.length + culoare.length;

  return {
    ...filterState, singleProductData, displayAllProducts, pagesArray,
    activeFilterCount, isFetching, isLoading,
    brandContext, modelContext,
    culoareContext, availabilityContext, stocareContext, ramContext, ratingContext,
  };
};
