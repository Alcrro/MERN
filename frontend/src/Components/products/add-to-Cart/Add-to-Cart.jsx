import React from "react";
import { useSelector } from "react-redux";
import "./addToCart.css";
import AddToCartV2Button from "../../UI/add-to-cart-v2-button/AddToCartV2Button";

const AddToCart = () => {
  const cart = useSelector((state) => state.addToCart);

  return (
    <div className="add-to-cart-container">
      {cart?.card.length > 0 ? (
        <>
          <h2 className="page-title">My Cart</h2>
          <div className="add-to-cart-container-in">
            <div className="add-to-container-body">
              {cart?.card.map((item, key) => {
                return (
                  <div className="add-to-cart-item" key={key}>
                    <div className="add-to-cart-inner">
                      <img
                        src={require("../../../Assets/images/panda.png")}
                        alt=""
                        width={"150px"}
                        height={"150px"}
                      />
                      <div>{item.data.description}</div>

                      <div className="add-to-cart-footer">
                        <div className="add-to-cart-price">{item.itemAmountPrice} $</div>
                        <div className="add-to-cart-quantity">{item.itemQuantity}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="add-to-cart-total-container">
              <h3>Total Amount</h3>
              <div className="add-to-cart-total-cost-product">
                <div className="order-summary-line">
                  <span>Products price:</span>
                  <span>19.1999 $</span>
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
                <span>19.199 $</span>
              </div>
              <AddToCartV2Button />
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
