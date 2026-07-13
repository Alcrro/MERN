import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";

export const useAddProductToCart = (product) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleCart = () => {
    if (!product) return;
    dispatch(addToCart({ data: product }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  return { added, handleCart };
};
