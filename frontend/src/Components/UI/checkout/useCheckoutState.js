import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreateOrderMutation } from "../../../features/order/rtkOrders";
import { clearCart } from "../../../features/product/addToCart/addToCartSlice";

const useCheckoutState = (cartItems) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [deliveryMethod, setDeliveryMethod] = useState("courier");
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [billing, setBilling] = useState({ firstName: "", lastName: "", phone: "" });
  const [paymentMethod, setPaymentMethod] = useState("");
  const hasRatesInCart = cartItems.some((i) => i.data?._selectedRate);
  const [paymentPath, setPaymentPathRaw] = useState(hasRatesInCart ? "installments" : "full");
  const [installmentPlan, setInstallmentPlan] = useState(null);
  const [savedPaymentMethodId, setSavedPaymentMethodId] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [pendingPayment, setPendingPayment] = useState(null);
  const [createOrder, { isLoading: isSubmitting, error: orderError }] = useCreateOrderMutation();

  const updateBilling = (patch) => setBilling((prev) => ({ ...prev, ...patch }));

  const setPaymentPath = (path) => {
    setPaymentPathRaw(path);
    if (path === "full") {
      setInstallmentPlan(null);
    } else {
      setPaymentMethod("Card");
    }
  };

  const handleSubmit = async () => {
    const items = cartItems.map(({ data, itemQuantity }) => ({
      product: data._id,
      quantity: itemQuantity,
    }));

    const effectivePaymentMethod = paymentPath === "installments" ? "Card" : paymentMethod;
    const body = {
      items,
      paymentMethod: effectivePaymentMethod,
      billingDetails: billing,
      ...(deliveryMethod === "courier" && selectedAddressId ? { addressId: selectedAddressId } : {}),
    };
    if (savedPaymentMethodId && effectivePaymentMethod === "Card") {
      body.savedPaymentMethodId = savedPaymentMethodId;
    }
    if (paymentPath === "installments" && installmentPlan?.bank && installmentPlan?.months) {
      const total = cartItems.reduce((s, i) => s + i.itemAmountPrice, 0);
      body.installmentPlan = {
        ...installmentPlan,
        monthlyAmount: parseFloat((total / installmentPlan.months).toFixed(2)),
      };
    }

    const result = await createOrder(body);
    if (!result.data) return;

    if (result.data.clientSecret) {
      // Card — coșul se golește în OrderDetail după confirmare plată
      setPendingPayment({ clientSecret: result.data.clientSecret, order: result.data.order });
    } else {
      dispatch(clearCart());
      setOrderSuccess(result.data.order);
    }
  };

  return {
    step, setStep,
    deliveryMethod, setDeliveryMethod,
    selectedAddressId, setSelectedAddressId,
    billing, updateBilling,
    paymentMethod, setPaymentMethod,
    paymentPath, setPaymentPath,
    installmentPlan, setInstallmentPlan,
    savedPaymentMethodId, setSavedPaymentMethodId,
    orderSuccess,
    pendingPayment,
    isSubmitting,
    orderError,
    handleSubmit,
  };
};

export default useCheckoutState;
