import React, { useState } from "react";

const HomeChild = (props) => {
  const productsQuery = props.products?.queryProducts;
  // console.log(productsQuery);

  const allProducts = props.products?.totalProducts;
  // console.log(allProducts);

  // const products = props.products?.map((item) => {
  //   return item;
  // });

  // const allProducts = props.products?.map((item) => {
  //   return item;
  // });

  return (
    <>
      <h1>HomeChild</h1>
      <div>
        <h3>Brand</h3>
        <ul>
          {productsQuery?.map((item, key) => {
            return (
              <div key={key}>
                <li>{item.brand}</li>
              </div>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default HomeChild;
