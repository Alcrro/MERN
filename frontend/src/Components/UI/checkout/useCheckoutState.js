import { useState } from "react";
import { useDispatch } from "react-redux";
import { useCreateOrderMutation } from "../../../features/order/rtkOrders";
import { clearCart } from "../../../features/product/addToCart/addToCartSlice";

const useCheckoutState = (cartItems) => {
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [createOrder, { isLoading: isSubmitting, error: orderError }] = useCreateOrderMutation();

  const handleSubmit = async () => {
    const items = cartItems.map(({ data, itemQuantity }) => ({
      product: data._id,
      quantity: itemQuantity,
    }));
    const result = await createOrder({ items, addressId: selectedAddressId, paymentMethod });
    if (result.data) {
      dispatch(clearCart());
      setOrderSuccess(result.data.order);
    }
  };

  return {
    step, setStep,
    selectedAddressId, setSelectedAddressId,
    paymentMethod, setPaymentMethod,
    orderSuccess,
    isSubmitting,
    orderError,
    handleSubmit,
  };
};

export default useCheckoutState;
