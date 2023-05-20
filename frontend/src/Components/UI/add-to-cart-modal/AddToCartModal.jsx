import React from "react";
import "./addToCartModal.css";
import { useSelector } from "react-redux";
import AddToCartV2Button from "../add-to-cart-v2-button/AddToCartV2Button";

const AddToCartModal = () => {
  const cart = useSelector((state) => state.addToCart);
  console.log(cart.card);
  return (
    <div className="connector">
      <div className="add-to-cart-modal-container">
        <div className="add-to-cart-modal-inner">
          <div className="add-to-cart-modal-title">LIST ITEMS:</div>
          <div className="add-to-cart-modal-body">
            {cart?.card.map((item, key) => {
              return (
                <div key={key} className="in">
                  <img
                    src={require("../../../Assets/images/panda.png")}
                    alt=""
                    width={"50px"}
                    height={"50px"}
                  />
                  <div className="add-to-cart-modal-description">{item.data.description}</div>
                  <div className="add-to-cart-modal-quantity">x{item.itemQuantity}</div>
                  <div className="add-to-cart-modal-amount">{item.itemAmountPrice} $</div>
                  <div className="add-to-cart-modal-close">X</div>
                </div>
              );
            })}
          </div>
          <div className="add-to-cart-modal-total-quantity">
            <span>Total: </span>
            <span> {cart?.card.length} products</span>
            <span className="add-to-cart-modal-total-amount">20000 $</span>
          </div>

          <div className="add-to-cart-modal-cart-button">
            <AddToCartV2Button />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddToCartModal;
