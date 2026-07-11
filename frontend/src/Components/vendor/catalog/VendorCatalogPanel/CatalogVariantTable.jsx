import { COLOR_MAP } from "../../../../utils/constants";
import "./CatalogVariantTable.css";

const AVAILABILITY = ["In Stoc", "Nou", "Promotii", "Resigilat", "Precomanda"];

const CatalogVariantTable = ({ entry, draft, onVariant, onPublish }) => (
  <div className="vcp__expand-col vcp__expand-col--full">
    <table className="vcp__variant-table">
      <thead>
        <tr>
          <th>Culoare</th>
          <th>
            Preț (RON)
            {entry.refPrice && <span className="vcp__ref-price">ref. ~{entry.refPrice}</span>}
          </th>
          <th>Cantitate</th>
          <th>Disponibilitate</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {(entry.culoare ?? []).map((color) => {
          const v = draft.variants[color] ?? { price: "", stock: { quantity: 0, availability: "In Stoc" }, publishing: false, published: false, error: null };
          return (
            <tr key={color} className={v.published ? "vcp__vrow--done" : ""}>
              <td>
                <span className="vcp__color-dot" style={{ background: COLOR_MAP[color] ?? "#ccc" }} />
                {color}
              </td>
              <td>
                <input type="number" min="0" step="0.01" className="vf-input vcp__vinput"
                  placeholder={entry.refPrice ? `~${entry.refPrice}` : "0.00"}
                  value={v.price} disabled={v.published}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onVariant(color, { price: e.target.value })}
                />
              </td>
              <td>
                <input type="number" min="0" className="vf-input vcp__vinput"
                  value={v.stock.quantity} disabled={v.published}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onVariant(color, { stock: { ...v.stock, quantity: Number(e.target.value) } })}
                />
              </td>
              <td>
                <select className="vf-input vcp__vinput"
                  value={v.stock.availability} disabled={v.published}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) => onVariant(color, { stock: { ...v.stock, availability: e.target.value } })}>
                  {AVAILABILITY.map((opt) => <option key={opt}>{opt}</option>)}
                </select>
              </td>
              <td>
                {v.published ? (
                  <span className="vcp__vrow-ok">✓ Publicat</span>
                ) : (
                  <button type="button" className="vcp__publish-btn"
                    disabled={v.publishing}
                    onClick={(e) => { e.stopPropagation(); onPublish(color); }}>
                    {v.publishing ? "…" : "Publică"}
                  </button>
                )}
                {v.error && <span className="vcp__row-error">{v.error}</span>}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default CatalogVariantTable;
