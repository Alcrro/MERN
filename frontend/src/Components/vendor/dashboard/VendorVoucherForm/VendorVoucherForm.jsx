import { useState } from "react";
import { useGetVendorProductsQuery } from "../../../../features/vendor/rtkVendor";
import { useCreateVoucherMutation } from "../../../../features/voucher/rtkVoucher";
import "./VendorVoucherForm.css";

const EMPTY = { code: "", type: "percent", value: "", minOrder: "", expiresAt: "", productIds: [] };

const VendorVoucherForm = ({ onCreated }) => {
  const [form, setForm]         = useState(EMPTY);
  const [showPicker, setShowPicker] = useState(false);
  const { data: prodData }      = useGetVendorProductsQuery({ limit: 100 });
  const [create, { isLoading, isError }] = useCreateVoucherMutation();
  const products = prodData?.products ?? [];

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleProduct = (id) =>
    set("productIds", form.productIds.includes(id)
      ? form.productIds.filter((p) => p !== id)
      : [...form.productIds, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await create({
      code:       form.code,
      type:       form.type,
      value:      Number(form.value),
      minOrder:   Number(form.minOrder) || 0,
      expiresAt:  form.expiresAt || null,
      productIds: form.productIds,
    });
    if (res.data?.success) {
      setForm(EMPTY);
      setShowPicker(false);
      onCreated?.();
    }
  };

  return (
    <form className="vvf" onSubmit={handleSubmit}>
      <div className="vvf__grid">
        <input className="vvf__input vvf__input--code" placeholder="COD VOUCHER" value={form.code}
          onChange={(e) => set("code", e.target.value.toUpperCase())} required />

        <div className="vvf__type-group">
          {[{ v: "percent", l: "Procent %" }, { v: "fixed", l: "Sumă fixă RON" }].map(({ v, l }) => (
            <label key={v} className={`vvf__type${form.type === v ? " vvf__type--on" : ""}`}>
              <input type="radio" name="vvf-type" value={v} checked={form.type === v}
                onChange={() => set("type", v)} />
              {l}
            </label>
          ))}
        </div>

        <input className="vvf__input" type="number" min="1" max={form.type === "percent" ? 100 : undefined}
          placeholder={form.type === "percent" ? "Valoare %" : "Valoare RON"}
          value={form.value} onChange={(e) => set("value", e.target.value)} required />

        <input className="vvf__input" type="number" min="0" step="0.01"
          placeholder="Comandă minimă RON" value={form.minOrder}
          onChange={(e) => set("minOrder", e.target.value)} />

        <div className="vvf__date-wrap">
          <label className="vvf__date-label">Expiră la</label>
          <input className="vvf__input" type="date" value={form.expiresAt}
            onChange={(e) => set("expiresAt", e.target.value)} />
        </div>
      </div>

      {products.length > 0 && (
        <div className="vvf__picker">
          <button type="button" className="vvf__picker-toggle" onClick={() => setShowPicker((s) => !s)}>
            <span>{form.productIds.length > 0 ? `${form.productIds.length} produse selectate` : "Aplică pe toate produsele mele"}</span>
            <span className="vvf__picker-chevron">{showPicker ? "▲" : "▼"}</span>
          </button>
          {showPicker && (
            <div className="vvf__picker-list">
              {products.map((p) => {
                const label = [p.brand, p.model || p.name].filter(Boolean).join(" ") || "Produs";
                const on    = form.productIds.includes(p._id);
                return (
                  <label key={p._id} className={`vvf__picker-item${on ? " vvf__picker-item--on" : ""}`}>
                    <input type="checkbox" checked={on} onChange={() => toggleProduct(p._id)} />
                    <span>{label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isError && <p className="vvf__error">Eroare la creare. Verifică dacă codul există deja.</p>}

      <button type="submit" className="vvf__submit" disabled={isLoading}>
        {isLoading ? "Se salvează..." : "Creează voucher"}
      </button>
    </form>
  );
};

export default VendorVoucherForm;
