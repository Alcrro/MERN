import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./Add-to-cart-button.css";

const AddToCartButton = () => {
  const [item, setItem] = useState("");
  return (
    <div className="add-to-cart-container">
      <button className="btn add-to-cart">
        Add to Cart1 {item ? <span className="btn cart-aux-button">({item})</span> : null}
      </button>
    </div>
  );
};

export default AddToCartButton;
