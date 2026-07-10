import { useState } from "react";
import ThemeToggle from "../../UI/ThemeToggle/ThemeToggle";
import { useTheme } from "../../../hooks/useTheme";

const ProfileSettings = () => {
  const [currentPass, setCurrentPass] = useState("");
  const [newPass,     setNewPass]     = useState("");
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

export default ProfileSettings;
