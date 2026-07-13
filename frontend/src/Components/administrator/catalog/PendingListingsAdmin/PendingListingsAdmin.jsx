import { useState } from "react";
import {
  useGetAdminPendingListingsQuery,
  useApproveListingMutation,
} from "../../../../features/admin/rtkAdmin";
import "./PendingListingsAdmin.css";

const PendingListingRowSkeleton = () => (
  <tr className="pend-listings__skel-row">
    <td><div className="skel pend-listings__skel-cell pend-listings__skel-cell--name" /></td>
    <td>
      <div className="skel pend-listings__skel-cell pend-listings__skel-cell--vendor" />
      <div className="skel pend-listings__skel-cell pend-listings__skel-cell--email" style={{ marginTop: "0.3rem" }} />
    </td>
    <td><div className="skel pend-listings__skel-cell pend-listings__skel-cell--price" /></td>
    <td><div className="skel pend-listings__skel-cell pend-listings__skel-cell--date" /></td>
    <td><div className="skel pend-listings__skel-cell pend-listings__skel-cell--badge" /></td>
    <td>
      <div className="pend-listings__skel-btns">
        <div className="skel pend-listings__skel-cell pend-listings__skel-cell--btn" />
        <div className="skel pend-listings__skel-cell pend-listings__skel-cell--btn" />
      </div>
    </td>
  </tr>
);

const PendingListingsAdmin = () => {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetAdminPendingListingsQuery({ page, limit: 20 });
  const [approveListing, { isLoading }] = useApproveListingMutation();

  const products = data?.products ?? [];
  const pages = data?.numberOfPages ?? 1;
  const count = data?.count ?? 0;

  const handle = async (id, action) => {
    if (action === "reject" && !window.confirm("Respingi acest produs?")) return;
    await approveListing({ id, action });
  };

  return (
    <div className="pend-listings">
      <div className="pend-listings__header">
        <h2 className="pend-listings__title">
          Produse în verificare
          {count > 0 && <span className="pend-listings__count">{count}</span>}
        </h2>
      </div>

      {isFetching ? (
        <div className="pend-listings__table-wrap">
          <table className="pend-listings__table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Vânzător</th>
                <th>Preț</th>
                <th>Adăugat</th>
                <th>Verificare</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2].map((i) => <PendingListingRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      ) : products.length === 0 ? (
        <p className="pend-listings__empty">Niciun produs în așteptare.</p>
      ) : (
        <div className="pend-listings__table-wrap">
          <table className="pend-listings__table">
            <thead>
              <tr>
                <th>Produs</th>
                <th>Vânzător</th>
                <th>Preț</th>
                <th>Adăugat</th>
                <th>Verificare</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="pend-listings__name">{p.name}</td>
                  <td className="pend-listings__vendor">
                    <span>{p.vendor?.shopName || p.vendor?.name || "—"}</span>
                    <span className="pend-listings__vendor-email">{p.vendor?.email}</span>
                  </td>
                  <td className="pend-listings__price">
                    {p.price != null ? `${p.price.toLocaleString("ro-RO")} RON` : "—"}
                  </td>
                  <td className="pend-listings__date">
                    {new Date(p.createdAt).toLocaleDateString("ro-RO")}
                  </td>
                  <td>
                    {p.hasDuplicate ? (
                      <span className="pend-listings__dup-warn">⚠ Duplicat publicat</span>
                    ) : p.catalogRef ? (
                      <span className="pend-listings__dup-ok">✓ Unic</span>
                    ) : (
                      <span className="pend-listings__dup-none">Fără ref catalog</span>
                    )}
                  </td>
                  <td className="pend-listings__actions">
                    <button
                      type="button"
                      className="pend-listings__btn pend-listings__btn--approve"
                      disabled={isLoading}
                      onClick={() => handle(p._id, "approve")}
                    >
                      Aprobă
                    </button>
                    <button
                      type="button"
                      className="pend-listings__btn pend-listings__btn--reject"
                      disabled={isLoading}
                      onClick={() => handle(p._id, "reject")}
                    >
                      Respinge
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pages > 1 && (
        <div className="pend-listings__pagination">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹ Înapoi</button>
          <span>{page} / {pages}</span>
          <button type="button" disabled={page >= pages} onClick={() => setPage((p) => p + 1)}>Următor ›</button>
        </div>
      )}
    </div>
  );
};

export default PendingListingsAdmin;
