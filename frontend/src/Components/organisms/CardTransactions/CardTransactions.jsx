import { useState } from "react";
import { useGetCardTransactionsQuery } from "../../../features/shopCard/rtkShopCard";
import "./CardTransactions.css";

const TYPE_LABEL = {
  "credit-purchase":  "Top-up credite",
  "points-earned":    "Puncte câștigate",
  "points-redeemed":  "Puncte convertite",
  "credits-spent":    "Credite cheltuite",
  "referral-bonus":   "Bonus referral",
  "welcome-bonus":    "Bonus bun-venit",
};

const TYPE_ICON = {
  "credit-purchase":  "↑",
  "points-earned":    "★",
  "points-redeemed":  "⇄",
  "credits-spent":    "↓",
  "referral-bonus":   "★",
  "welcome-bonus":    "★",
};

const CardTransactions = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching } = useGetCardTransactionsQuery({ page, limit: 10 });

  if (isLoading) return <div className="card-tx__loading">Se încarcă istoricul…</div>;

  const txs = data?.data ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="card-tx">
      <h2 className="card-tx__title">Istoric tranzacții</h2>

      {txs.length === 0 ? (
        <p className="card-tx__empty">Nu ai nicio tranzacție încă.</p>
      ) : (
        <>
          <div className="card-tx__list">
            {txs.map((tx) => (
              <div key={tx._id} className="card-tx__item">
                <span className={`card-tx__icon card-tx__icon--${tx.type}`} aria-hidden="true">
                  {TYPE_ICON[tx.type] || "•"}
                </span>
                <div className="card-tx__meta">
                  <span className="card-tx__type">{TYPE_LABEL[tx.type] || tx.type}</span>
                  <span className="card-tx__desc">{tx.description}</span>
                </div>
                <span className={`card-tx__amount ${tx.amount > 0 ? "card-tx__amount--pos" : "card-tx__amount--neg"}`}>
                  {tx.amount > 0 ? "+" : ""}{tx.amount}
                </span>
                <span className="card-tx__date">
                  {new Date(tx.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "short" })}
                </span>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="card-tx__pagination">
              <button type="button" onClick={() => setPage((p) => p - 1)} disabled={page === 1 || isFetching} className="card-tx__pg-btn" aria-label="Pagina anterioară">‹</button>
              <span className="card-tx__pg-info" aria-live="polite">{page} / {totalPages}</span>
              <button type="button" onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages || isFetching} className="card-tx__pg-btn" aria-label="Pagina următoare">›</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CardTransactions;
