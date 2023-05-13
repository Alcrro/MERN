import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AddToCart = () => {
  const cart = useSelector((state) => state.addToCart.cart);

  return (
    <div>
      {cart.map((item, key) => (
        <div key={key}>
          <div>{item.cartQuantity}</div>
          <div>{item.data.description}</div>
        </div>
      ))}
    </div>
  );
};

export default AddToCart;
