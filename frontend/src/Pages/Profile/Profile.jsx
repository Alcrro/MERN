import { NavLink, Navigate, Outlet, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLE_LABEL } from "../../utils/constants";
import { NAV } from "../../Components/profile/profileConstants";
import AvatarUpload from "../../Components/molecules/AvatarUpload";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="prf-page">
      <aside className="prf-sidebar">
        <div className="prf-user-card">
          <AvatarUpload />
          <div className="prf-user-info">
            <p className="prf-user-name">{user.name}</p>
            <p className="prf-user-email">{user.email}</p>
            <span className={`prf-role-badge prf-role-${user.role}`}>
              {ROLE_LABEL[user.role] || user.role}
            </span>
          </div>
        </div>

        {user.role === "admin" && (
          <Link to="/admin/dashboard" className="prf-vendor-btn">
            <span className="prf-nav-icon">⚙️</span>
            Dashboard Admin
          </Link>
        )}

        {user.role === "vendor" && (
          <Link to="/vendor/dashboard" className="prf-vendor-btn">
            <span className="prf-nav-icon">🏪</span>
            Dashboard Vânzător
          </Link>
        )}

        <nav className="prf-nav">
          {NAV.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `prf-nav-link${isActive ? " prf-nav-link--active" : ""}`}
            >
              <span className="prf-nav-icon">{icon}</span>
              {label}
            </NavLink>
          ))}
          {user.role !== "vendor" && user.vendorStatus !== "pending" && (
            <Link to="/vendor/apply" className="prf-nav-link prf-nav-link--apply">
              <span className="prf-nav-icon">➕</span>
              Devino vânzător
            </Link>
          )}
        </nav>
      </aside>

      <main className="prf-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Profile;
