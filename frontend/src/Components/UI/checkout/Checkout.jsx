import { useSelector } from "react-redux";
import { Navigate, Link } from "react-router-dom";
import useCheckoutState from "./useCheckoutState";
import useCheckoutEligibility from "../../../hooks/useCheckoutEligibility";
import CheckoutSuccess from "./CheckoutSuccess";
import CheckoutStepDetails from "./CheckoutStepDetails";
import CheckoutStepConfirm from "./CheckoutStepConfirm";
import CheckoutPayment from "../../organisms/CheckoutPayment";
import { useGetMyCardQuery } from "../../../features/shopCard/rtkShopCard";
import { fmt } from "../../products/add-to-Cart/cartUtils";
import "./checkout.css";

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

const FREE_SHIPPING = 500;

// Coșul meu lives at /cart (step 0 in progress bar, always done when here)
// step 0 here = Detalii comandă (progress bar index 1)
// step 1 here = Confirmare     (progress bar index 2)
const PROGRESS_LABELS = ["Coșul meu", "Detalii comandă", "Confirmare"];

const canAdvance = (step, cs) => {
  if (step === 0) {
    const hasDelivery = cs.deliveryMethod === "pickup" || !!cs.selectedAddressId;
    const hasBilling  = !!(cs.billing.firstName && cs.billing.lastName && cs.billing.phone);
    if (cs.paymentPath === "installments") {
      return hasDelivery && hasBilling && !!(cs.installmentPlan?.bank && cs.installmentPlan?.months);
    }
    return hasDelivery && hasBilling && !!cs.paymentMethod;
  }
  return false;
};

const Checkout = () => {
  const { user }               = useSelector((s) => s.auth);
  const cart                   = useSelector((s) => s.addToCart);
  const { voucher, useCredits, usePoints } = useSelector((s) => s.discount);
  const cs                     = useCheckoutState(cart.card);
  const { isInstallmentEligible } = useCheckoutEligibility();
  const { data: cardData }     = useGetMyCardQuery();
  const card                   = cardData?.data;

  if (!user) return <Navigate to="/auth/login" />;
  if (cart.card.length === 0 && !cs.orderSuccess && !cs.pendingPayment) return <Navigate to="/cart" />;
  if (cs.orderSuccess) return <CheckoutSuccess order={cs.orderSuccess} />;
  if (cs.pendingPayment) return (
    <div className="ck-page">
      <div className="ck-container">
        <CheckoutPayment
          clientSecret={cs.pendingPayment.clientSecret}
          orderId={cs.pendingPayment.order._id}
          total={cs.pendingPayment.order.totalPrice}
        />
      </div>
    </div>
  );

  const shipping = cart.cartTotalAmount >= FREE_SHIPPING ? 0 : 19.99;

  const cartItems       = toCartItems(cart.card);
  const voucherDiscount = calcVoucherDiscount(voucher, cartItems, cart.cartTotalAmount);
  const creditsDiscount = useCredits ? Math.min(card?.credits ?? 0, cart.cartTotalAmount + shipping - voucherDiscount) : 0;
  const pointsDiscount  = usePoints  ? Math.min((card?.points ?? 0) / POINTS_TO_RON, cart.cartTotalAmount + shipping - voucherDiscount - creditsDiscount) : 0;
  const finalTotal      = Math.max(0, cart.cartTotalAmount + shipping - voucherDiscount - creditsDiscount - pointsDiscount);
  const hasDiscount     = voucherDiscount > 0 || creditsDiscount > 0 || pointsDiscount > 0;

  return (
    <div className="ck-page">
      <div className="ck-progress-wrap">
        <div className="ck-progress">
          {PROGRESS_LABELS.map((label, i) => {
            // i=0 → Coșul meu (always done — we're past /cart)
            // i=1 → Detalii comandă (cs.step 0)
            // i=2 → Confirmare      (cs.step 1)
            const isActive = i === cs.step + 1;
            const isDone   = i === 0 || i < cs.step + 1;
            return (
              <div key={label} className={`ck-progress__step${isActive ? " ck-progress__step--active" : ""}${isDone && !isActive ? " ck-progress__step--done" : ""}`}>
                <span className="ck-progress__dot">{i + 1}</span>
                <span className="ck-progress__label">{label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="ck-layout">
        <div className="ck-container">
          {cs.step === 0 && (
            <CheckoutStepDetails
              delivery={{
                method: cs.deliveryMethod,
                addressId: cs.selectedAddressId,
                onMethodChange: cs.setDeliveryMethod,
                onAddressSelect: cs.setSelectedAddressId,
              }}
              billing={{ ...cs.billing, onChange: cs.updateBilling }}
              payment={{
                path: cs.paymentPath,
                method: cs.paymentMethod,
                plan: cs.installmentPlan,
                savedCardId: cs.savedPaymentMethodId,
                onPathChange: cs.setPaymentPath,
                onMethodChange: cs.setPaymentMethod,
                onPlanChange: cs.setInstallmentPlan,
                onSavedCardChange: cs.setSavedPaymentMethodId,
              }}
              cart={{
                items: cart.card,
                isInstallmentEligible,
                total: cart.cartTotalAmount,
              }}
            />
          )}
          {cs.step === 1 && (
            <CheckoutStepConfirm
              cart={cart}
              isSubmitting={cs.isSubmitting}
              error={cs.orderError}
              onSubmit={cs.handleSubmit}
            />
          )}
        </div>

        <aside className="ck-aside">
          <div className="ck-aside__head">
            <span className="ck-aside__title">Sumar comandă</span>
            <span className="ck-aside__count">{cart.cartTotalQuantity} {cart.cartTotalQuantity === 1 ? "produs" : "produse"}</span>
          </div>

          <div className="ck-aside__totals">
            <div className="ck-aside__row">
              <span>Produse</span>
              <span>{fmt(cart.cartTotalAmount)} RON</span>
            </div>
            <div className="ck-aside__row">
              <span>Livrare</span>
              {shipping === 0
                ? <span className="ck-aside__free">Gratuită</span>
                : <span>{fmt(shipping)} RON</span>}
            </div>
            {hasDiscount && (
              <>
                {voucherDiscount > 0 && (
                  <div className="ck-aside__row ck-aside__row--discount">
                    <span>Voucher ({voucher.code})</span>
                    <span>-{fmt(voucherDiscount)} RON</span>
                  </div>
                )}
                {creditsDiscount > 0 && (
                  <div className="ck-aside__row ck-aside__row--discount">
                    <span>Credite AlcrroCard</span>
                    <span>-{fmt(creditsDiscount)} RON</span>
                  </div>
                )}
                {pointsDiscount > 0 && (
                  <div className="ck-aside__row ck-aside__row--discount">
                    <span>Puncte AlcrroCard</span>
                    <span>-{fmt(pointsDiscount)} RON</span>
                  </div>
                )}
              </>
            )}
            <div className="ck-aside__total">
              <span>Total</span>
              <span>{fmt(finalTotal)} RON</span>
            </div>
          </div>
        </aside>

        <div className="ck-nav">
          {cs.step === 0 && (
            <Link to="/cart" className="ck-btn">← Înapoi la coș</Link>
          )}
          {cs.step > 0 && (
            <button type="button" className="ck-btn" onClick={() => cs.setStep(cs.step - 1)}>
              ← Înapoi
            </button>
          )}
          {cs.step < 1 && (
            <button type="button" className="ck-btn ck-btn--primary"
              disabled={!canAdvance(cs.step, cs)}
              onClick={() => cs.setStep(cs.step + 1)}>
              Continuă →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
