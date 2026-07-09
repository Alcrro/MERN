import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, removeSingleCart } from "../../../features/product/addToCart/addToCartSlice";
import { TrashIcon, MinusIcon, PlusIcon } from "./cartIcons";
import { fmt } from "./cartUtils";
import panda from "../../../Assets/images/panda.png";

const CartItem = ({ item, idx }) => {
  const dispatch = useDispatch();
  const p     = item.data;
  const brand = p.brand || null;
  const name  = p.model || p.name || p.description?.slice(0, 40) || "Produs";
  const atMax = item.itemQuantity >= (p.stock?.quantity ?? Infinity);
  const num   = String(idx + 1).padStart(2, "0");

  const inc = () => { if (!atMax) dispatch(addToCart(item)); };
  const dec = () => dispatch(removeSingleCart(item));
  const del = () => dispatch(removeFromCart(item));

  return (
    <div className="ct-item">
      <span className="ct-item__idx" aria-hidden>{num}</span>
      <div className="ct-item__img-wrap">
        <img src={panda} alt={name} className="ct-item__img" />
      </div>
      <div className="ct-item__info">
        {brand && <span className="ct-item__brand">{brand}</span>}
        <p className="ct-item__name">{name}</p>
        {(p.stocare || p.RAM || p.camera || p.display || p.baterie || p.culoare) && (
          <div className="ct-item__specs">
            {p.stocare && <span>{p.stocare}</span>}
            {p.RAM     && <span>{p.RAM} RAM</span>}
            {p.camera  && <span>{p.camera.split("+")[0].trim()} MP</span>}
            {p.display && <span>{p.display.split(" ")[0]}</span>}
            {p.baterie && <span>{p.baterie}</span>}
            {p.culoare && <span>{p.culoare}</span>}
          </div>
        )}
        <span className="ct-item__unit">{fmt(p.price)} RON / buc.</span>
      </div>
      <div className="ct-item__right">
        <span className="ct-item__total">{fmt(item.itemAmountPrice)} RON</span>
        <div className="ct-stepper">
          <button className="ct-stepper__btn" onClick={dec} aria-label="Scade"><MinusIcon /></button>
          <span className="ct-stepper__qty">{item.itemQuantity}</span>
          <button
            className={`ct-stepper__btn${atMax ? " ct-stepper__btn--off" : ""}`}
            onClick={inc}
            disabled={atMax}
            aria-label="Crește"
          >
            <PlusIcon />
          </button>
        </div>
      </div>
      <button className="ct-item__del" onClick={del} aria-label="Șterge"><TrashIcon /></button>
    </div>
  );
};

export default CartItem;
