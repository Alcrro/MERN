import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

const AddProduct = () => {
  return (
    <div className="link-add-product">
      <Link to="/add/product">Add Product</Link>;
    </div>
  );
};

export default AddProduct;
