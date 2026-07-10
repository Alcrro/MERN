import { NavLink, Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLE_LABEL } from "../../utils/constants";
import { NAV, avatarColor } from "../../Components/profile/profileConstants";
import "./Profile.css";

const Profile = () => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="prf-page">
      <aside className="prf-sidebar">
        <div className="prf-user-card">
          <div className="prf-avatar" style={{ background: avatarColor(user.name) }}>
            {user.name[0].toUpperCase()}
          </div>
          <div className="prf-user-info">
            <p className="prf-user-name">{user.name}</p>
            <p className="prf-user-email">{user.email}</p>
            <span className={`prf-role-badge prf-role-${user.role}`}>
              {ROLE_LABEL[user.role] || user.role}
            </span>
          </div>
        </div>

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
        </nav>
      </aside>

      <main className="prf-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Profile;
