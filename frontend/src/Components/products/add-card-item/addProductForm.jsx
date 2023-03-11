import React from "react";
import { useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "./addProductForm.css";
import { useAddProductMutation } from "../../../features/product/rtkProducts";

const AddProductForm = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");

  const [addProduct] = useAddProductMutation();

  const handleSubmit = (e) => {
    e.preventDefault();
    addProduct({
      productName,
      price,
      description,
    });
  };
  return (
    <div className="container-add-product-outer">
      <div className="container-add-product-inner">
        <h1>Add Product Form</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="productName"
              id="productName"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              // ref={productNameRef}
              required
              placeholder="Add product name..."
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
            <label htmlFor="image">Image</label>
            <input
              type="text"
              name="image"
              id="image"
              // value={image}
              // onChange={onChange}
              // required
              placeholder="Add product image..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              name="brand"
              id="brand"
              // value={brand}
              // onChange={onChange}
              // required
              placeholder="Add product brand..."
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              id="category"
              // value={category}
              // onChange={onChange}
              // required
              placeholder="Add product category..."
            />
          </div>
          <div className="form-group">
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
          </div>
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
