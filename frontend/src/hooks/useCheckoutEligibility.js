import { useSelector } from "react-redux";
import { selectCartIsInstallmentEligible } from "../features/product/addToCart/addToCartSlice";

const useCheckoutEligibility = () => {
  const isInstallmentEligible = useSelector(selectCartIsInstallmentEligible);
  return { isInstallmentEligible };
};

export default useCheckoutEligibility;
