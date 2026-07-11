import { useState } from "react";
import { useApplyAsVendorMutation } from "../../../../features/vendor/rtkVendor";
import "./VendorApplyForm.css";

const VendorApplyForm = () => {
  const [form, setForm] = useState({ shopName: "", shopDescription: "" });
  const [apply, { isLoading, isSuccess, error }] = useApplyAsVendorMutation();

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.shopName.trim()) return;
    await apply(form);
  };

  if (isSuccess) {
    return (
      <div className="vapply__success">
        <h2 className="vapply__success-title">Cerere trimisă!</h2>
        <p>Vom reveni cu un răspuns în curând. Vei putea adăuga produse după ce cererea e aprobată.</p>
      </div>
    );
  }

  return (
    <form className="vapply" onSubmit={handleSubmit}>
      <h1 className="vapply__title">Devino vânzător</h1>
      <p className="vapply__sub">Completează informațiile despre magazinul tău pentru a trimite cererea.</p>

      {error && <p className="vapply__error">{error.data?.message || "A apărut o eroare."}</p>}

      <div className="vf-field">
        <label className="vf-label" htmlFor="shopName">Numele magazinului *</label>
        <input id="shopName" className="vf-input" required value={form.shopName} onChange={set("shopName")} placeholder="Ex: TechVendor SRL" />
      </div>

      <div className="vf-field">
        <label className="vf-label" htmlFor="shopDesc">Descriere scurtă</label>
        <textarea id="shopDesc" className="vf-input vf-input--textarea" rows={3} value={form.shopDescription} onChange={set("shopDescription")} placeholder="Ce vinzi, de unde ești, câți ani de activitate…" />
      </div>

      <button type="submit" className="vapply__submit" disabled={isLoading || !form.shopName.trim()}>
        {isLoading ? "Se trimite…" : "Trimite cererea"}
      </button>
    </form>
  );
};

export default VendorApplyForm;
