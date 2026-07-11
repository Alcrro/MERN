import { useState } from "react";
import {
  useListCatalogQuery,
  useDeleteCatalogEntryMutation,
} from "../../../../features/catalog/rtkCatalog";
import { CATALOG_KINDS } from "../../../../utils/constants";
import CatalogEntryModal from "../CatalogEntryModal";
import "./CatalogAdmin.css";

const KIND_LABEL = { Electronics: "Electronice", Clothing: "Îmbrăcăminte", Furniture: "Mobilă", HomeGarden: "Casă", Books: "Cărți" };

const CatalogAdmin = () => {
  const [kind, setKind] = useState("");
  const [page, setPage] = useState(1);
  const [editEntry, setEditEntry] = useState(undefined);

  const { data, isFetching } = useListCatalogQuery({ kind, page, limit: 20 });
  const [deleteEntry] = useDeleteCatalogEntryMutation();

  const results = data?.results ?? [];
  const pages = data?.pages ?? 1;

  const handleDelete = async (id) => {
    if (!window.confirm("Ștergi această intrare din catalog?")) return;
    await deleteEntry(id);
  };

  return (
    <div className="cat-admin">
      <div className="cat-admin__header">
        <h1 className="cat-admin__title">Catalog produse</h1>
        <button type="button" className="cat-admin__add-btn" onClick={() => setEditEntry(null)}>
          + Adaugă
        </button>
      </div>

      <div className="cat-admin__filters">
        <button
          type="button"
          className={`cat-admin__kind-btn${kind === "" ? " cat-admin__kind-btn--active" : ""}`}
          onClick={() => { setKind(""); setPage(1); }}
        >
          Toate
        </button>
        {CATALOG_KINDS.map((k) => (
          <button
            key={k}
            type="button"
            className={`cat-admin__kind-btn${kind === k ? " cat-admin__kind-btn--active" : ""}`}
            onClick={() => { setKind(k); setPage(1); }}
          >
            {KIND_LABEL[k] || k}
          </button>
        ))}
      </div>

      {isFetching ? (
        <p className="cat-admin__loading">Se încarcă…</p>
      ) : (
        <div className="cat-admin__table-wrap">
          <table className="cat-admin__table">
            <thead>
              <tr>
                <th>Categorie</th>
                <th>Brand</th>
                <th>Model / Nume</th>
                <th>Detaliu</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {results.length === 0 && (
                <tr><td colSpan={5} className="cat-admin__empty">Nicio intrare.</td></tr>
              )}
              {results.map((entry) => (
                <tr key={entry._id}>
                  <td><span className="cat-admin__badge">{KIND_LABEL[entry.kind] || entry.kind}</span></td>
                  <td className="cat-admin__brand">{entry.brand}</td>
                  <td>{entry.specs?.model || entry.specs?.name || "—"}</td>
                  <td className="cat-admin__detail">{entry.specs?.stocare || entry.specs?.material || "—"}</td>
                  <td className="cat-admin__actions">
                    <button type="button" className="cat-admin__action cat-admin__action--edit" onClick={() => setEditEntry(entry)}>Edit</button>
                    <button type="button" className="cat-admin__action cat-admin__action--del" onClick={() => handleDelete(entry._id)}>Șterge</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="cat-admin__pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Înapoi</button>
          <span>{page} / {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Următor ›</button>
        </div>
      )}

      {editEntry !== undefined && (
        <CatalogEntryModal entry={editEntry} onClose={() => setEditEntry(undefined)} />
      )}
    </div>
  );
};

export default CatalogAdmin;
