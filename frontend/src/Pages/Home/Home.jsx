import React, { useState } from "react";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";
import HomeChild from "./HomeChild";
import RatingFilter from "./RatingFilter";

const Home = () => {
  const [limit, setLimit] = useState();
  const [rating, setRating] = useState([]);

  const { data: allProductsData } = useGetAllProductsQuery();
  const { data: getProductQuery } = useGetProductsQuery({
    limit: limit,
    page: 1,
    sort: "latest",
    brand: [],
    rating: rating,
    model: [],
  });
  // console.log(getProductQuery);

  const products = allProductsData;
  const allProducts = allProductsData?.queryProducts?.map((item) => {
    return item;
  });

  // console.log(allProductsData?.totalProducts);

  return (
    <div>
      <h1>Home</h1>
      <div>
        <HomeChild products={getProductQuery} setRating={setRating} />
        <div className="filters-container">
          <RatingFilter rating={rating} setRating={setRating} />
        </div>
      </div>
    </div>
  );
};
export default Home;
