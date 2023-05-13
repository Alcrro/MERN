import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleProductQuery } from "../../../features/product/rtkProducts";
import NoMatch from "../../../Pages/NoMatch/NoMatch";

import "./singleProduct.css";

import AddToCartV2Button from "../../UI/add-to-cart-v2-button/AddToCartV2Button";
import AddToFavoriteV2Button from "../../UI/add-to-favorite-v2-button/AddToFavoriteV2Button";
import SingleCardRating from "../../UI/singleCardRating/SingleCardRating";

const SingleProducts = () => {
  const { id } = useParams();

  const { data, isLoading, error } = useGetSingleProductQuery(id);

  if (id === data?.product._id) {
    return (
      <div className="single-product-container">
        <div className="single-product-description-desktop">
          <h3>{data?.product.description}</h3>
        </div>
        <div className="single-product-inner">
          <div className="single-product-container-image">
            <img
              src={require("../../../Assets/images/panda.png")}
              alt="product"
              width={"200px"}
              height={"200px"}
            />
          </div>
          <div className="single-product-container-info">
            <div className="single-product-description-mobile">{data?.product.description}</div>
            <div className="single-product-rating">
              <SingleCardRating data={data?.product} />
            </div>
          </div>
          <div className="single-product-container-price1">
            <div className="single-product-price1">
              {data?.product.price}
              <span> $</span>
            </div>
            <div className="add-button-container">
              <AddToFavoriteV2Button />
              <AddToCartV2Button />
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
