import React, { useState } from "react";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";

const Home = () => {
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(2);
  const [sort, setSort] = useState("asc");
  // console.log(limit, page);

  const limitArray = [3, 6, 9, 12];
  const sortArray = ["asc", "desc"];

  const { data: allProductsData } = useGetAllProductsQuery();
  const { data: singleProductData } = useGetProductsQuery({ limit: limit, page: page, sort: sort });
  // console.log(singleProductData.products);

  const nrPages = singleProductData && singleProductData.numberOfPages;
  // console.log(nrPages);

  // create an array with the number of pages
  let pagesArray = [];
  for (let i = 1; i <= nrPages; i++) {
    pagesArray.push(i);
  }
  // console.log(pagesArray);

  const onOptionChangeLimitHandler = (e) => {
    setLimit(e.target.value);
  };
  const onOptionChangeSortHandler = (e) => {
    setSort(e.target.value);
    setPage(1);
  };

  const onOptionChangePageHandler = (e) => {
    pagesArray.map((item) => {});
  };

  return (
    <div>
      <div>
        Filters:
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
                Sort {item}
              </option>
            ))}
          </select>
        </div>
        <h1>Home</h1>
        {singleProductData &&
          singleProductData.products.map((item) => (
            <div key={item._id}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <p>{item.price}</p>
            </div>
          ))}
        <div className="page">
          {pagesArray.map((item, key) => (
            <button key={key} onClick={() => setPage(item)}>
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
