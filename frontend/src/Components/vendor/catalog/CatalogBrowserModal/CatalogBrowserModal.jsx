import { useState, useRef } from "react";
import { useListCatalogQuery } from "../../../../features/catalog/rtkCatalog";
import { CATALOG_KINDS } from "../../../../utils/constants";
import useDebounce from "../../../../hooks/useDebounce";
import "./CatalogBrowserModal.css";

const KIND_LABEL = { Electronics: "Electronice", Clothing: "Îmbrăcăminte", Furniture: "Mobilă", HomeGarden: "Casă", Books: "Cărți" };

const CatalogBrowserModal = ({ kind: initialKind, onSelect, onClose }) => {
  const [kind, setKind] = useState(initialKind || "");
  const [brand, setBrand] = useState("");
  const [page, setPage] = useState(1);
  const debouncedBrand = useDebounce(brand, 300);
  const overlayRef = useRef(null);

  const { data, isFetching } = useListCatalogQuery({ kind, brand: debouncedBrand, page, limit: 24 });
  const results = data?.results ?? [];
  const pages = data?.pages ?? 1;

  const handleKind = (k) => { setKind(k); setPage(1); };
  const handleBrand = (v) => { setBrand(v); setPage(1); };

  return (
    <div className="cbm-overlay" ref={overlayRef} onMouseDown={(e) => e.target === overlayRef.current && onClose()}>
      <div className="cbm">
        <div className="cbm__header">
          <h2 className="cbm__title">Browse catalog</h2>
          <button type="button" className="cbm__close" onClick={onClose} aria-label="Închide">×</button>
        </div>

        <div className="cbm__controls">
          <input
            type="text"
            className="vf-input cbm__search"
            placeholder="Filtrează după brand…"
            value={brand}
            onChange={(e) => handleBrand(e.target.value)}
          />
          <div className="cbm__kinds">
            <button type="button" className={`cbm__kind-btn${kind === "" ? " cbm__kind-btn--active" : ""}`} onClick={() => handleKind("")}>Toate</button>
            {CATALOG_KINDS.map((k) => (
              <button key={k} type="button" className={`cbm__kind-btn${kind === k ? " cbm__kind-btn--active" : ""}`} onClick={() => handleKind(k)}>
                {KIND_LABEL[k] || k}
              </button>
            ))}
          </div>
        </div>

        <div className="cbm__body">
          {isFetching && <p className="cbm__loading">Se încarcă…</p>}
          {!isFetching && results.length === 0 && <p className="cbm__empty">Niciun produs găsit.</p>}
          <div className="cbm__grid">
            {results.map((entry) => (
              <button
                key={entry._id}
                type="button"
                className="cbm__card"
                onClick={() => { onSelect(entry); onClose(); }}
              >
                <span className="cbm__card-kind">{KIND_LABEL[entry.kind] || entry.kind}</span>
                <span className="cbm__card-brand">{entry.brand}</span>
                <span className="cbm__card-model">{entry.specs?.model || entry.specs?.name || "—"}</span>
                {entry.specs?.stocare && <span className="cbm__card-detail">{entry.specs.stocare}</span>}
              </button>
            ))}
          </div>
        </div>

        {pages > 1 && (
          <div className="cbm__pagination">
            <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</button>
            <span>{page} / {pages}</span>
            <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>›</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogBrowserModal;
