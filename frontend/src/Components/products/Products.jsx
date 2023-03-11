import React from "react";
import { useState } from "react";
import "./products.css";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";
import SingleProduct from "./singleProduct/SingleProductUI";

import CardItemBadges from "./card-item/card-item-badges/card-item-badges";
import CardItemToolbox from "./card-item/card-item-toolbox/card-item-toolbox";
import CardItemInfo from "./card-item/card-item-info/card-item-info";
import CardItemContent from "./card-item/card-item-content/card-item-content";
import Pagination from "./pagination/pagination";

const Products = () => {
  const [limit, setLimit] = useState(30);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState("");
  const [model, setModel] = useState("");
  // console.log(limit, page);

  const limitArray = [30, 60, 90];

  let lastItem = limitArray[limitArray.length - 1];
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
  // console.log(singleProductData.products);

  const nrPages = singleProductData && singleProductData.numberOfPages;
  // console.log(nrPages);

  const itemNumbers = singleProductData && singleProductData.products.length;

  const itemsLimit = singleProductData && singleProductData.limit;

  // create an array with the number of pages
  let pagesArray = [];
  for (let i = 1; i <= nrPages; i++) {
    pagesArray.push(i);
  }
  // console.log(pagesArray);

  // create an array of brands names
  let namesArray = [];
  allProductsData && allProductsData.products.map((item) => namesArray.push(item.brand));
  let uniqueNamesArray = namesArray.filter((item, index) => namesArray.indexOf(item) === index);

  //create an array of models names
  let modelsArray = [];
  allProductsData && allProductsData.products.map((item) => modelsArray.push(item.model));
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
    setModel(e.target.value);
    setLimit(30);
    setPage(1);
    setSort("");
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
            <div className="names">
              <span>Brand: </span>
              <select name="names" id="names" onChange={onOptionChangeSearchNameHandler}>
                <option value="">Alege Numele:</option>
                {uniqueNamesArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setBrand(e.target.value)}>
                    {item}
                  </option>
                ))}
              </select>
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
            <div className="models">
              <span>Models: </span>
              <select name="models" id="models" onChange={onOptionChangeModelNameHandler}>
                <option value="">Models:</option>
                {uniqueModelsArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setModel(e.target.value)}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="container-products-outer">
        <h1>Products Nr: {itemNumbers}</h1>
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
          {pagesArray.map((item, key) => (
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
