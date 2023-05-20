import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../add-to-cart-v2-button/addToCartV2button.css";

import { addToCart } from "../../../features/product/addToCart/addToCartSlice";

const AddToCartV2Button = (props) => {
  // console.log(props);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  return (
    <div className="add-to-cart-v2-button-inner">
      <button className="btn add-to-cart-v2-button" onClick={() => handleAddToCart(props)}>
        Add to Cart
      </button>
    </div>
  );
};

export default AddToCartV2Button;
