import React from "react";
import "./addToCartIcon.css";
import { useSelector } from "react-redux";

const AddToCartIcon = () => {
  const itemQ = useSelector((state) => state.addToCart);
  // console.log(itemQ);

  return (
    <div className="add-to-cart-icon">
      <div className="add-to-cart-icon-inner">
        {itemQ.cartTotalQuantity > 0 ? <span>{itemQ.cartTotalQuantity}</span> : null}
      </div>
    </div>
  );
};

export default AddToCartIcon;
