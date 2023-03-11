import React, { useState } from "react";
import { useGetProductsQuery } from "../../../features/product/rtkProducts";

const Pagination = () => {
  const [limit, setLimit] = useState(3);
  const [page, setPage] = useState(1);

  const { data: singleProductData } = useGetProductsQuery({
    limit: limit,
    page: page,
  });

  const nrPages = singleProductData && singleProductData.numberOfPages;

  // create an array with the number of pages
  let pagesArray = [];
  for (let i = 1; i <= nrPages; i++) {
    pagesArray.push(i);
  }
  console.log(pagesArray);

  return (
    <div className="page">
      {pagesArray.map((item, key) => (
        <button key={key} onClick={() => setPage(item)}>
          {item}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
