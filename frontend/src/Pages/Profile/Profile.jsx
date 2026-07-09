import React, { useState } from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Profile.css";
import ThemeToggle from "../../Components/UI/ThemeToggle/ThemeToggle";
import { useTheme } from "../../hooks/useTheme";

/* ── sidebar nav items ─────────────────────────────────────── */
const NAV = [
  { to: "info",     label: "Profilul meu",    icon: "👤" },
  { to: "orders",   label: "Comenzile mele",  icon: "📦" },
  { to: "address",  label: "Adresele mele",   icon: "📍" },
  { to: "settings", label: "Setări cont",     icon: "⚙️" },
];

const AVATAR_BG = ["#2563eb","#059669","#d97706","#7c3aed","#db2777","#0891b2"];
const avatarColor = (name = "") => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];

const ROLE_LABEL = { client: "Cumpărător", vendor: "Vânzător", admin: "Administrator" };

/* ── sub-pages ─────────────────────────────────────────────── */
const ProfileInfo = ({ user }) => {
  const [form, setForm] = useState({ name: user?.name || "", phone: "" });
  const [saved, setSaved] = useState(false);

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="prf-section">
      <h2 className="prf-sec-title">Profilul meu</h2>
      <form className="prf-form" onSubmit={onSave}>
        <div className="prf-form-row">
          <div className="prf-fg">
            <label>Nume complet</label>
            <input name="name" value={form.name} onChange={onChange} />
          </div>
          <div className="prf-fg">
            <label>Email</label>
            <input value={user?.email || ""} disabled className="prf-disabled" />
          </div>
        </div>
        <div className="prf-form-row">
          <div className="prf-fg">
            <label>Telefon</label>
            <input name="phone" value={form.phone} onChange={onChange} placeholder="+40 7xx xxx xxx" />
          </div>
          <div className="prf-fg">
            <label>Rol</label>
            <input value={ROLE_LABEL[user?.role] || user?.role} disabled className="prf-disabled" />
          </div>
        </div>
        <button type="submit" className="prf-save-btn">
          {saved ? "✓ Salvat!" : "Salvează modificările"}
        </button>
      </form>
    </div>
  );
};

const ProfileOrders = () => (
  <div className="prf-section">
    <h2 className="prf-sec-title">Comenzile mele</h2>
    <div className="prf-empty">
      <span className="prf-empty-icon">📦</span>
      <p>Nu ai nicio comandă încă.</p>
    </div>
  </div>
);

const ProfileAddress = () => (
  <div className="prf-section">
    <h2 className="prf-sec-title">Adresele mele</h2>
    <div className="prf-empty">
      <span className="prf-empty-icon">📍</span>
      <p>Nu ai nicio adresă salvată.</p>
    </div>
  </div>
);

const ProfileSettings = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass]         = useState("");
  const { isDark, toggle: toggleTheme } = useTheme();

  return (
    <div className="prf-sections-stack">
      <div className="prf-section">
        <h2 className="prf-sec-title">Aspect</h2>
        <div className="prf-theme-row">
          <div>
            <p className="prf-theme-label">Temă {isDark ? "întunecată" : "luminoasă"}</p>
            <p className="prf-theme-desc">Schimbă între modul luminos și cel întunecat</p>
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </div>

      <div className="prf-section">
        <h2 className="prf-sec-title">Schimbă parola</h2>
        <div className="prf-form">
          <div className="prf-fg">
            <label>Parola curentă</label>
            <input type="password" value={currentPass} onChange={(e) => setCurrentPass(e.target.value)} placeholder="••••••" />
          </div>
          <div className="prf-fg">
            <label>Parolă nouă</label>
            <input type="password" value={newPass} onChange={(e) => setNewPass(e.target.value)} placeholder="Minim 6 caractere" />
          </div>
          <button className="prf-save-btn">Schimbă parola</button>
        </div>
      </div>

      <div className="prf-section">
        <h2 className="prf-sec-title prf-danger-title">Zonă periculoasă</h2>
        <p className="prf-danger-desc">Ștergerea contului este permanentă și nu poate fi anulată.</p>
        <button className="prf-delete-btn">Șterge contul</button>
      </div>
    </div>
  );
};

/* ── main layout ───────────────────────────────────────────── */
const Profile = () => {
  const { user } = useSelector((s) => s.auth);

  if (!user) return <Navigate to="/auth/login" />;

  return (
    <div className="prf-page">
      {/* ── Sidebar ── */}
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

      {/* ── Content ── */}
      <main className="prf-content">
        <Routes>
          <Route index element={<Navigate to="info" replace />} />
          <Route path="info"     element={<ProfileInfo user={user} />} />
          <Route path="orders"   element={<ProfileOrders />} />
          <Route path="address"  element={<ProfileAddress />} />
          <Route path="settings" element={<ProfileSettings />} />
        </Routes>
      </main>
    </div>
  );
};

export default Profile;
