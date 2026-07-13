import StockInput from "../../shared/StockInput";
import "./VariantBuilder.css";

const EMPTY_STOCK = { quantity: 0, availability: "In Stoc" };
const EMPTY_VARIANT = () => ({ attributes: {}, price: 0, stock: EMPTY_STOCK, images: [] });

const VariantBuilder = ({ variants, onChange }) => {
  const update = (idx, patch) =>
    onChange(variants.map((v, i) => (i === idx ? { ...v, ...patch } : v)));

  const addVariant = () => onChange([...variants, EMPTY_VARIANT()]);

  const removeVariant = (idx) => onChange(variants.filter((_, i) => i !== idx));

  const setAttr = (idx, newKey, newVal, oldKey) => {
    const entries = Object.entries(variants[idx].attributes ?? {});
    const updated = entries.map(([k, v]) =>
      k === oldKey ? [newKey, newVal] : [k, v === undefined ? v : v]
    );
    update(idx, { attributes: Object.fromEntries(updated) });
  };

  const setAttrVal = (idx, key, val) => {
    update(idx, { attributes: { ...variants[idx].attributes, [key]: val } });
  };

  const addAttr = (idx) => {
    const attrs = { ...(variants[idx].attributes ?? {}), "": "" };
    update(idx, { attributes: attrs });
  };

  const removeAttr = (idx, key) => {
    const { [key]: _, ...rest } = variants[idx].attributes ?? {};
    update(idx, { attributes: rest });
  };

  return (
    <div className="vb">
      <div className="vb__header">
        <span className="vb__title">Variante ({variants.length})</span>
        <button type="button" className="vb__add-btn" onClick={addVariant}>+ Adaugă variantă</button>
      </div>

      {variants.map((v, idx) => {
        const attrEntries = Object.entries(v.attributes ?? {});
        return (
          <div key={idx} className="vb__card">
            <div className="vb__card-head">
              <span className="vb__card-title">Variantă {idx + 1}</span>
              {variants.length > 1 && (
                <button type="button" className="vb__del" onClick={() => removeVariant(idx)}>✕ Șterge</button>
              )}
            </div>

            <div className="vb__attrs">
              {attrEntries.map(([k, val], ai) => (
                <div key={ai} className="vb__attr-row">
                  <input
                    className="vf-input vb__attr-key"
                    placeholder="Atribut (ex: Culoare)"
                    value={k}
                    onChange={(e) => setAttr(idx, e.target.value, val, k)}
                  />
                  <input
                    className="vf-input vb__attr-val"
                    placeholder="Valoare (ex: Negru)"
                    value={val}
                    onChange={(e) => setAttrVal(idx, k, e.target.value)}
                  />
                  <button type="button" className="vb__rm-attr" onClick={() => removeAttr(idx, k)} aria-label="Șterge atribut">✕</button>
                </div>
              ))}
              <button type="button" className="vb__add-attr" onClick={() => addAttr(idx)}>+ Atribut</button>
            </div>

            <div className="vf-field">
              <label className="vf-label">Preț (RON) *</label>
              <input
                type="number" min="0" step="0.01" className="vf-input" required
                value={v.price || ""}
                onChange={(e) => update(idx, { price: Number(e.target.value) })}
              />
            </div>

            <StockInput
              stock={v.stock || EMPTY_STOCK}
              onChange={(s) => update(idx, { stock: s })}
            />
          </div>
        );
      })}
    </div>
  );
};

export default VariantBuilder;
