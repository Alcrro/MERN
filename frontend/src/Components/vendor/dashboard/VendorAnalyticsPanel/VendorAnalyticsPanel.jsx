import { useGetVendorAnalyticsQuery } from "../../../../features/vendor/rtkVendor";
import StatCard from "../../shared/StatCard";
import "./VendorAnalyticsPanel.css";

const VendorAnalyticsPanel = () => {
  const { data, isLoading } = useGetVendorAnalyticsQuery();

  if (isLoading) return <p className="vap__loading">Se încarcă…</p>;

  const s = data || {};

  return (
    <div className="vap">
      <h1 className="vap__title">Analytics</h1>

      <section className="vap__section">
        <p className="vap__label">Status listări</p>
        <div className="vap__row">
          <StatCard label="Total listări"   value={s.totalListings ?? 0} />
          <StatCard label="Aprobate"        value={s.approvedListings ?? 0} sub="live în catalog" />
          <StatCard label="În așteptare"    value={s.pendingListings ?? 0} />
          <StatCard label="Respinse"        value={s.rejectedListings ?? 0} />
        </div>
      </section>

      <section className="vap__section">
        <p className="vap__label">Vânzări</p>
        <div className="vap__row">
          <StatCard label="Unități vândute"  value={s.totalUnitsSold ?? 0} />
          <StatCard label="Venit estimat"    value={s.estimatedRevenue ? `${s.estimatedRevenue.toLocaleString("ro")} RON` : "0 RON"} />
        </div>
      </section>
    </div>
  );
};

export default VendorAnalyticsPanel;
