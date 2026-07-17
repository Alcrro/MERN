import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../features/order/rtkOrders";
import "./SummaryOrdersWidget.css";

const STATUS_LABELS = { Pending: "În așteptare", Processing: "Se procesează" };
const STATUS_CLASS  = { Pending: "pending",       Processing: "processing" };

const SummaryOrdersWidget = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  const active = (data?.orders ?? [])
    .filter((o) => o.status === "Pending" || o.status === "Processing")
    .slice(0, 5);

  return (
    <div className="sum-orders">
      <div className="sum-orders__header">
        <h3 className="sum-orders__title">Comenzi active</h3>
        <Link to="/profile/orders" className="sum-orders__link">Vezi toate</Link>
      </div>

      {isLoading && (
        <div className="sum-orders__skeletons">
          {[1, 2, 3].map((i) => <div key={i} className="sum-orders__skel" />)}
        </div>
      )}

      {!isLoading && active.length === 0 && (
        <div className="sum-orders__empty">
          <p>Nu ai comenzi active.</p>
          <Link to="/profile/orders" className="sum-orders__link">Istoric comenzi</Link>
        </div>
      )}

      {!isLoading && active.map((o) => (
        <div key={o._id} className="sum-orders__row">
          <span className="sum-orders__ref">#{o._id.slice(-6).toUpperCase()}</span>
          <span className="sum-orders__date">
            {new Date(o.createdAt).toLocaleDateString("ro-RO")}
          </span>
          <span className={`sum-orders__badge sum-orders__badge--${STATUS_CLASS[o.status]}`}>
            {STATUS_LABELS[o.status]}
          </span>
          <span className="sum-orders__total">
            {Number(o.totalPrice).toLocaleString("ro-RO")} RON
          </span>
        </div>
      ))}
    </div>
  );
};

export default SummaryOrdersWidget;
