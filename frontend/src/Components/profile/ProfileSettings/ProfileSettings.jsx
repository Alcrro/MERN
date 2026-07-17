import { useState } from "react";
import { useSelector } from "react-redux";
import ThemeToggle from "../../UI/ThemeToggle/ThemeToggle";
import { useTheme } from "../../../hooks/useTheme";
import { ROLE_LABEL } from "../../../utils/constants";

const ProfileSettings = () => {
  const { user } = useSelector((s) => s.auth);
  const [form, setForm]       = useState({ name: user?.name || "", phone: "" });
  const [saved, setSaved]     = useState(false);
  const [currentPass, setCurrentPass] = useState("");
  const [newPass,     setNewPass]     = useState("");
  const { isDark, toggle: toggleTheme } = useTheme();

  const onChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const onSave   = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="prf-sections-stack">
      <div className="prf-section">
        <h2 className="prf-sec-title">Informații personale</h2>
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

export default ProfileSettings;
