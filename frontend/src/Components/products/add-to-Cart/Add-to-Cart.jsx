import { useSelector } from "react-redux";
import "./addToCart.css";
import Steps from "./Steps";
import ShipBar from "./ShipBar";
import EmptyCart from "./EmptyCart";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";

const groupByVendor = (card) => {
  const map = {};
  card.forEach((item) => {
    const key  = item.data.vendor?._id?.toString() ?? "direct";
    const name = item.data.vendor?.shopName ?? "AlcRo";
    if (!map[key]) map[key] = { name, items: [] };
    map[key].items.push(item);
  });
  return Object.values(map);
};

const AddToCart = () => {
  const cart   = useSelector((s) => s.addToCart);
  const groups = groupByVendor(cart.card);

  if (cart.card.length === 0) return <EmptyCart />;

  const multiVendor = groups.length > 1;

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
          {groups.map((group) => (
            <div key={group.name} className="ct-vendor-card">
              {multiVendor && (
                <div className="ct-vendor-head">
                  <span className="ct-vendor-head__name">{group.name}</span>
                  <span className="ct-vendor-head__count">
                    {group.items.length} {group.items.length === 1 ? "produs" : "produse"}
                  </span>
                </div>
              )}
              {group.items.map((item, idx) => (
                <CartItem key={item.data._id} item={item} idx={idx} />
              ))}
            </div>
          ))}
          <ShipBar total={cart.cartTotalAmount} />
        </div>
        <CartSummary cart={cart} />
      </div>
    </div>
  );
};

export default AddToCart;
