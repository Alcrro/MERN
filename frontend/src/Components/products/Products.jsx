import React from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getAllProducts, reset } from "../../features/product/productSlice";
import { useNavigate } from "react-router-dom";
import "./products.css";
import ProductItemDescription from "./productItemDescription";

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { products, count, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }
    dispatch(getAllProducts());
  }, [dispatch]);

  return (
    <>
      <div className="container-products-outer">
        <h1>Products Nr: {products.count}</h1>
        <div id="card-grid" className="js-products-container card-collection">
          {products.products &&
            products.products.map((item) => (
              <div className="card-item" key={item._id}>
                <div className="card-item-wrapper js-section-wrapper">
                  <div className="card-item-badges"></div>
                  <div className="card-item-toolbox"></div>
                  <div className="card-item-info"></div>
                  <div className="card-item-content"></div>
                </div>
                <ProductItemDescription productDescription={item} />
                {/* <div className="product-name">{item.name}</div> */}
                <div className="product-description">{item.description}</div>
                <div className="product-price">{item.price}</div>
                <div className=" btn-cart">
                  <button className="btn btn-primary">Add to cart</button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default Products;
