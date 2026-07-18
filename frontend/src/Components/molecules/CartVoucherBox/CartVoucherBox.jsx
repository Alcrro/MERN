import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useValidateVoucherMutation } from "../../../features/voucher/rtkVoucher";
import { setVoucher, clearVoucher } from "../../../features/discount/discountSlice";
import "./CartVoucherBox.css";

const TagIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

// cartItems: cart.card mapped to { productId, vendorId, price, quantity }
const CartVoucherBox = ({ orderTotal, cartItems = [] }) => {
  const dispatch = useDispatch();
  const applied  = useSelector((s) => s.discount.voucher);
  const [code, setCode]   = useState("");
  const [error, setError] = useState(null);
  const [validate, { isLoading }] = useValidateVoucherMutation();

  const handleApply = async () => {
    if (!code.trim()) return;
    setError(null);
    const res = await validate({ code: code.trim(), orderTotal, cartItems });
    if (res.data?.valid) {
      dispatch(setVoucher(res.data));
      setCode("");
    } else {
      setError(res.data?.message ?? "Cod invalid");
    }
  };

  const handleRemove = () => {
    dispatch(clearVoucher());
    setError(null);
  };

  const isVendorScope = applied?.scope === "vendor";

  return (
    <div className="cvb">
      <div className="cvb__head">
        <TagIcon />
        <span className="cvb__title">Cod voucher</span>
        {applied && <span className="cvb__ok-badge">{applied.description}</span>}
      </div>

      {applied ? (
        <div className="cvb__applied">
          <span className="cvb__applied-code">{applied.code}</span>
          {isVendorScope && (
            <span className="cvb__applied-scope">
              {applied.eligibleProductIds.length} {applied.eligibleProductIds.length === 1 ? "produs" : "produse"} eligibile
            </span>
          )}
          <button type="button" className="cvb__remove" onClick={handleRemove}>Elimină</button>
        </div>
      ) : (
        <div className="cvb__row">
          <input
            className="cvb__input"
            placeholder="Cod promoțional"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && handleApply()}
          />
          <button
            className="cvb__btn"
            onClick={handleApply}
            disabled={isLoading || !code.trim()}
          >
            {isLoading ? "..." : "Aplică"}
          </button>
        </div>
      )}

      {error && <p className="cvb__error">{error}</p>}
    </div>
  );
};

export default CartVoucherBox;
