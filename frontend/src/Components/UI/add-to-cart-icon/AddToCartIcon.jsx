import React from "react";
import "./addToCartIcon.css";
import { useSelector } from "react-redux";

const AddToCartIcon = () => {
  const itemQ = useSelector((state) => state.addToCart);

  return (
    <div className="add-to-cart-icon">
      {itemQ.cartTotalQuantity > 0 ? <span>{itemQ.cartTotalQuantity}</span> : null}
    </div>
  );
};

export default AddToCartIcon;
