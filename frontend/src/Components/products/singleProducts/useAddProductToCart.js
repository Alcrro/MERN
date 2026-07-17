import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";

export const useAddProductToCart = (product) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleCart = (variant, rate) => {
    if (!product) return;
    const price = variant?.price ?? product.price ?? product.minPrice ?? 0;
    const data = {
      ...product,
      price,
      _variantAttrs:  variant?.attributes ?? {},
      _variantImages: variant?.images     ?? [],
      _selectedRate:  rate ?? null,
    };
    dispatch(addToCart({ data }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return { added, handleCart };
};
