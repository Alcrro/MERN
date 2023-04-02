import React from "react";
import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "./addProductForm.css";
import { useAddProductMutation } from "../../../features/product/rtkProducts";

const AddProductForm = () => {
  const [productBrand, setProductBrand] = useState("");
  const [price, setPrice] = useState("");
  const [productModel, setProductModel] = useState("");
  const [productMemorieInterna, setProductMemorieInterna] = useState("");
  const [productRating, setProductRating] = useState("");

  const [description, setDescription] = useState("");

  const [addProduct] = useAddProductMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      productBrand,
      price,
      description,
      productModel,
      productMemorieInterna,
      productRating,
    });
  };
  return (
    <div className="container-add-product-outer">
      <div className="container-add-product-inner">
        <h1>Add Product Form</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Brand</label>
            <input
              type="text"
              name="productBrand"
              id="productBrand"
              value={productBrand}
              onChange={(e) => setProductBrand(e.target.value)}
              // ref={productNameRef}
              required
              placeholder="Add product brand..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              // ref={productPriceRef}
              required
              placeholder="Add product price..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              type="text"
              name="productModel"
              id="model"
              value={productModel}
              onChange={(e) => setProductModel(e.target.value)}
              // required
              placeholder="Add product model..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="productRating">Product rating</label>
            <input
              type="text"
              name="productRating"
              id="productRating"
              value={productRating}
              onChange={(e) => setProductRating(e.target.value)}
              // required
              placeholder="Add product Rating..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="productMemorieInterna">Internal Storage</label>
            <input
              type="text"
              name="productMemorieInterna"
              id="productMemorieInterna"
              value={productMemorieInterna}
              onChange={(e) => setProductMemorieInterna(e.target.value)}
              // required
              placeholder="Add product Internal Storage..."
            />
          </div>
          {/* <div className="form-group">
            <label htmlFor="countInStock">Count In Stock</label>
            <input
              type="text"
              name="countInStock"
              id="countInStock"
              // value={countInStock}
              // onChange={onChange}
              // required
              placeholder="Add product count in stock..."
            />
          </div> */}
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              id="description"
              cols="30"
              rows="10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              // ref={productDescriptionRef}
              required
              placeholder="Add product description..."
            ></textarea>
          </div>
          <button>Add Product</button>
        </form>
      </div>
      <ToastContainer className={"toast-container hidden"} />
    </div>
  );
};

export default AddProductForm;
