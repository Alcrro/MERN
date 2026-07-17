import { useState } from "react";
import "./ProfileAddress.css";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useUpdateAddressMutation,
} from "../../../features/address/rtkAddresses";

const COUNTIES = [
  "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani",
  "Braila","Brasov","Bucuresti","Buzau","Calarasi","Cluj","Constanta",
  "Covasna","Dambovita","Dolj","Galati","Giurgiu","Gorj","Harghita",
  "Hunedoara","Ialomita","Iasi","Ilfov","Maramures","Mehedinti","Mures",
  "Neamt","Olt","Prahova","Salaj","Satu Mare","Sibiu","Suceava",
  "Teleorman","Timis","Tulcea","Vaslui","Valcea","Vrancea",
];

const EMPTY = { label: "Acasă", street: "", city: "", county: "", zip: "", phone: "", isDefault: false };

const ProfileAddress = () => {
  const { data, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isSaving }] = useAddAddressMutation();
  const [deleteAddress, { isLoading: isDeleting }] = useDeleteAddressMutation();
  const [updateAddress, { isLoading: isUpdating }] = useUpdateAddressMutation();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);

  const addresses = data?.addresses ?? [];
  const isBusy = isDeleting || isUpdating;

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await addAddress(form);
    if (result.data) {
      setShowForm(false);
      setForm(EMPTY);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm(EMPTY);
  };

  if (isLoading)
    return (
      <div className="prf-section">
        <p className="prf-loading">Se încarcă...</p>
      </div>
    );

  return (
    <div className="prf-section">
      <div className="pa-header">
        <h2 className="prf-sec-title">Adresele mele</h2>
        {!showForm && (
          <button type="button" className="pa-add-btn" onClick={() => setShowForm(true)}>
            + Adresă nouă
          </button>
        )}
      </div>

      {showForm && (
        <form className="pa-form" onSubmit={handleSave}>
          <h3 className="pa-form__title">Adresă nouă</h3>
          <div className="pa-form__row">
            <label className="pa-form__label">Etichetă</label>
            <input
              className="pa-form__input"
              placeholder="ex. Acasă, Birou"
              value={form.label}
              onChange={set("label")}
              maxLength={30}
            />
          </div>
          <div className="pa-form__row">
            <label className="pa-form__label">Stradă și număr *</label>
            <input
              className="pa-form__input"
              placeholder="Str. Exemplu nr. 10, bl. A, ap. 5"
              value={form.street}
              onChange={set("street")}
              required
            />
          </div>
          <div className="pa-form__grid2">
            <div className="pa-form__row">
              <label className="pa-form__label">Oraș *</label>
              <input
                className="pa-form__input"
                placeholder="Orașul"
                value={form.city}
                onChange={set("city")}
                required
              />
            </div>
            <div className="pa-form__row">
              <label className="pa-form__label">Județ *</label>
              <select className="pa-form__input" value={form.county} onChange={set("county")} required>
                <option value="">Selectează județul</option>
                {COUNTIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="pa-form__grid2">
            <div className="pa-form__row">
              <label className="pa-form__label">Cod poștal *</label>
              <input
                className="pa-form__input"
                placeholder="6 cifre"
                value={form.zip}
                onChange={set("zip")}
                maxLength={6}
                required
              />
            </div>
            <div className="pa-form__row">
              <label className="pa-form__label">Telefon *</label>
              <input
                className="pa-form__input"
                placeholder="07xxxxxxxx"
                value={form.phone}
                onChange={set("phone")}
                required
              />
            </div>
          </div>
          <label className="pa-form__check">
            <input type="checkbox" checked={form.isDefault} onChange={set("isDefault")} />
            Setează ca adresă implicită
          </label>
          <div className="pa-form__actions">
            <button type="submit" className="pa-form__btn pa-form__btn--save" disabled={isSaving}>
              {isSaving ? "Se salvează..." : "Salvează adresa"}
            </button>
            <button type="button" className="pa-form__btn pa-form__btn--cancel" onClick={handleCancel}>
              Anulează
            </button>
          </div>
        </form>
      )}

      {addresses.length === 0 && !showForm ? (
        <div className="prf-empty">
          <p>Nu ai nicio adresă salvată. Adaugă una folosind butonul de mai sus.</p>
        </div>
      ) : (
        <div className="pa-grid">
          {addresses.map((addr) => (
            <div
              key={addr._id}
              className={`pa-card${addr.isDefault ? " pa-card--default" : ""}`}
            >
              <div className="pa-card__header">
                <span className="pa-card__label">{addr.label || "Adresă"}</span>
                {addr.isDefault && <span className="pa-card__badge">Implicită</span>}
              </div>
              <div className="pa-card__body">
                <p className="pa-card__street">{addr.street}</p>
                <p className="pa-card__loc">
                  {addr.city}, jud. {addr.county}, {addr.zip}
                </p>
                <p className="pa-card__phone">{addr.phone}</p>
              </div>
              <div className="pa-card__actions">
                {!addr.isDefault && (
                  <button
                    type="button"
                    className="pa-card__btn pa-card__btn--set-default"
                    onClick={() => updateAddress({ id: addr._id, isDefault: true })}
                    disabled={isBusy}
                  >
                    Setează implicit
                  </button>
                )}
                <button
                  type="button"
                  className="pa-card__btn pa-card__btn--del"
                  onClick={() => deleteAddress(addr._id)}
                  disabled={isBusy}
                >
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileAddress;
