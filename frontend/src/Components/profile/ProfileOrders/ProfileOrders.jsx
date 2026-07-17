import { Link } from "react-router-dom";
import { useGetMyOrdersQuery } from "../../../features/order/rtkOrders";
import "./ProfileOrders.css";


const STATUS_LABELS = {
  Pending:    "În așteptare",
  Processing: "Se procesează",
  Shipped:    "Expediat",
  Delivered:  "Livrat",
  Cancelled:  "Anulat",
};

const ProfileOrders = () => {
  const { data, isLoading } = useGetMyOrdersQuery();

  if (isLoading) return (
    <div className="prf-section">
      <h2 className="prf-sec-title">Comenzile mele</h2>
      <p className="po-loading">Se încarcă...</p>
    </div>
  );

  const orders = data?.orders ?? [];

  return (
    <div className="prf-section">
      <h2 className="prf-sec-title">Comenzile mele</h2>
      {orders.length === 0 ? (
        <div className="prf-empty">
          <p>Nu ai nicio comandă încă.</p>
        </div>
      ) : (
        <ul className="po-list">
          {orders.map((order) => (
            <li key={order._id} className="po-item">
              <div className="po-item__info">
                <span className="po-item__ref">#{order._id.slice(-6).toUpperCase()}</span>
                <span className="po-item__date">
                  {new Date(order.createdAt).toLocaleDateString("ro-RO")}
                </span>
                <span className={`po-item__status po-item__status--${order.status.toLowerCase()}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                {order.isPaid && <span className="po-item__paid">Plătit</span>}
                {order.installmentPlan && (
                  <span className="po-item__rate">
                    {order.installmentPlan.months}× {order.installmentPlan.bank}
                  </span>
                )}
              </div>
              <div className="po-item__right">
                <span className="po-item__total">
                  {Number(order.totalPrice).toLocaleString("ro-RO")} RON
                </span>
                <Link to={`/orders/${order._id}`} className="po-item__link">
                  Detalii
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProfileOrders;
