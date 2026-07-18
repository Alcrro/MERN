import { useState } from "react";
import { useGetAllOrdersQuery, useGetAdminVendorsQuery, useAssignOrderVendorMutation } from "../../../features/admin/rtkAdmin";
import { ORDER_STATUS_COLORS } from "../../../utils/constants";
import "./AdminOrders.css";

const STATUS_LBL = {
  Pending: "În așteptare",
  Processing: "Se procesează",
  Shipped: "Expediat",
  Delivered: "Livrat",
  Cancelled: "Anulat",
};

const AdminOrders = () => {
  const { data, isFetching } = useGetAllOrdersQuery();
  const { data: vData } = useGetAdminVendorsQuery();
  const [assignVendor] = useAssignOrderVendorMutation();
  const [pending, setPending] = useState(null);

  const orders = data?.orders ?? [];
  const vendors = vData?.vendors ?? [];

  const handleAssign = async (orderId, vendorId) => {
    setPending(orderId);
    await assignVendor({ id: orderId, vendorId: vendorId || null });
    setPending(null);
  };

  return (
    <div className="admin-orders">
      <h2 className="admin-orders__title">Comenzi</h2>

      {isFetching && (
        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr><th>ID</th><th>Data</th><th>Client</th><th>Total</th><th>Status</th><th>Vendor</th></tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4].map((i) => (
                <tr key={i} className="admin-orders__skel-row">
                  {[80, 70, 120, 80, 90, 130].map((w, j) => (
                    <td key={j}><div className="skel" style={{ height: 16, width: w, borderRadius: 4 }} /></td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!isFetching && orders.length === 0 && (
        <p className="admin-orders__empty">Nicio comandă găsită.</p>
      )}

      {!isFetching && orders.length > 0 && (
        <div className="admin-orders__table-wrap">
          <table className="admin-orders__table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Client</th>
                <th>Total</th>
                <th>Status</th>
                <th>Vendor</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => {
                const currentVendor = o.items?.[0]?.vendor?.toString() ?? "";
                const isUpdating = pending === o._id;
                return (
                  <tr key={o._id} className={isUpdating ? "admin-orders__row--updating" : ""}>
                    <td className="admin-orders__id">#{o._id.slice(-6).toUpperCase()}</td>
                    <td className="admin-orders__date">{new Date(o.createdAt).toLocaleDateString("ro-RO")}</td>
                    <td>{o.user?.name ?? "—"}</td>
                    <td className="admin-orders__price">{Number(o.totalPrice).toLocaleString("ro")} RON</td>
                    <td>
                      <span className="admin-orders__badge" style={{ color: ORDER_STATUS_COLORS[o.status] }}>
                        {STATUS_LBL[o.status] ?? o.status}
                      </span>
                    </td>
                    <td>
                      <select
                        className="admin-orders__select"
                        value={currentVendor}
                        disabled={isUpdating}
                        onChange={(e) => handleAssign(o._id, e.target.value)}
                      >
                        <option value="">— fără vendor —</option>
                        {vendors.map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.shopName || v.name}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
