import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import VendorSidebar from "../VendorSidebar";
import "./VendorLayout.css";

const VendorLayout = () => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/auth/login" />;
  if (user.role !== "vendor") return <Navigate to="/vendor/apply" />;

  return (
    <div className="vlayout">
      <aside className="vlayout__aside">
        <VendorSidebar />
      </aside>
      <main className="vlayout__main">
        <Outlet />
      </main>
    </div>
  );
};

export default VendorLayout;
