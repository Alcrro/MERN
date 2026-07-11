import { useNavigate } from "react-router-dom";
import CategoryPicker from "../../shared/CategoryPicker";
import CatalogSearch from "../../catalog/CatalogSearch";
import ImageUploader from "../../shared/ImageUploader";
import StockInput from "../../shared/StockInput";
import CategoryFields from "./CategoryFields";
import useVendorProductForm from "./useVendorProductForm";
import "./VendorProductForm.css";

const VendorProductForm = ({ isEdit }) => {
  const navigate = useNavigate();
  const {
    kind, form, stock, images, catFields, warned,
    isLoading, error,
    setStock, setImages, setCatFields,
    handleChange, handleKindChange, handleCatalogSelect, handleSubmit,
  } = useVendorProductForm(isEdit);

  return (
    <form className="vpf" onSubmit={handleSubmit}>
      <h1 className="vpf__title">{isEdit ? "Editează produsul" : "Adaugă produs nou"}</h1>

      {warned && (
        <div className="vpf__warn">
          Produsul va reveni la starea <strong>În așteptare</strong> după editare și necesită reaprobarea adminului.
          <button type="submit" className="vpf__warn-confirm">Continuă oricum</button>
        </div>
      )}

      {error && <p className="vpf__error">{error.data?.message || "A apărut o eroare."}</p>}

      <CategoryPicker value={kind} onChange={handleKindChange} />
      <CatalogSearch kind={kind} onSelect={handleCatalogSelect} />

      <div className="vpf__row">
        <div className="vf-field">
          <label className="vf-label" htmlFor="brand">Brand / Producător *</label>
          <input id="brand" className="vf-input" required value={form.brand} onChange={handleChange("brand")} />
        </div>
        <div className="vf-field">
          <label className="vf-label" htmlFor="price">Preț (RON) *</label>
          <input id="price" type="number" min="0" step="0.01" className="vf-input" required value={form.price} onChange={handleChange("price")} />
        </div>
      </div>

      <div className="vf-field">
        <label className="vf-label" htmlFor="desc">Descriere</label>
        <textarea id="desc" className="vf-input vf-input--textarea" rows={3} value={form.description} onChange={handleChange("description")} />
      </div>

      <CategoryFields kind={kind} fields={catFields} onChange={setCatFields} />
      <StockInput stock={stock} onChange={setStock} />
      <ImageUploader images={images} onChange={setImages} />

      <div className="vpf__actions">
        <button type="button" className="vpf__btn vpf__btn--cancel" onClick={() => navigate(-1)}>Anulează</button>
        <button type="submit" className="vpf__btn vpf__btn--submit" disabled={isLoading}>
          {isLoading ? "Se salvează…" : isEdit ? "Salvează modificările" : "Publică produsul"}
        </button>
      </div>
    </form>
  );
};

export default VendorProductForm;
