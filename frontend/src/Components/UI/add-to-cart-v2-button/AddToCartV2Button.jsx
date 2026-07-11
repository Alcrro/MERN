import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";
import "./addToCartV2button.css";

const AddToCartV2Button = ({ data }) => {
  const dispatch = useDispatch();
  return (
    <div className="add-to-cart-v2-button-inner">
      <button
        type="button"
        className="btn add-to-cart-v2-button"
        onClick={() => dispatch(addToCart({ data }))}
      >
        Adaugă în coș
      </button>
    </div>
  );
};

export default AddToCartV2Button;
