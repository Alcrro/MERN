import { useState } from "react";
import "../../products/products.css";
import { useProductFilters } from "./useProductFilters";
import { useSeo } from "../../../hooks/useSeo";
import { buildProductSeo } from "../../../utils/seoHelpers";
import FilterContent from "./FilterContent";
import MobileFilterSheet from "./MobileFilterSheet";
import ProductGrid from "./ProductGrid";

const Products = () => {
  const filters = useProductFilters();
  const [filterOpen, setFilterOpen] = useState(false);
  const { singleProductData, activeFilterCount, brand, model } = filters;

  useSeo(buildProductSeo(brand, model, "/products"));

  return (
    <>
      <MobileFilterSheet
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        productCount={singleProductData?.queryProducts?.length ?? 0}
        activeFilterCount={activeFilterCount}
      >
        <FilterContent filters={filters} />
      </MobileFilterSheet>

      <div className="container-products-outer">
        <div className="filter">
          <FilterContent filters={filters} />
        </div>
        <div id="card-grid" className="js-products-container card-collection">
          <ProductGrid filters={filters} onOpenFilters={() => setFilterOpen(true)} />
        </div>
      </div>
    </>
  );
};

export default Products;
