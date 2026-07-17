import useVendorProfileForm from "./useVendorProfileForm";
import { TIP_ENTITATE_OPTIONS } from "../../../../utils/constants";
import "./VendorProfilePanel.css";

const LocationCard = ({ loc, idx, onChange, onRemove }) => (
  <div className="vpp__loc-card">
    <div className="vpp__loc-header">
      <span className="vpp__loc-title">Locație {idx + 1}</span>
      <button type="button" className="vpp__loc-remove" onClick={() => onRemove(idx)}>Șterge</button>
    </div>
    <div className="vpp__row">
      <div className="vf-field">
        <label className="vf-label">Oraș *</label>
        <input className="vf-input" value={loc.oras} onChange={onChange(idx, "oras")} placeholder="Cluj-Napoca" />
      </div>
      <div className="vf-field">
        <label className="vf-label">Adresă</label>
        <input className="vf-input" value={loc.adresa} onChange={onChange(idx, "adresa")} placeholder="Str. Exemplu nr. 1" />
      </div>
    </div>
    <div className="vpp__row">
      <div className="vf-field">
        <label className="vf-label">Telefon locație</label>
        <input className="vf-input" value={loc.telefon} onChange={onChange(idx, "telefon")} placeholder="+40 / 07..." />
      </div>
      <div className="vf-field">
        <label className="vf-label">Livrare min (zile)</label>
        <input type="number" min="0" className="vf-input" value={loc.zileLivrare.min} onChange={onChange(idx, "zileLivrare.min")} />
      </div>
      <div className="vf-field">
        <label className="vf-label">Livrare max (zile)</label>
        <input type="number" min="0" className="vf-input" value={loc.zileLivrare.max} onChange={onChange(idx, "zileLivrare.max")} />
      </div>
    </div>
    <div className="vpp__row">
      <div className="vf-field">
        <label className="vf-label">Program L-V</label>
        <input className="vf-input" value={loc.orar.lv} onChange={onChange(idx, "orar.lv")} placeholder="09:00–18:00" />
      </div>
      <div className="vf-field">
        <label className="vf-label">Sâmbătă</label>
        <input className="vf-input" value={loc.orar.sambata} onChange={onChange(idx, "orar.sambata")} placeholder="10:00–14:00" />
      </div>
      <div className="vf-field">
        <label className="vf-label">Duminică</label>
        <input className="vf-input" value={loc.orar.duminica} onChange={onChange(idx, "orar.duminica")} placeholder="Închis" />
      </div>
    </div>
  </div>
);

const VendorProfilePanel = () => {
  const {
    form, locations,
    handleChange, handleLocationChange,
    addLocation, removeLocation,
    handleSubmit, isLoading, loadingMe, error, success,
  } = useVendorProfileForm();

  if (loadingMe) return <p className="vpp__loading">Se încarcă profilul…</p>;

  return (
    <form className="vpp" onSubmit={handleSubmit}>
      <h1 className="vpp__title">Profil firmă</h1>

      {error && <p className="vpp__error">{error.data?.message || "A apărut o eroare."}</p>}
      {success && <p className="vpp__success">Profil salvat.</p>}

      <section className="vpp__section">
        <p className="vpp__label">Descriere shop</p>
        <textarea
          className="vf-input vf-input--textarea"
          rows={3}
          value={form.shopDescription}
          onChange={handleChange("shopDescription")}
          placeholder="Ce vinzi, de unde ești, câți ani de activitate…"
        />
      </section>

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
        <p className="vpp__label">Contact & retur</p>
        <div className="vpp__row">
          <div className="vf-field">
            <label className="vf-label" htmlFor="telefon">Telefon</label>
            <input id="telefon" className="vf-input" value={form.telefon} onChange={handleChange("telefon")} placeholder="+40 / 07..." />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="emailContact">Email contact</label>
            <input id="emailContact" type="email" className="vf-input" value={form.emailContact} onChange={handleChange("emailContact")} />
          </div>
          <div className="vf-field">
            <label className="vf-label" htmlFor="returZile">Zile retur</label>
            <input id="returZile" type="number" min="0" className="vf-input" value={form.returZile} onChange={handleChange("returZile")} />
          </div>
        </div>
      </section>

      <section className="vpp__section">
        <div className="vpp__loc-header vpp__loc-header--main">
          <p className="vpp__label">Locații</p>
          <button type="button" className="vpp__loc-add" onClick={addLocation}>+ Adaugă locație</button>
        </div>
        {locations.length === 0 && (
          <p className="vpp__loc-empty">Nicio locație adăugată — adaugă cel puțin una pentru a afișa un depozit.</p>
        )}
        {locations.map((loc, idx) => (
          <LocationCard
            key={idx}
            loc={loc}
            idx={idx}
            onChange={handleLocationChange}
            onRemove={removeLocation}
          />
        ))}
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
