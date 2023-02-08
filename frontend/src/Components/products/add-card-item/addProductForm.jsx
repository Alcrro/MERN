import React from "react";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addProduct, reset } from "../../../features/product/postProductSlice";
import { toast } from "react-toastify";
import "./addProductForm.css";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
  });

  const { name, price, description } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { product, isLoading, isSuccess, isError, message } = useSelector((state) => state.product);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isError) {
      toast.error(message);
    } else {
      toast.success(message);
      const productData = {
        name,
        price,
        description,
      };

      dispatch(addProduct(productData));
    }
  };
  return (
    <div className="container-add-product-outer">
      <div className="container-add-product-inner">
        <h1>Add Product Form</h1>

        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              required
              placeholder="Add product description..."
            ></textarea>
          </div>
          <button>Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
