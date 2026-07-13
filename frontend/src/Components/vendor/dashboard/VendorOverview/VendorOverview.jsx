import { useNavigate } from "react-router-dom";
import { useGetVendorAnalyticsQuery } from "../../../../features/vendor/rtkVendor";
import StatCard from "../../shared/StatCard";
import "./VendorOverview.css";

const VoverviewCardSkeleton = () => (
  <div className="voverview__skel-card">
    <div className="skel voverview__skel-label" />
    <div className="skel voverview__skel-value" />
  </div>
);

const VendorOverview = () => {
  const { data, isLoading } = useGetVendorAnalyticsQuery();
  const navigate = useNavigate();

  if (isLoading) return (
    <div className="voverview">
      <div className="voverview__header">
        <div className="skel voverview__skel-title" />
        <div className="skel voverview__skel-cta" />
      </div>
      <section className="voverview__section">
        <div className="skel voverview__skel-section-label" />
        <div className="voverview__cards">
          {[0, 1, 2, 3].map((i) => <VoverviewCardSkeleton key={i} />)}
        </div>
      </section>
      <section className="voverview__section">
        <div className="skel voverview__skel-section-label" />
        <div className="voverview__cards">
          {[0, 1].map((i) => <VoverviewCardSkeleton key={i} />)}
        </div>
      </section>
    </div>
  );

  const stats = data || {};

  return (
    <div className="voverview">
      <div className="voverview__header">
        <h1 className="voverview__title">Prezentare generală</h1>
        <button type="button" className="voverview__cta" onClick={() => navigate("/vendor/dashboard/products/add")}>
          + Adaugă produs
        </button>
      </div>

      <section className="voverview__section">
        <p className="voverview__section-label">Listări</p>
        <div className="voverview__cards">
          <StatCard label="Total" value={stats.totalListings ?? 0} />
          <StatCard label="Aprobate" value={stats.approvedListings ?? 0} />
          <StatCard label="În așteptare" value={stats.pendingListings ?? 0} />
          <StatCard label="Respinse" value={stats.rejectedListings ?? 0} />
        </div>
      </section>

      <section className="voverview__section">
        <p className="voverview__section-label">Vânzări</p>
        <div className="voverview__cards">
          <StatCard label="Unități vândute" value={stats.totalUnitsSold ?? 0} />
          <StatCard label="Venit estimat" value={stats.estimatedRevenue ? `${stats.estimatedRevenue.toLocaleString("ro")} RON` : "0 RON"} />
        </div>
      </section>
    </div>
  );
};

export default VendorOverview;
