import { useState, useEffect, useRef } from "react";
import { useGetSellersQuery } from "../../../../features/product/rtkProducts";
import SellerRow from "../SellerRow";
import "./SellerPicker.css";

const SellerPickerSkeleton = () => (
  <div className="seller-picker__skeleton">
    {[0, 1, 2].map((i) => <div key={i} className="seller-picker__skel-row" />)}
  </div>
);

const SellerPicker = ({ catalogRef, onSellerChange }) => {
  const { data, isLoading, isError } = useGetSellersQuery(catalogRef, { skip: !catalogRef });
  const sellers = data?.sellers ?? [];
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen]     = useState(true);
  const autoSelected = useRef(false);

  useEffect(() => {
    const first = data?.sellers?.[0];
    if (first && !autoSelected.current) {
      autoSelected.current = true;
      setSelected(first);
      onSellerChange?.(first);
    }
  }, [data, onSellerChange]);

  const handleSelect = (seller) => {
    setSelected(seller);
    onSellerChange?.(seller);
  };

  if (!catalogRef)  return null;
  if (isLoading)    return <SellerPickerSkeleton />;
  if (isError)      return <p className="seller-picker__error">Eroare la încărcarea vânzătorilor.</p>;
  if (sellers.length === 0) return <p className="seller-picker__empty">Momentan niciun vânzător disponibil.</p>;

  const selPrice = (selected?.minPrice ?? selected?.variants?.[0]?.price)?.toLocaleString("ro-RO");

  return (
    <div className="seller-picker">
      <button
        type="button"
        className={`seller-picker__toggle${isOpen ? " seller-picker__toggle--open" : ""}`}
        onClick={() => setIsOpen(o => !o)}
      >
        <div className="seller-picker__toggle-left">
          <span className="seller-picker__toggle-label">Vânzători</span>
          <span className="seller-picker__toggle-count">{sellers.length} oferte</span>
          {!isOpen && selected && (
            <span className="seller-picker__toggle-summary">
              · {selected.vendor?.shopName ?? "Vânzător"}
              {selected.vendor?.vendorProfile?.tipEntitate && (
                <span className="seller-picker__toggle-tip">
                  {selected.vendor.vendorProfile.tipEntitate}
                </span>
              )}
              <span className="seller-picker__toggle-price">{selPrice} RON</span>
            </span>
          )}
        </div>
        <span className="seller-picker__chevron" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="seller-picker__table">
          {sellers.map((s) => (
            <SellerRow
              key={s._id}
              seller={s}
              selected={selected?._id === s._id}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerPicker;
