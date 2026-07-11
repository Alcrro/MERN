import { useGetVendorOrdersQuery } from "../../../../features/vendor/rtkVendor";
import { ORDER_STATUS_COLORS } from "../../../../utils/constants";
import "./VendorOrdersPanel.css";

const VendorOrdersPanel = () => {
  const { data, isLoading } = useGetVendorOrdersQuery();
  const orders = data?.orders ?? [];

  return (
    <div className="vop">
      <h1 className="vop__title">Comenzi</h1>
      {isLoading && <p className="vop__empty">Se încarcă…</p>}
      {!isLoading && orders.length === 0 && (
        <p className="vop__empty">Nu ai comenzi încă. Produsele tale trebuie să fie aprobate înainte ca clienții să le poată cumpăra.</p>
      )}
      {orders.length > 0 && (
        <div className="vop__table-wrap">
          <table className="vop__table">
            <thead>
              <tr>
                <th>ID Comandă</th>
                <th>Data</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o._id}>
                  <td className="vop__id">#{o._id.slice(-6).toUpperCase()}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString("ro-RO")}</td>
                  <td>{o.user?.name ?? "—"}</td>
                  <td className="vop__price">{o.totalPrice?.toLocaleString("ro")} RON</td>
                  <td>
                    <span className="vop__status" style={{ color: ORDER_STATUS_COLORS[o.status] }}>
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VendorOrdersPanel;
