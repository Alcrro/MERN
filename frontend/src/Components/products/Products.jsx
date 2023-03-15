import React from "react";
import { useState } from "react";
import "./products.css";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";
import SingleProduct from "./singleProduct/SingleProductUI";

import CardItemBadges from "./card-item/card-item-badges/card-item-badges";
import CardItemToolbox from "./card-item/card-item-toolbox/card-item-toolbox";
import CardItemInfo from "./card-item/card-item-info/card-item-info";
import CardItemContent from "./card-item/card-item-content/card-item-content";

const Products = () => {
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [brand, setBrand] = useState([]);
  const [rating, setRating] = useState("");
  const [model, setModel] = useState([]);
  const [checked, setChecked] = useState(false);

  const limitArray = [30, 60, 90];

  const sortArray = ["latest", "oldest", "asc", "desc"];
  const ratingArray = [1, 2, 3, 4, 5];

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
  const displayAllProducts = allProductsData?.products.map((item) => item);
  // console.log(displayAllProducts);

  // display all products with models filter
  const displayAllProductsBrandFilter = displayAllProducts?.filter((item) => {
    return brand.length === 0 ? item : brand.includes(item.brand);
  });
  // console.log(displayAllProductsBrandFilter);

  // display all products with models filter
  let modelsFilterArray = [];
  const displayAllProductsModelFilter = displayAllProductsBrandFilter?.filter((item, index) => {
    modelsFilterArray.indexOf(item.model) === -1 && modelsFilterArray.push(item.model);
  });
  // console.log(displayAllProductsModelFilter);
  // console.log(modelsFilterArray);

  // End test reduce filters

  // DE VERIFICAT
  const itemNumbers = allProductsData?.numberOfPages;
  console.log(itemNumbers);

  const totalProducts = singleProductData?.products.length;
  const pagesNr = Math.ceil(totalProducts / limit);
  console.log(pagesNr);

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
  allProductsData?.products.map((item) => namesArray.push(item.brand));
  let uniqueNamesArray = namesArray.filter((item, index) => namesArray.indexOf(item) === index);

  //create an array of models names
  let modelsArray = [];
  allProductsData?.products.map((item) => modelsArray.push(item.model));
  let uniqueModelsArray = modelsArray.filter((item, index) => modelsArray.indexOf(item) === index);

  // rating values
  let ratingArrayItems = [];
  allProductsData &&
    allProductsData.products.map((item) => {
      ratingArrayItems.push(item.rating);
    });

  const onOptionChangeLimitHandler = (e) => {
    setLimit(e.target.value);
  };
  const onOptionChangeSortHandler = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const onOptionChangeSearchNameHandler = (e) => {
    setBrand(e.target.value);
    setLimit(30);
    setPage(1);
    setSort("");
  };

  const onOptionChangeRatingNameHandler = (e) => {
    setRating(e.target.value);
    setLimit(30);
    setPage(1);
    setSort("");
  };
  const onOptionChangeModelNameHandler = (e) => {
    if (e.target.checked === true) {
      setModel(e.target.value);
      setChecked(true);
      const array = [...model];
      array.push(e.target.value);
      setModel(array);
      // console.log(array);
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
      // console.log(array);
      setPage(1);
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
      <div className="sort-options" style={{ paddingLeft: "10px" }}>
        <div className="filter">
          Filtere:
          <div className="container-filtere">
            <div className="limit">
              <select
                name="limit"
                id="limit"
                value={limit ? limit : 30}
                onChange={onOptionChangeLimitHandler}
              >
                {limitArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setLimit(e.target.value)}>
                    Limit {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="sort">
              <select name="sort" id="sort" onChange={onOptionChangeSortHandler}>
                {sortArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setSort(e.target.value)}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter">
            <div className="container-brand-filter">
              <div className="brand-title">
                <h4>Brand: </h4>
                <form>
                  {uniqueNamesArray.map((item, key) => (
                    <div key={key}>
                      <input
                        type="checkbox"
                        className={brand === item ? "checked" : "unchecked"}
                        name="brands"
                        id={item}
                        value={item}
                        onChange={checkHandler}
                      />
                      <label htmlFor={item}> {item}</label>
                    </div>
                  ))}
                </form>
              </div>
            </div>

            <div className="rating">
              <span>Rating: </span>
              <select name="rating" id="rating" onChange={onOptionChangeRatingNameHandler}>
                <option value="">Rating:</option>
                {ratingArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setRating(e.target.value)}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="brand-title">
              <h4>Models: </h4>
              <form>
                {model === ""
                  ? uniqueModelsArray?.map((item, key) => (
                      <div key={key}>
                        <input
                          type="checkbox"
                          className={model === item ? "checked" : "unchecked"}
                          name="model"
                          id={item}
                          value={item}
                          onChange={onOptionChangeModelNameHandler}
                        />
                        <label htmlFor={item}> {item}</label>
                      </div>
                    ))
                  : modelsFilterArray?.map((item, key) => {
                      return (
                        <div key={key}>
                          <input
                            type="checkbox"
                            className={model === item ? "checked" : "unchecked"}
                            name="model"
                            id={item}
                            value={item}
                            onChange={onOptionChangeModelNameHandler}
                          />
                          <label htmlFor={item}> {item}</label>
                        </div>
                      );
                    })}
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="container-products-outer">
        <h1>Products Nr: {singleProductData?.products.length}</h1>
        <div id="card-grid" className="js-products-container card-collection">
          {singleProductData &&
            singleProductData.products.map((item) => (
              <div className="card-item" key={item._id}>
                <div className="card-item-wrapper js-section-wrapper">
                  <CardItemBadges badges={"test"} />
                  <CardItemToolbox toolbox={item} />
                  <CardItemInfo info={item} />
                  <CardItemContent content={item} />
                  <SingleProduct singleProduct={item} />
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className="pagination">
        <div className="pagination-buttons">
          {singleProductData?.products.length >= 30
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
