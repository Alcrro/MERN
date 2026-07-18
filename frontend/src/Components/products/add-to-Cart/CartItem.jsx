import { useDispatch } from "react-redux";
import { addToCart, removeFromCart, removeSingleCart, setCartItemRate } from "../../../features/product/addToCart/addToCartSlice";
import { TrashIcon, MinusIcon, PlusIcon } from "./cartIcons";
import { fmt } from "./cartUtils";
import panda from "../../../Assets/images/panda.png";

const MIN_RATE_PRICE = 200;

const CartItem = ({ item, idx }) => {
  const dispatch = useDispatch();
  const p     = item.data;
  const brand = p.brand || null;
  const name  = p.model || p.name || p.description?.slice(0, 40) || "Produs";
  const price = p.price ?? p.minPrice ?? 0;
  const atMax = item.itemQuantity >= (p.stock?.quantity ?? Infinity);
  const num   = String(idx + 1).padStart(2, "0");
  const img   = p._variantImages?.[0] ?? p.images?.[0] ?? panda;
  const attrEntries = Object.entries(p._variantAttrs ?? {}).filter(([, v]) => v);
  const canRate  = price >= MIN_RATE_PRICE;
  const inRate   = !!p._selectedRate;

  const inc        = () => { if (!atMax) dispatch(addToCart(item)); };
  const dec        = () => dispatch(removeSingleCart(item));
  const del        = () => dispatch(removeFromCart(item));
  const toggleRate = () => dispatch(setCartItemRate({ productId: p._id, rate: inRate ? null : true }));

  return (
    <div className="ct-item">
      <span className="ct-item__idx" aria-hidden>{num}</span>
      <div className="ct-item__img-wrap">
        <img src={img} alt={name} className="ct-item__img" />
      </div>
      <div className="ct-item__info">
        {brand && <span className="ct-item__brand">{brand}</span>}
        <p className="ct-item__name">{name}</p>
        {attrEntries.length > 0 && (
          <div className="ct-item__specs">
            {attrEntries.map(([k, v]) => <span key={k}>{v}</span>)}
          </div>
        )}
        <span className="ct-item__unit">{fmt(price)} RON / buc.</span>

        {canRate && (
          <div className="ct-item__rate-row">
            <span className={`ct-item__rate${inRate ? "" : " ct-item__rate--none"}`}>
              {inRate ? "Plătesc în rate" : "Plătesc integral"}
            </span>
            <button type="button" className="ct-item__rate-edit" onClick={toggleRate}>
              {inRate ? "Schimbă în integral" : "Plătesc în rate"}
            </button>
          </div>
        )}
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
