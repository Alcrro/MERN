import React from "react";
import { useState } from "react";
import "./products.css";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";
import ProductsV2 from "../UI/filtersAndProduct/FiltersAndProducts";
import ListingPanel from "../UI/filtersAndProduct/ListingPanel";
import SideBarFilters from "../UI/sideBarFilters/ratingFilter/RatingSideBarFilter";
import BrandFilter from "../UI/sideBarFilters/brandFilter/BrandFilter";
import ModelFilter from "../UI/sideBarFilters/modelFilter/ModelFilter";

const Products = () => {
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [brand, setBrand] = useState([]);
  const [rating, setRating] = useState([]);
  const [model, setModel] = useState([]);
  const [checked, setChecked] = useState(false);

  // const { rating, setRating } = SideBarFilters([]);

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
  const namesFilterArray = [];
  const displayAllProductsBrandFilter = displayAllProducts?.filter((item) => {
    return brand.length === 0 ? item : brand.includes(item.brand);
  });

  // display all products with models filter
  let modelsFilterArray = [];

  const displayAllProductsModelFilter = displayAllProductsBrandFilter?.filter((item, index) => {
    modelsFilterArray.indexOf(item.model) === -1 && modelsFilterArray.push(item.model);
  });

  // console.log(modelsFilterArray);

  let brandFilterArray = [];
  const displayAllProductsBrandFilter2 = displayAllProductsModelFilter?.filter((item) => {
    brandFilterArray.indexOf(item.brand) === -1 && brandFilterArray.push(item.brand);
  });

  console.log(brandFilterArray);
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
  let namesArray = [];
  allProductsData?.totalProducts.map((item) => namesArray.push(item.brand));
  let uniqueNamesArray = namesArray.filter((item, index) => namesArray.indexOf(item) === index);
  // console.log(uniqueNamesArray);

  //create an array of models names
  let modelsArray = [];
  allProductsData?.totalProducts.map((item) => modelsArray.push(item.model));
  let uniqueModelsArray = modelsArray.filter((item, index) => modelsArray.indexOf(item) === index);

  const onOptionChangeModelNameHandler = (e) => {
    if (e.target.checked === true) {
      setModel(e.target.value);
      setChecked(true);
      const array = [...model];
      array.push(e.target.value);
      setModel(array);
      setPage(1);
    }
    if (e.target.checked === false) {
      setModel("");
      setChecked(false);
      const array = [...model];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setModel(array);
    }
  };

  const checkHandler = (e) => {
    if (e.target.checked === true) {
      setBrand(e.target.value);
      setChecked(true);
      const array = [...brand];
      array.push(e.target.value);
      setBrand(array);
      setPage(1);
      setRating([]);
    }
    if (e.target.checked === false) {
      setBrand("");
      setChecked(false);
      const array = [...brand];
      const index = array.indexOf(e.target.value);
      array.splice(index, 1);
      setBrand(array);
    }
  };

  return (
    <>
      <div className="container-products-outer">
        <div className="sort-options" style={{ paddingLeft: "10px" }}>
          <div className="filter">
            Filtere:
            <div className="container-filtere">
              <ListingPanel />
            </div>
          </div>
        </div>
        <div id="card-grid" className="js-products-container card-collection">
          <div className="main-container-body">
            <h1>Products Nr: {singleProductData?.queryProducts.length}</h1>
            <div className="filter">
              <div className="container-brand-filter">
                <div className="brand-filter-body">
                  <div className="brand-title">
                    <BrandFilter
                      brand={brand}
                      setBrand={setBrand}
                      queryProduct={singleProductData?.queryProducts}
                      brandFilterArray={brandFilterArray}
                      setChecked={setChecked}
                      setPage={setPage}
                      setRating={setRating}
                      model={model}
                    />
                  </div>
                  <div className="sidebar-filter-rating-container">
                    <SideBarFilters
                      rating={rating}
                      setRating={setRating}
                      setLimit={setLimit}
                      brand={brand}
                      queryProduct={singleProductData?.queryProducts}
                    />
                  </div>
                  <div className="brand-title">
                    <h4>Models: </h4>
                    <ModelFilter
                      model={model}
                      setModel={setModel}
                      uniqueModelsArray={uniqueModelsArray}
                      modelsFilterArray={modelsFilterArray}
                      setChecked={setChecked}
                      setPage={setPage}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="page-container">
              <div className="products-container">
                <div className="cards-container">
                  {singleProductData?.queryProducts.map((item, index) => (
                    <ProductsV2 products={item} key={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pagination">
        <div className="pagination-buttons">
          {limit >= 30
            ? pagesArray.map((item, key) => (
                <button key={key} onClick={() => setPage(item)}>
                  {item}
                </button>
              ))
            : pagesFilterArray.map((item, key) => (
                <button key={key} onClick={() => setPage(item)}>
                  {item}
                </button>
              ))}
        </div>
      </div>
    </>
  );
};

export default Products;
