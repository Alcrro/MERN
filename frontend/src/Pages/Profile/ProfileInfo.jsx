import { useState } from "react";
import { useSelector } from "react-redux";
import { ROLE_LABEL } from "../../Utils/constants";

const ProfileInfo = () => {
  const { user } = useSelector((s) => s.auth);
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

export default ProfileInfo;
