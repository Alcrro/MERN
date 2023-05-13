import React, { useEffect, useState } from "react";
import { FaStarHalfAlt, FaStar } from "react-icons/fa";
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai";

import { useGetAllProductsQuery, useGetProductsQuery } from "../../features/product/rtkProducts";

const RateFilterStars = () => {
  const { data: allProductsData } = useGetAllProductsQuery();

  const allProducts = allProductsData?.totalProducts;
  // console.log(allProducts);

  let rateArray = [];
  allProductsData?.totalProducts.map((item) => rateArray.push(item.rating));
  let uniqueRatesArray = rateArray.filter((item, index) => rateArray.indexOf(item) === index);

  // console.log(uniqueRatesArray);

  // show stars based on rating
  function showStars(rating) {
    let array = [1, 2, 3, 4, 5];
    let number = rating + 0.5;

    return (
      <>
        {array.map((item, index) => {
          return (
            <span key={index} style={{ fontSize: "18px" }}>
              {rating >= index + 1 ? (
                <FaStar className="icon" style={{ color: "#f9bf3b" }} />
              ) : rating >= number ? (
                <FaStarHalfAlt className="icon" style={{ color: "gold" }} />
              ) : (
                <AiTwotoneStar className="icon" style={{ color: "#ccc" }} />
              )}
            </span>
          );
        })}
      </>
    );
  }

  return uniqueRatesArray
    ?.sort((a, b) => b - a)
    .map((item, index) => {
      return (
        <div key={index}>
          {showStars(item)}
          <div style={{ display: "inline-block", alignContent: "center" }}>
            <span style={{ padding: "0 7px" }}>
              ({allProductsData?.totalProducts.filter((product) => product.rating === item).length})
            </span>
          </div>
        </div>
      );
    });
};

export default RateFilterStars;
