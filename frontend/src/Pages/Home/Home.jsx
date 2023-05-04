import React, { useState } from "react";
import "./Home.css";
import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";

const Home = () => {
  // create an object
  const rateObject = [
    {
      id: 1,
      style: 20,
    },
    {
      id: 2,
      style: 40,
    },
    {
      id: 3,
      style: 60,
    },
    {
      id: 4,
      style: 80,
    },
    {
      id: 5,
      style: 100,
    },
  ];

  const { data: products } = useGetAllProductsQuery();
  console.log(products?.totalProducts);

  return (
    <div className="star-rating-containerV2">
      <h2>First Before</h2>
      <div className="star-rating-body">
        {rateObject
          .sort((a, b) => b.id - a.id)
          .map((rate) => {
            return (
              <a href="#" key={rate.id} className={`star-rating-link rate-${rate.id}`}>
                <input type="checkbox" className="star-rating-checkbox" />
                <div className="first-star-rating star-rating-read">
                  <div className="star-rating-inner" style={{ width: `${rate.style}%` }}></div>
                </div>
                <div className="star-rating-text">
                  {/* length items */}
                  <span>
                    ({products?.totalProducts.filter((item) => item.rating >= rate.id).length})
                  </span>
                </div>
              </a>
            );
          })}
      </div>
    </div>
  );
};

export default Home;
