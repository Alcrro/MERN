import { useState, useEffect } from "react";
import {
  useCreateCatalogEntryMutation,
  useUpdateCatalogEntryMutation,
} from "../../../../features/catalog/rtkCatalog";
import { CATALOG_KINDS, CATALOG_SPEC_FIELDS } from "../../../../utils/constants";
import "./CatalogEntryModal.css";

const CatalogEntryModal = ({ entry, onClose }) => {
  const isEdit = !!entry?._id;
  const [kind, setKind] = useState(entry?.kind || "Electronics");
  const [brand, setBrand] = useState(entry?.brand || "");
  const [specs, setSpecs] = useState(entry?.specs || {});
  const [imagesRaw, setImagesRaw] = useState((entry?.images || []).join("\n"));

  const [create, { isLoading: creating }] = useCreateCatalogEntryMutation();
  const [update, { isLoading: updating }] = useUpdateCatalogEntryMutation();
  const isLoading = creating || updating;

  useEffect(() => {
    if (!entry) return;
    setKind(entry.kind || "Electronics");
    setBrand(entry.brand || "");
    setSpecs(entry.specs || {});
    setImagesRaw((entry.images || []).join("\n"));
  }, [entry]);

  const handleKindChange = (k) => { setKind(k); setSpecs({}); };

  const handleSpec = (field, val) =>
    setSpecs((prev) => ({ ...prev, [field]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const images = imagesRaw.split("\n").map((s) => s.trim()).filter(Boolean);
    const body = { kind, brand: brand.trim(), specs, images };
    const res = isEdit ? await update({ id: entry._id, ...body }) : await create(body);
    if (!res.error) onClose();
  };

  const fields = CATALOG_SPEC_FIELDS[kind] || [];

  return (
    <div className="cem-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cem">
        <div className="cem__header">
          <h2 className="cem__title">{isEdit ? "Editează intrare" : "Adaugă în catalog"}</h2>
          <button type="button" className="cem__close" onClick={onClose} aria-label="Închide">×</button>
        </div>

        <form className="cem__form" onSubmit={handleSubmit}>
          <div className="cem__row">
            <div className="vf-field">
              <label className="vf-label">Categorie</label>
              <select className="vf-input" value={kind} onChange={(e) => handleKindChange(e.target.value)}>
                {CATALOG_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div className="vf-field">
              <label className="vf-label">Brand *</label>
              <input className="vf-input" required value={brand} onChange={(e) => setBrand(e.target.value)} />
            </div>
          </div>

          <p className="cem__section-label">Specificații</p>
          <div className="cem__specs-grid">
            {fields.map((f) => (
              <div className="vf-field" key={f}>
                <label className="vf-label">{f}</label>
                <input
                  className="vf-input"
                  value={specs[f] || ""}
                  onChange={(e) => handleSpec(f, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="vf-field">
            <label className="vf-label">Imagini (URL-uri, unul pe linie)</label>
            <textarea
              className="vf-input vf-input--textarea"
              rows={3}
              value={imagesRaw}
              onChange={(e) => setImagesRaw(e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="cem__actions">
            <button type="button" className="cem__btn cem__btn--cancel" onClick={onClose}>Anulează</button>
            <button type="submit" className="cem__btn cem__btn--save" disabled={isLoading}>
              {isLoading ? "Se salvează…" : isEdit ? "Salvează" : "Adaugă"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CatalogEntryModal;
