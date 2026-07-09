import { useSelector } from "react-redux";
import "./addToCart.css";
import Steps from "./Steps";
import ShipBar from "./ShipBar";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const AddToCart = () => {
  const cart = useSelector((s) => s.addToCart);

  if (cart.card.length === 0) return <EmptyCart />;

  return (
    <div className="ct-page">
      <Steps />
      <div className="ct-head">
        <h1 className="ct-head__title">Coșul meu</h1>
        <span className="ct-head__count">
          {cart.card.length} {cart.card.length === 1 ? "produs" : "produse"}
        </span>
      </div>
      <div className="ct-layout">
        <div className="ct-left">
          <div className="ct-items">
            {cart.card.map((item, idx) => (
              <CartItem key={item.data._id} item={item} idx={idx} />
            ))}
          </div>
          <ShipBar total={cart.cartTotalAmount} />
        </div>
        <CartSummary cart={cart} />
      </div>
    </div>
  );
};

export default AddToCart;
