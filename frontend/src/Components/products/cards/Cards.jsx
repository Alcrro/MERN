import React from "react";
import "./cards.css";
import SingleCardRating from "../../UI/singleCardRating/SingleCardRating";
import AddToCartButton from "../../UI/add-to-cart-button/Add-to-cart-button";
import AddToCartV2Button from "../../UI/add-to-cart-v2-button/AddToCartV2Button";
import { Link, NavLink } from "react-router-dom";

const Cards = (props) => {
  const data = props.products;
  return (
    <div className="card-item">
      <div className="card-v2">
        <div className="card-v2-wrapper">
          <div className="card-v2-info">
            <a href={`/product/${data._id}`} className="card-v2-thumb">
              <div className="card-v2-thumb-inner">
                <img
                  src={require("../../../Assets/images/panda.png")}
                  alt=""
                  width={"200px"}
                  height={"200px"}
                />
              </div>
              <div className="pad-description">
                <h2 className="card-v2-title-wrapper">{data.description}</h2>
                <div className="card-v2-rating">
                  <SingleCardRating data={data} />
                </div>
                <div className="card-estimate-placeholder">
                  <span>in stock</span>
                </div>
              </div>
            </a>
          </div>
          <div className="card-v2-content">
            <div className="card-v2-price">
              <p className="product-new-price">
                {data.price}
                <sup>
                  <small className="decimal">,</small>
                  99
                </sup>
                <span>$</span>
              </p>
            </div>
            <div className="card-v2-add-to-cart">
              <AddToCartV2Button data={data} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
