import { useState } from "react";
import { useGetVendorOrdersQuery, useShipVendorOrderMutation } from "../../../../features/vendor/rtkVendor";
import { ORDER_STATUS_COLORS } from "../../../../utils/constants";
import "./VendorOrdersPanel.css";

const STATUS_LBL = { Pending: "În așteptare", Processing: "Se procesează", Shipped: "Expediat", Delivered: "Livrat", Cancelled: "Anulat" };

const ShipModal = ({ order, onClose, onConfirm, isLoading }) => {
  const [awb, setAwb] = useState("");
  return (
    <div className="vop__modal-overlay" onClick={onClose}>
      <div className="vop__modal" onClick={(e) => e.stopPropagation()}>
        <h3 className="vop__modal-title">Marchează ca expediat</h3>
        <p className="vop__modal-sub">Comandă #{order._id.slice(-6).toUpperCase()}</p>
        <input
          className="vop__modal-input"
          placeholder="Nr. AWB (opțional)"
          value={awb}
          onChange={(e) => setAwb(e.target.value)}
        />
        <div className="vop__modal-actions">
          <button type="button" className="vop__modal-btn vop__modal-btn--cancel" onClick={onClose}>Anulează</button>
          <button type="button" className="vop__modal-btn vop__modal-btn--confirm" disabled={isLoading} onClick={() => onConfirm(awb)}>
            {isLoading ? "Se salvează..." : "Confirmă expediere"}
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorOrderRowSkeleton = () => (
  <tr className="vop__skel-row">
    <td><div className="skel vop__skel-cell vop__skel-cell--id" /></td>
    <td><div className="skel vop__skel-cell vop__skel-cell--date" /></td>
    <td><div className="skel vop__skel-cell vop__skel-cell--client" /></td>
    <td><div className="skel vop__skel-cell vop__skel-cell--price" /></td>
    <td><div className="skel vop__skel-cell vop__skel-cell--badge" /></td>
    <td><div className="skel vop__skel-cell vop__skel-cell--btn" /></td>
  </tr>
);

const VendorOrdersPanel = () => {
  const { data, isLoading } = useGetVendorOrdersQuery();
  const [shipOrder, { isLoading: isShipping }] = useShipVendorOrderMutation();
  const [shipping, setShipping] = useState(null);

  const orders = data?.orders ?? [];

  const handleConfirmShip = async (awb) => {
    await shipOrder({ id: shipping._id, awb });
    setShipping(null);
  };

  return (
    <div className="vop">
      <h1 className="vop__title">Comenzi</h1>

      {isLoading && (
        <div className="vop__table-wrap">
          <table className="vop__table">
            <thead><tr><th>ID Comandă</th><th>Data</th><th>Client</th><th>Total</th><th>Status</th><th></th></tr></thead>
            <tbody>{[0, 1, 2].map((i) => <VendorOrderRowSkeleton key={i} />)}</tbody>
          </table>
        </div>
      )}

      {!isLoading && orders.length === 0 && (
        <p className="vop__empty">Nu ai comenzi încă.</p>
      )}

      {orders.length > 0 && (
        <div className="vop__table-wrap">
          <table className="vop__table">
            <thead>
              <tr><th>ID Comandă</th><th>Data</th><th>Client</th><th>Total</th><th>Status</th><th></th></tr>
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
                      {STATUS_LBL[o.status] ?? o.status}
                    </span>
                  </td>
                  <td>
                    {o.status === "Processing" && (
                      <button type="button" className="vop__ship-btn" onClick={() => setShipping(o)}>
                        Marchează expediat
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {shipping && (
        <ShipModal
          order={shipping}
          onClose={() => setShipping(null)}
          onConfirm={handleConfirmShip}
          isLoading={isShipping}
        />
      )}
    </div>
  );
};

export default VendorOrdersPanel;
