import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./addToCart.css";
import { Link } from "react-router-dom";
import {
  addToCart,
  removeFromCart,
  removeSingleCart,
} from "../../../features/product/addToCart/addToCartSlice";

const AddToCart = () => {
  const cart = useSelector((state) => state.addToCart);
  const totalPrice = useSelector((state) => state.addToCart);

  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    if (product.itemQuantity >= product.data.stock) {
    } else {
      dispatch(addToCart(product));
    }
  };
  const handleRemoveToCart = (product) => {
    if (product.itemQuantity > 1) {
      dispatch(removeSingleCart(product));
    } else if (product.itemQuantity === 1) {
      dispatch(removeFromCart());
    }
  };

  const removeModalItems = (product) => {
    // console.log(id);
    dispatch(removeFromCart(product));
    // console.log(cart);
  };

  return (
    <div className="add-to-cart-container">
      {cart?.card.length > 0 ? (
        <>
          <h2 className="page-title">My Cart</h2>
          <div className="add-to-cart-container-in">
            <div className="add-to-container-body">
              {cart?.card.map((item, key) => {
                return (
                  <>
                    <div className="add-to-cart-item" key={key}>
                      <div className="add-to-cart-close" onClick={() => removeModalItems(item)}>
                        <span>X</span>
                      </div>
                      <div className="add-to-cart-inner">
                        <img
                          src={require("../../../Assets/images/panda.png")}
                          alt=""
                          width={"150px"}
                          height={"150px"}
                        />
                        <div>{item.data.description}</div>

                        <div className="add-to-cart-footer">
                          <div className="add-to-cart-price">
                            {item.itemAmountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                            $
                          </div>
                          <div className="add-to-cart-quantity">
                            <div className="group-info">
                              <button onClick={() => handleRemoveToCart(item)}>-</button>
                              <div>{item.itemQuantity}</div>
                              <button onClick={() => handleAddToCart(item)}>+</button>
                            </div>

                            <div className="message-info">{}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>

            <div className="add-to-cart-total-container">
              <h3>Total Amount</h3>
              <div className="add-to-cart-total-cost-product">
                <div className="order-summary-line">
                  <span>Products price:</span>
                  <span>
                    {totalPrice.cartTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
                  </span>
                </div>
              </div>
              <div className="add-to-cart-total-cost-delivery">
                <div className="order-summary-line">
                  <span>Products delivery:</span>
                  <span>Free </span>
                </div>
              </div>
              <div className="add-to-cart-total">
                <h3>Total:</h3>
                <span>
                  {totalPrice.cartTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
                </span>
              </div>
              <div className="checkout-inner">
                <Link to="/cart/checkout" className="checkout-btn">
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="empty-cart">
          <h3>Your Cart is empty</h3>
        </div>
      )}
    </div>
  );
};

export default AddToCart;
