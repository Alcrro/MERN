import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import CatalogAdmin from "../../../Components/administrator/catalog/CatalogAdmin";
import PendingListingsAdmin from "../../../Components/administrator/catalog/PendingListingsAdmin";
import "./AdminCatalog.css";

const AdminCatalog = () => {
  const { user } = useSelector((s) => s.auth);
  if (!user || user.role !== "admin") return <Navigate to="/" />;

  return (
    <div className="admin-catalog-page">
      <PendingListingsAdmin />
      <hr className="admin-catalog-page__divider" />
      <CatalogAdmin />
    </div>
  );
};

export default AdminCatalog;
