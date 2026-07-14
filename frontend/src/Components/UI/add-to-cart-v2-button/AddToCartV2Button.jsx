import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";
import "./addToCartV2button.css";

const BagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AddToCartV2Button = ({ data }) => {
  const dispatch = useDispatch();
  const [added, setAdded] = useState(false);

  const handleClick = () => {
    dispatch(addToCart({ data }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      type="button"
      className={`atc-btn${added ? " atc-btn--added" : ""}`}
      onClick={handleClick}
      disabled={added}
      aria-label={added ? "Adăugat în coș" : "Adaugă în coș"}
    >
      {added ? <CheckIcon /> : <BagIcon />}
      <span>{added ? "Adăugat" : "Adaugă în coș"}</span>
    </button>
  );
};

export default AddToCartV2Button;
