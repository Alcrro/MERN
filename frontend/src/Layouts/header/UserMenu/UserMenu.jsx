import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronIcon, LogoutIcon } from "../icons";
import "./UserMenu.css";

const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  if (!user) {
    return (
      <div className="auth-actions hide-mobile">
        <Link to="/auth/login"    className="btn-login">Intră în cont</Link>
        <Link to="/auth/register" className="btn-register">Înregistrare</Link>
      </div>
    );
  }

  return (
    <div className="user-menu hide-mobile">
      <button className="avatar-btn" onClick={() => setOpen(p => !p)}>
        <span className="avatar-circle">{user.name[0].toUpperCase()}</span>
        <span className="avatar-name">{user.name.split(" ")[0]}</span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <>
          <div className="dropdown-backdrop" onClick={close} />
          <div className="user-dropdown">
            <div className="dropdown-header">
              <span className="avatar-circle">{user.name[0].toUpperCase()}</span>
              <div>
                <p className="dropdown-name">{user.name}</p>
                <span className={`role-badge role-${user.role}`}>{user.role}</span>
              </div>
            </div>
            <div className="dropdown-divider" />
            <ul className="dropdown-links">
              <li><Link to="/profile"        onClick={close}>Profilul meu</Link></li>
              <li><Link to="/profile/orders" onClick={close}>Comenzile mele</Link></li>
              {user.role === "admin" && (
                <li><a href="/admin/adauga-categorii" onClick={close}>Categorii</a></li>
              )}
            </ul>
            <div className="dropdown-divider" />
            <button className="dropdown-logout" onClick={() => { onLogout(); close(); }}>
              <LogoutIcon /> Deconectare
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default UserMenu;
