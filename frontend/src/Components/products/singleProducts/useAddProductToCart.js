import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";

export const useAddProductToCart = (product) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleCart = (variant) => {
    if (!product) return;
    const data = variant?.price != null ? { ...product, price: variant.price } : product;
    dispatch(addToCart({ data }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return { added, handleCart };
};
