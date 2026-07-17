import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetVendorAnalyticsQuery } from "../../../features/vendor/rtkVendor";
import "./SummaryVendorWidget.css";

const SummaryVendorWidget = () => {
  const { user } = useSelector((s) => s.auth);
  const isVendor = user?.role === "vendor";
  const { data, isLoading } = useGetVendorAnalyticsQuery(undefined, { skip: !isVendor });

  if (!isVendor) return null;

  const s = data || {};

  return (
    <div className="sum-vendor">
      <div className="sum-vendor__header">
        <h3 className="sum-vendor__title">Magazinul meu</h3>
        <Link to="/vendor/dashboard" className="sum-vendor__link">Panou vendor</Link>
      </div>

      {isLoading && (
        <div className="sum-vendor__skeletons">
          {[1, 2, 3, 4].map((i) => <div key={i} className="sum-vendor__skel" />)}
        </div>
      )}

      {!isLoading && (
        <div className="sum-vendor__stats">
          <div className="sum-vendor__stat">
            <span className="sum-vendor__val">{s.approvedListings ?? 0}</span>
            <span className="sum-vendor__key">Produse live</span>
          </div>
          <div className="sum-vendor__stat">
            <span className="sum-vendor__val">{s.pendingListings ?? 0}</span>
            <span className="sum-vendor__key">În așteptare</span>
          </div>
          <div className="sum-vendor__stat">
            <span className="sum-vendor__val">{s.totalUnitsSold ?? 0}</span>
            <span className="sum-vendor__key">Unități vândute</span>
          </div>
          <div className="sum-vendor__stat">
            <span className="sum-vendor__val">
              {s.estimatedRevenue ? `${Number(s.estimatedRevenue).toLocaleString("ro-RO")} RON` : "0 RON"}
            </span>
            <span className="sum-vendor__key">Venit estimat</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryVendorWidget;
