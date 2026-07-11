import useVendorProfileForm from "./useVendorProfileForm";
import { TIP_ENTITATE_OPTIONS } from "../../../../utils/constants";
import "./VendorProfilePanel.css";

const VendorProfilePanel = () => {
  const { form, handleChange, handleSubmit, isLoading, loadingMe, error, success } = useVendorProfileForm();

  if (loadingMe) return <p className="vpp__loading">Se încarcă profilul…</p>;

  return (
    <form className="vpp" onSubmit={handleSubmit}>
      <h1 className="vpp__title">Profil firmă</h1>

      {error && <p className="vpp__error">{error.data?.message || "A apărut o eroare."}</p>}
      {success && <p className="vpp__success">Profil salvat.</p>}

      <section className="vpp__section">
        <p className="vpp__label">Informații legale</p>
        <div className="vpp__row">
          <div className="vf-field">
            <label className="vf-label" htmlFor="cui">CUI</label>
            <input id="cui" className="vf-input" value={form.cui} onChange={handleChange("cui")} placeholder="ex: 12345678" />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="denumireFirma">Denumire firmă</label>
            <input id="denumireFirma" className="vf-input" value={form.denumireFirma} onChange={handleChange("denumireFirma")} />
          </div>
        </div>
        <div className="vf-field vf-field--half">
          <label className="vf-label" htmlFor="tipEntitate">Tip entitate</label>
          <select id="tipEntitate" className="vf-input" value={form.tipEntitate} onChange={handleChange("tipEntitate")}>
            <option value="">— alege —</option>
            {TIP_ENTITATE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </section>

      <section className="vpp__section">
        <p className="vpp__label">Informații operaționale</p>
        <div className="vpp__row">
          <div className="vf-field">
            <label className="vf-label" htmlFor="orasDepozit">Oraș depozit</label>
            <input id="orasDepozit" className="vf-input" value={form.orasDepozit} onChange={handleChange("orasDepozit")} />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="returZile">Zile retur</label>
            <input id="returZile" type="number" min="0" className="vf-input" value={form.returZile} onChange={handleChange("returZile")} />
          </div>
        </div>
        <div className="vpp__row">
          <div className="vf-field">
            <label className="vf-label" htmlFor="zileLivrareMin">Livrare min (zile)</label>
            <input id="zileLivrareMin" type="number" min="0" className="vf-input" value={form.zileLivrare.min} onChange={handleChange("zileLivrare.min")} />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="zileLivrareMax">Livrare max (zile)</label>
            <input id="zileLivrareMax" type="number" min="0" className="vf-input" value={form.zileLivrare.max} onChange={handleChange("zileLivrare.max")} />
          </div>
        </div>
      </section>

      <section className="vpp__section">
        <p className="vpp__label">Contact public</p>
        <div className="vpp__row">
          <div className="vf-field">
            <label className="vf-label" htmlFor="telefon">Telefon</label>
            <input id="telefon" className="vf-input" value={form.telefon} onChange={handleChange("telefon")} placeholder="+40 / 07..." />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="emailContact">Email contact</label>
            <input id="emailContact" type="email" className="vf-input" value={form.emailContact} onChange={handleChange("emailContact")} />
          </div>
        </div>
      </section>

      <div className="vpp__actions">
        <button type="submit" className="vpp__btn" disabled={isLoading}>
          {isLoading ? "Se salvează…" : "Salvează profilul"}
        </button>
      </div>
    </form>
  );
};

export default VendorProfilePanel;
