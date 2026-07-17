import { useState, useEffect, useRef, useMemo } from "react";
import { useGetSellersQuery } from "../../../../features/product/rtkProducts";
import SellerRow from "../SellerRow";
import "./SellerPicker.css";

const getAttrs = (v) => {
  const a = v?.attributes;
  if (!a) return {};
  if (a instanceof Map) return Object.fromEntries(a);
  return a;
};

const sellerHasAttrs = (seller, attrs) => {
  const entries = Object.entries(attrs).filter(([, v]) => v);
  if (!entries.length) return true;
  return seller.variants?.some((v) => {
    const va = getAttrs(v);
    return entries.every(([k, val]) => va[k] === val);
  });
};

const SellerPickerSkeleton = () => (
  <div className="seller-picker__skeleton">
    {[0, 1, 2].map((i) => <div key={i} className="seller-picker__skel-row" />)}
  </div>
);

const SellerPicker = ({ catalogRef, onSellerChange, selectedAttrs = {} }) => {
  const { data, isLoading, isError } = useGetSellersQuery(catalogRef, { skip: !catalogRef });
  const sellers = data?.sellers ?? [];
  const [selected, setSelected] = useState(null);
  const [isOpen, setIsOpen]     = useState(true);
  const autoSelected = useRef(false);

  const filtered = useMemo(() => {
    const hasAttrs = Object.values(selectedAttrs).some(Boolean);
    if (!hasAttrs) return sellers;
    return sellers.filter((s) => sellerHasAttrs(s, selectedAttrs));
  }, [sellers, selectedAttrs]);

  const displayed  = filtered.length > 0 ? filtered : sellers;
  const noMatch    = filtered.length === 0 && sellers.length > 0;
  const isFiltered = filtered.length > 0 && filtered.length < sellers.length;

  useEffect(() => {
    const first = data?.sellers?.[0];
    if (first && !autoSelected.current) {
      autoSelected.current = true;
      setSelected(first);
      onSellerChange?.(first);
    }
  }, [data, onSellerChange]);

  // când filtrarea elimină vânzătorul selectat, auto-selectăm primul din lista filtrată
  useEffect(() => {
    if (!selected || filtered.length === 0) return;
    const stillVisible = filtered.some((s) => s._id === selected._id);
    if (!stillVisible) {
      setSelected(filtered[0]);
      onSellerChange?.(filtered[0]);
    }
  }, [filtered, selected, onSellerChange]);

  const handleSelect = (seller) => {
    setSelected(seller);
    onSellerChange?.(seller);
  };

  if (!catalogRef)         return null;
  if (isLoading)           return <SellerPickerSkeleton />;
  if (isError)             return <p className="seller-picker__error">Eroare la încărcarea vânzătorilor.</p>;
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
          <span className="seller-picker__toggle-count">
            {isFiltered ? `${filtered.length} din ${sellers.length} oferte` : `${sellers.length} oferte`}
          </span>
          {!isOpen && selected && (
            <span className="seller-picker__toggle-summary">
              · {selected.vendor?.shopName ?? "Vânzător"}
              {selected.vendor?.profile?.tipEntitate && (
                <span className="seller-picker__toggle-tip">
                  {selected.vendor.profile.tipEntitate}
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
          {noMatch && (
            <p className="seller-picker__no-match">
              Niciun vânzător nu are exact această configurație — afișăm toate ofertele.
            </p>
          )}
          {displayed.map((s) => (
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
