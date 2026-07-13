import ListingPanel from "../../UI/filtersAndProduct/ListingPanel";
import Pagination from "../../UI/pagination/Pagination";
import Cards from "../cards/Cards";
import CardSkeleton from "../cards/CardSkeleton";

const SKELETON_COUNT = 8;

const ProductGrid = ({ filters, onOpenFilters }) => {
  const {
    singleProductData, displayAllProducts, activeFilterCount,
    limit, setLimit, setPage, sort, setSort,
    brand, setBrand, model, setModel, checked, setChecked,
    pagesArray, cardViewGridClass, cardViewListClass,
    isFetching,
  } = filters;

  const products = singleProductData?.queryProducts ?? [];

  return (
    <div className="main-container-body">
      <ListingPanel
        limit={limit}
        setLimit={setLimit}
        queryProduct={products}
        brand={brand}
        setBrand={setBrand}
        model={model}
        setModel={setModel}
        checked={checked}
        setChecked={setChecked}
        sort={sort}
        setSort={setSort}
        displayAllProducts={displayAllProducts}
        onOpenFilters={onOpenFilters}
        activeFilterCount={activeFilterCount}
      />
      <div className="page-container">
        <div className="products-container-v2">
          <div className="cards-container-outer">
            <div className={`card-collection ${cardViewGridClass || cardViewListClass}`}>
              {isFetching
                ? Array.from({ length: SKELETON_COUNT }, (_, i) => <CardSkeleton key={i} />)
                : products.map((item) => <Cards products={item} key={item._id} />)
              }
            </div>
          </div>
        </div>
      </div>
      <Pagination
        pagesArray={pagesArray}
        pagesFilterArray={[]}
        limit={limit}
        setPage={setPage}
      />
    </div>
  );
};

export default ProductGrid;
