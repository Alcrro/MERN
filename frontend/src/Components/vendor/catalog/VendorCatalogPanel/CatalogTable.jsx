import { useState } from "react";
import { useListCatalogQuery } from "../../../../features/catalog/rtkCatalog";
import "./CatalogTable.css";
import useDebounce from "../../../../hooks/useDebounce";
import { COL_HEADERS } from "./catalogCols";
import useCatalogDraft from "./useCatalogDraft";
import CatalogRow from "./CatalogRow";

const SKELETON_COUNT = 8;

const CatalogTable = ({ kind, tip }) => {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [expanded, setExpanded] = useState(new Set());

  const debouncedSearch = useDebounce(search, 300);
  const { data, isFetching } = useListCatalogQuery({
    kind, tip, brand: debouncedSearch || undefined, page, limit: 20,
  });
  const results = data?.results ?? [];
  const pages   = data?.pages   ?? 1;

  const { getDraft, patchVariant, setSizes, publishColor } = useCatalogDraft();

  const toggleRow = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const headers = COL_HEADERS[kind] ?? ["Spec 1", "Spec 2"];

  return (
    <div className="vcp__table-wrap">
      <div className="vcp__table-head">
        <span className="vcp__table-head-title">
          {!isFetching && results.length > 0 ? `${data?.total ?? 0} produse` : "Catalog"}
        </span>
        <div className="vcp__table-search-wrap">
          <span className="vcp__table-search-icon">🔍</span>
          <input type="text" className="vf-input vcp__table-search"
            placeholder="Caută brand sau model…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
      </div>

      {!isFetching && results.length === 0 && (
        <p className="vcp__msg">Niciun produs găsit.</p>
      )}

      <div className="vcp__table-scroll">
        <table className="vcp__table">
          <thead>
            <tr>
              <th className="vcp__th-toggle" />
              <th>Produs</th>
              <th className="vcp__th-spec">{headers[0]}</th>
              <th className="vcp__th-spec">{headers[1]}</th>
            </tr>
          </thead>
          <tbody>
            {isFetching && Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <tr key={i} className="vcp__tr vcp__tr--skeleton">
                <td className="vcp__td-toggle"><span className="vcp__skel vcp__skel--sm" /></td>
                <td>
                  <span className="vcp__skel vcp__skel--brand" />
                  <span className="vcp__skel vcp__skel--model" />
                </td>
                <td className="vcp__td-spec"><span className="vcp__skel vcp__skel--spec" /></td>
                <td className="vcp__td-spec"><span className="vcp__skel vcp__skel--spec" /></td>
              </tr>
            ))}
            {!isFetching && results.map((entry) => (
              <CatalogRow key={entry._id}
                entry={entry}
                isOpen={expanded.has(entry._id)}
                onToggle={() => toggleRow(entry._id)}
                draft={getDraft(entry)}
                onVariant={(color, patch) => patchVariant(entry._id, color, patch)}
                onSizes={(sizes) => setSizes(entry._id, sizes)}
                onPublish={(color) => publishColor(entry, color)}
              />
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="vcp__pager">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Înapoi</button>
          <span>{page} / {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Următor ›</button>
        </div>
      )}
    </div>
  );
};

export default CatalogTable;
