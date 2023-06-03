import React from "react";
import "./addToCartModal.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  removeFromCart,
  addToCart,
  removeSingleCart,
} from "../../../features/product/addToCart/addToCartSlice";

const AddToCartModal = () => {
  const cart = useSelector((state) => state.addToCart);
  const isHover = useSelector((state) => state.hoverLink.hovering);
  const cartSum = useSelector((state) => state.addToCart.card);
  const totalPrice = useSelector((state) => state.addToCart);
  const removeItem = useSelector((state) => state.removeFromCart);

  const dispatch = useDispatch();

  const removeModalItems = (product) => {
    // console.log(id);
    dispatch(removeFromCart(product));
    // console.log(cart);
  };
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleRemoveToCart = (product) => {
    dispatch(removeSingleCart(product));
  };

  return (
    <>
      <div className="add-to-cart-modal-container">
        <div className="add-to-cart-modal-inner">
          <div className="add-to-cart-modal-title">LIST ITEMS:</div>
          <div className="add-to-cart-modal-body">
            {cart?.card.length > 0 ? (
              cart?.card.map((item, key) => {
                return (
                  <Link to={"/cart/products"} key={key} className={`modal-link`}>
                    <div className="in">
                      <div className="inner">
                        <div className="add-to-cart-modal-image">
                          <img
                            src={require("../../../Assets/images/panda.png")}
                            alt=""
                            width={"50px"}
                            height={"50px"}
                          />
                        </div>

                        <div className="add-to-cart-modal-description">{item.data.description}</div>

                        <div className="add-to-cart-modal-quantity">
                          <div className="group-info">
                            <button onClick={() => handleRemoveToCart(item)}>-</button>
                            <div>x{item.itemQuantity}</div>
                            <button onClick={() => handleAddToCart(item)}>+</button>
                          </div>
                        </div>
                        <div className="add-to-cart-modal-amount">
                          {item.itemAmountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
                        </div>
                      </div>

                      <div
                        className="add-to-cart-modal-close"
                        onClick={() => removeModalItems(item)}
                      >
                        <span>X</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="modal-empty-cart">Your cart is empty</div>
            )}
          </div>
          <div className="add-to-cart-modal-total-quantity">
            <span>Total: </span>
            <span> {totalPrice.cartTotalQuantity} products</span>
            <span className="add-to-cart-modal-total-amount">
              {totalPrice.cartTotalAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} $
            </span>
          </div>

          <div className="add-to-cart-modal-cart-inner">
            <Link to="/cart/products" className="cart-btn">
              Your Cart
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddToCartModal;
