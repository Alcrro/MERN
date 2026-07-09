import React from "react";
import { useState } from "react";
import "../../products/products.css";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../../features/product/rtkProducts";
import ListingPanel from "../../UI/filtersAndProduct/ListingPanel";
import SideBarFilters from "../../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";
import Pagination from "../../UI/pagination/Pagination";
import Cards from "../cards/Cards";
import AllCategories from "../../UI/category/allCategories/AllCategories";
import { useSelector } from "react-redux";

const Products = () => {
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("Newest");
  const [brand, setBrand] = useState([]);
  const [rating, setRating] = useState([]);
  const [model, setModel] = useState([]);
  const [checked, setChecked] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const activeFilterCount = brand.length + rating.length + model.length;

  // const { rating, setRating } = SideBarFilters([]);

  const cardViewListClass = useSelector((state) => state.cardsView.cardViewListClassName);
  const cardViewGridClass = useSelector((state) => state.cardsView.cardViewGridClassName);

  const { data: allProductsData } = useGetAllProductsQuery();
  const { data: singleProductData } = useGetProductsQuery({
    limit: limit,
    page: page,
    sort: sort,
    brand: brand,
    rating: rating,
    model: model,
  });

  // start test reduce filters

  // display all products
  const displayAllProducts = allProductsData?.totalProducts.map((item) => item);

  // display all products with models filter

  const displayAllProductsBrandFilter = displayAllProducts?.filter((item) => {
    return brand.length === 0 ? item : brand.includes(item.brand);
  });

  // display all products with models filter
  let modelsFilterArray = [];

  const displayAllProductsModelFilter = displayAllProductsBrandFilter?.filter((item) => {
    if (modelsFilterArray.indexOf(item.model) === -1) modelsFilterArray.push(item.model);
    return true;
  });

  let brandFilterArray = [];
  displayAllProductsModelFilter?.forEach((item) => {
    if (brandFilterArray.indexOf(item.brand) === -1) brandFilterArray.push(item.brand);
  });

  // DE VERIFICAT
  const itemNumbers = allProductsData?.numberOfPages;

  const totalProducts = singleProductData?.queryProducts.length;
  const pagesNr = Math.ceil(totalProducts / limit);

  // create an array with the number of pages

  let pagesArray = [];
  for (let i = 1; i <= itemNumbers; i++) {
    pagesArray.push(i);
  }

  let pagesFilterArray = [];
  for (let i = 1; i <= pagesNr; i++) {
    pagesFilterArray.push(i);
  }

  // create an array of brands names

  const FilterContent = () => (
    <>
      <div className="filters-v2-container">
        <AllCategories
          data={singleProductData}
          model={model}
          setModel={setModel}
          brand={brand}
          setBrand={setBrand}
          setPage={setPage}
          setLimit={setLimit}
          checked={checked}
          setChecked={setChecked}
          setSort={setSort}
          rating={rating}
          setRating={setRating}
        />
      </div>
      <div className="container-brand-filter">
        <div className="brand-filter-body">
          <div className="sidebar-filter-rating-container">
            <SideBarFilters
              rating={rating}
              setRating={setRating}
              setLimit={setLimit}
              brand={brand}
              queryProduct={singleProductData?.queryProducts}
            />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile filter backdrop */}
      {filterOpen && <div className="mob-filter-backdrop" onClick={() => setFilterOpen(false)} />}

      {/* Mobile filter sheet */}
      <div className={`mob-filter-sheet${filterOpen ? " mob-filter-sheet--open" : ""}`}>
        <div className="mob-filter-sheet__head">
          <span>Filtre {activeFilterCount > 0 && <span className="mob-filter-badge">{activeFilterCount}</span>}</span>
          <button onClick={() => setFilterOpen(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <div className="mob-filter-sheet__body">
          <FilterContent />
        </div>
        <div className="mob-filter-sheet__foot">
          <button className="mob-filter-apply" onClick={() => setFilterOpen(false)}>
            Vezi {singleProductData?.queryProducts?.length ?? 0} produse
          </button>
        </div>
      </div>

      <div className="container-products-outer">
        <div className="filter">
          <div className="filters-v2-container">
            <AllCategories
              data={singleProductData}
              model={model}
              setModel={setModel}
              brand={brand}
              setBrand={setBrand}
              setPage={setPage}
              setLimit={setLimit}
              checked={checked}
              setChecked={setChecked}
              setSort={setSort}
              rating={rating}
              setRating={setRating}
            />
          </div>
          <div className="container-brand-filter">
            <div className="brand-filter-body">
              <div className="sidebar-filter-rating-container">
                <SideBarFilters
                  rating={rating}
                  setRating={setRating}
                  setLimit={setLimit}
                  brand={brand}
                  queryProduct={singleProductData?.queryProducts}
                />
              </div>
            </div>
          </div>
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
                  <div
                    className={`card-collection ${
                      cardViewGridClass ? cardViewGridClass : cardViewListClass
                    }`}
                  >
                    {singleProductData?.queryProducts.map((item, index) => (
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
