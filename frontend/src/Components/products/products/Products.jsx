import { useState } from "react";
import { useParams } from "react-router-dom";
import "../../products/products.css";
import { useProductFilters } from "./useProductFilters";
import { useSeo } from "../../../hooks/useSeo";
import { buildProductSeo } from "../../../utils/seoHelpers";
import { TIP_SLUG_TO_TIP } from "../../../utils/categorySlugMap";
import FilterContent from "./FilterContent";
import MobileFilterSheet from "./MobileFilterSheet";
import ProductGrid from "./ProductGrid";
import ProductEcosystem from "../ProductEcosystem";
import EcosystemCarousels from "../ProductEcosystem/EcosystemCarousels";
import ProductConfigurator from "../ProductConfigurator";

const Products = () => {
  const { tipSlug } = useParams();
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
          <ProductEcosystem />
          <FilterContent filters={filters} />
        </div>
        <div id="card-grid" className="js-products-container card-collection">
          <ProductGrid filters={filters} onOpenFilters={() => setFilterOpen(true)} />
        </div>
      </div>
      <EcosystemCarousels />
      <ProductConfigurator tip={TIP_SLUG_TO_TIP[tipSlug]} />
    </>
  );
};

export default Products;
