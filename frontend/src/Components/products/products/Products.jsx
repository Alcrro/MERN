import { useState } from "react";
import "../../products/products.css";
import { useProductFilters } from "./useProductFilters";
import ListingPanel from "../../UI/filtersAndProduct/ListingPanel";
import Pagination from "../../UI/pagination/Pagination";
import Cards from "../cards/Cards";
import FilterContent from "./FilterContent";
import MobileFilterSheet from "./MobileFilterSheet";

const Products = () => {
  const filters = useProductFilters();
  const [filterOpen, setFilterOpen] = useState(false);

  const {
    singleProductData, displayAllProducts, activeFilterCount,
    limit, setLimit, setPage, sort, setSort,
    brand, setBrand, model, setModel, checked, setChecked,
    pagesArray, pagesFilterArray, cardViewGridClass, cardViewListClass,
  } = filters;

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
          <div className="main-container-body">
            <ListingPanel
              limit={limit}
              setLimit={setLimit}
              queryProduct={singleProductData?.queryProducts}
              brand={brand}
              setBrand={setBrand}
              model={model}
              setModel={setModel}
              checked={checked}
              setChecked={setChecked}
              sort={sort}
              setSort={setSort}
              displayAllProducts={displayAllProducts}
              onOpenFilters={() => setFilterOpen(true)}
              activeFilterCount={activeFilterCount}
            />
            <div className="page-container">
              <div className="products-container-v2">
                <div className="cards-container-outer">
                  <div className={`card-collection ${cardViewGridClass || cardViewListClass}`}>
                    {singleProductData?.queryProducts?.map((item, index) => (
                      <Cards products={item} key={index} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <Pagination
              pagesArray={pagesArray}
              limit={limit}
              setPage={setPage}
              pagesFilterArray={pagesFilterArray}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;
