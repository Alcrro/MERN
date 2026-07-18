import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import CartVoucherBox from "../../molecules/CartVoucherBox";
import CartAlcrroBox from "../../molecules/CartAlcrroBox";
import { ArrowRight, LockIcon, TruckIcon, ReturnIcon } from "./cartIcons";
import { fmt, SHIP_THRESHOLD } from "./cartUtils";

const POINTS_TO_RON = 10;

const toCartItems = (card) =>
  card.map((item) => ({
    productId: item.data._id,
    vendorId:  item.data.vendor?._id ?? item.data.vendor ?? null,
    price:     item.data.price ?? item.data.minPrice ?? 0,
    quantity:  item.itemQuantity,
  }));

const calcVoucherDiscount = (voucher, cartItems, subtotal) => {
  if (!voucher) return 0;
  if (voucher.scope === "vendor" && voucher.eligibleProductIds?.length) {
    const ids = new Set(voucher.eligibleProductIds.map(String));
    const eligibleSubtotal = cartItems
      .filter((i) => ids.has(String(i.productId)))
      .reduce((s, i) => s + i.price * i.quantity, 0);
    return voucher.type === "percent"
      ? Math.round(eligibleSubtotal * voucher.value) / 100
      : Math.min(voucher.value, eligibleSubtotal);
  }
  return voucher.type === "percent"
    ? Math.round(subtotal * voucher.value) / 100
    : voucher.value;
};

const CartSummary = ({ cart }) => {
  const total    = cart.cartTotalAmount;
  const shipping = total >= SHIP_THRESHOLD ? 0 : 15;

  const { voucher, useCredits, usePoints } = useSelector((s) => s.discount);
  const { data: cardData } = useGetMyCardQuery();
  const card = cardData?.data;

  const cartItems       = toCartItems(cart.card);
  const voucherDiscount = calcVoucherDiscount(voucher, cartItems, total);
  const creditsDiscount = useCredits ? Math.min(card?.credits ?? 0, total + shipping - voucherDiscount) : 0;
  const pointsDiscount  = usePoints  ? Math.min((card?.points ?? 0) / POINTS_TO_RON, total + shipping - voucherDiscount - creditsDiscount) : 0;
  const finalTotal      = Math.max(0, total + shipping - voucherDiscount - creditsDiscount - pointsDiscount);
  const hasDiscount     = voucherDiscount > 0 || creditsDiscount > 0 || pointsDiscount > 0;

  return (
    <aside className="ct-summary">
      <div className="ct-receipt">
        <div className="ct-receipt__head">
          <span className="ct-receipt__label">Sumar comandă</span>
          <span className="ct-receipt__badge">
            {cart.cartTotalQuantity} {cart.cartTotalQuantity === 1 ? "produs" : "produse"}
          </span>
        </div>

        <div className="ct-receipt__lines">
          <div className="ct-receipt__row">
            <span>Produse</span>
            <span>{fmt(total)} RON</span>
          </div>
          <div className="ct-receipt__row">
            <span>Livrare</span>
            {shipping === 0
              ? <span className="ct-receipt__free">Gratuită</span>
              : <span className="ct-receipt__ship-cost">~{shipping} RON</span>}
          </div>
        </div>

        <CartVoucherBox orderTotal={total} cartItems={cartItems} />
        <CartAlcrroBox orderTotal={total + shipping} />

        {hasDiscount && (
          <div className="ct-receipt__lines ct-receipt__discounts">
            {voucherDiscount > 0 && (
              <div className="ct-receipt__row ct-receipt__row--discount">
                <span>Voucher ({voucher.code}){voucher.scope === "vendor" ? " ·vendor" : ""}</span>
                <span>-{fmt(voucherDiscount)} RON</span>
              </div>
            )}
            {creditsDiscount > 0 && (
              <div className="ct-receipt__row ct-receipt__row--discount">
                <span>Credite AlcrroCard</span>
                <span>-{fmt(creditsDiscount)} RON</span>
              </div>
            )}
            {pointsDiscount > 0 && (
              <div className="ct-receipt__row ct-receipt__row--discount">
                <span>Puncte AlcrroCard</span>
                <span>-{fmt(pointsDiscount)} RON</span>
              </div>
            )}
          </div>
        )}

        <div className="ct-receipt__total">
          <span>Total</span>
          <span className="ct-receipt__total-val">{fmt(finalTotal)} RON</span>
        </div>
      </div>

      <Link to="/cart/checkout" className="ct-cta">
        Continuă <ArrowRight />
      </Link>

      <div className="ct-trust">
        <span><LockIcon /> Plată securizată</span>
        <span>•</span>
        <span><TruckIcon /> Livrare 1–2 zile</span>
        <span>•</span>
        <span><ReturnIcon /> Retur 30 zile</span>
      </div>
    </aside>
  );
};

export default CartSummary;
