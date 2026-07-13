import { useGetAdminPendingListingsQuery, useGetAdminPendingVendorsQuery } from "../../../features/admin/rtkAdmin";
import { Link } from "react-router-dom";
import "./AdminOverview.css";

const AdminOverview = () => {
  const { data: listingsData } = useGetAdminPendingListingsQuery({ page: 1, limit: 1 });
  const { data: vendorsData } = useGetAdminPendingVendorsQuery();

  const pendingListings = listingsData?.count ?? 0;
  const pendingVendors = vendorsData?.vendors?.length ?? 0;

  return (
    <div className="admin-ov">
      <h1 className="admin-ov__title">Prezentare generală</h1>
      <div className="admin-ov__cards">
        <Link to="/admin/dashboard/listings" className="admin-ov__card">
          <span className="admin-ov__card-icon">🕐</span>
          <div>
            <p className="admin-ov__card-value">{pendingListings}</p>
            <p className="admin-ov__card-label">Produse în verificare</p>
          </div>
        </Link>
        <Link to="/admin/dashboard/vendors" className="admin-ov__card">
          <span className="admin-ov__card-icon">🏪</span>
          <div>
            <p className="admin-ov__card-value">{pendingVendors}</p>
            <p className="admin-ov__card-label">Cereri vânzători</p>
          </div>
        </Link>
        <Link to="/admin/dashboard/catalog" className="admin-ov__card">
          <span className="admin-ov__card-icon">📦</span>
          <div>
            <p className="admin-ov__card-value">→</p>
            <p className="admin-ov__card-label">Catalog produse</p>
          </div>
        </Link>
        <Link to="/admin/dashboard/categories" className="admin-ov__card">
          <span className="admin-ov__card-icon">🗂️</span>
          <div>
            <p className="admin-ov__card-value">→</p>
            <p className="admin-ov__card-label">Categorii</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminOverview;
