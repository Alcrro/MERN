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
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("latest");
  const [name, setName] = useState("");
  // console.log(limit, page);

  const limitArray = [3, 6, 9, 12];
  const sortArray = ["latest", "oldest", "asc", "desc"];

  const { data: allProductsData } = useGetAllProductsQuery();
  const { data: singleProductData } = useGetProductsQuery({
    limit: limit,
    page: page,
    sort: sort,
    name: name,
  });
  // console.log(singleProductData.products);

  const nrPages = singleProductData && singleProductData.numberOfPages;
  // console.log(nrPages);

  // create an array with the number of pages
  let pagesArray = [];
  for (let i = 1; i <= nrPages; i++) {
    pagesArray.push(i);
  }
  // console.log(pagesArray);

  // create an array of names
  let namesArray = [];
  allProductsData && allProductsData.products.map((item) => namesArray.push(item.name));

  const onOptionChangeLimitHandler = (e) => {
    setLimit(e.target.value);
  };
  const onOptionChangeSortHandler = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const onOptionChangeSearchNameHandler = (e) => {
    setName(e.target.value);
    setLimit(30);
    setPage(1);
    setSort("");
  };

  return (
    <>
      <div className="filters" style={{ paddingLeft: "10px" }}>
        <div className="filter">
          Filtere:
          <div className="container-filtere">
            <div className="limit">
              <select name="limit" id="limit" onChange={onOptionChangeLimitHandler}>
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
            <div className="names">
              <select name="names" id="names" onChange={onOptionChangeSearchNameHandler}>
                {namesArray.map((item, key) => (
                  <option key={key} value={item} onClick={(e) => setName(e.target.value)}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="container-products-outer">
        <h1>Products Nr: {}</h1>
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
        <div className="page">
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
