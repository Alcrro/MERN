import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../../../features/product/rtkProducts";
import NoMatch from "../../../Pages/NoMatch/NoMatch";
import AddToCartButton from "../../UI/add-to-cart-button/Add-to-cart-button";

import "./singleProduct.css";
import AddToFavoriteButton from "../../UI/add-to-favorite-button/Add-to-favorite-button";

const SingleProducts = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useGetSingleProductQuery(id);
  console.log(data);

  if (id === data?.product._id) {
  }

  if (id === data?.product._id) {
    return (
      <div className="single-product-container">
        <div className="single-product-description-desktop">
          <h3>{data?.product.description}</h3>
        </div>
        <div className="single-product-inner">
          <div className="single-product-container-image">
            <img
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8aHVtYW58ZW58MHx8MHx8&w=1000&q=80"
              alt="product"
              width={"200px"}
              height={"200px"}
            />
          </div>
          <div className="single-product-container-info">
            <div className="single-product-description-mobile">{data?.product.description}</div>
            <div className="single-product-rating"> Rating: {data?.product.rating}</div>
          </div>
          <div className="single-product-container-price1">
            <div className="single-product-price1">
              {data?.product.price}
              <span> Lei</span>
            </div>
            <div className="add-button-container">
              <AddToFavoriteButton />
              <AddToCartButton />
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <NoMatch />;
  }
};

export default SingleProducts;
