import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetVendorProductsQuery } from "../../../../features/vendor/rtkVendor";
import { VENDOR_STATUS_TABS } from "../../../../utils/constants";
import VendorProductRow from "../VendorProductRow";
import "./VendorProductsPanel.css";

const VendorProductRowSkeleton = () => (
  <div className="vpp__skel-row">
    <div className="skel vpp__skel-img" />
    <div className="vpp__skel-body">
      <div className="skel vpp__skel-line vpp__skel-line--wide" />
      <div className="skel vpp__skel-line vpp__skel-line--narrow" />
    </div>
    <div className="skel vpp__skel-price" />
    <div className="vpp__skel-actions">
      <div className="skel vpp__skel-btn" />
      <div className="skel vpp__skel-btn" />
    </div>
  </div>
);

const VendorProductsPanel = () => {
  const [status, setStatus] = useState(undefined);
  const navigate = useNavigate();
  const { data, isLoading } = useGetVendorProductsQuery({ status });
  const products = data?.products ?? [];

  return (
    <div className="vpp">
      <div className="vpp__header">
        <h1 className="vpp__title">Produsele mele</h1>
      </div>

      <div className="vpp__tabs">
        {VENDOR_STATUS_TABS.map(({ key, label }) => (
          <button
            key={label}
            type="button"
            className={`vpp__tab${status === key ? " vpp__tab--active" : ""}`}
            onClick={() => setStatus(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="vpp__list">
        {isLoading && [0, 1, 2].map((i) => <VendorProductRowSkeleton key={i} />)}
        {!isLoading && products.length === 0 && (
          <div className="vpp__empty-state">
            <p>Nu ai niciun produs listat încă.</p>
            <button type="button" className="vpp__add" onClick={() => navigate("/vendor/dashboard/catalog")}>
              Mergi la Catalog produse
            </button>
          </div>
        )}
        {products.map((p) => <VendorProductRow key={p._id} product={p} />)}
      </div>
    </div>
  );
};

export default VendorProductsPanel;
