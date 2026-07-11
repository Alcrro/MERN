import { useState } from "react";
import { useGetAddressesQuery, useAddAddressMutation } from "../../../features/address/rtkAddresses";

const FIELDS = [
  { name: "street", placeholder: "Stradă și număr" },
  { name: "city",   placeholder: "Oraș" },
  { name: "county", placeholder: "Județ" },
  { name: "zip",    placeholder: "Cod poștal" },
  { name: "phone",  placeholder: "Telefon" },
];
const EMPTY = { street: "", city: "", county: "", zip: "", phone: "" };

const CheckoutStepAddress = ({ selectedId, onSelect }) => {
  const { data, isLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isSaving }] = useAddAddressMutation();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const addresses = data?.addresses ?? [];

  const handleSave = async (e) => {
    e.preventDefault();
    const result = await addAddress(form);
    if (result.data) {
      onSelect(result.data.address._id);
      setShowForm(false);
      setForm(EMPTY);
    }
  };

  if (isLoading) return <p className="ck-loading">Se încarcă adresele...</p>;

  return (
    <div className="ck-step">
      <h3 className="ck-step__title">Adresa de livrare</h3>
      {addresses.length === 0 && !showForm && (
        <p className="ck-hint">Nu ai adrese salvate. Adaugă una mai jos.</p>
      )}
      {addresses.map((addr) => (
        <label key={addr._id} className={`ck-addr${selectedId === addr._id ? " ck-addr--active" : ""}`}>
          <input type="radio" name="address" value={addr._id}
            checked={selectedId === addr._id}
            onChange={() => onSelect(addr._id)} />
          <span className="ck-addr__text">
            {addr.street}, {addr.city}, jud. {addr.county}, {addr.zip}
            <small>{addr.phone}</small>
          </span>
        </label>
      ))}
      {showForm ? (
        <form className="ck-form" onSubmit={handleSave}>
          {FIELDS.map(({ name, placeholder }) => (
            <input key={name} className="ck-input" placeholder={placeholder}
              value={form[name]} required
              onChange={(e) => setForm({ ...form, [name]: e.target.value })} />
          ))}
          <div className="ck-form__row">
            <button type="submit" className="ck-btn ck-btn--primary" disabled={isSaving}>
              {isSaving ? "Se salvează..." : "Salvează adresa"}
            </button>
            <button type="button" className="ck-btn" onClick={() => setShowForm(false)}>Anulează</button>
          </div>
        </form>
      ) : (
        <button type="button" className="ck-add-addr" onClick={() => setShowForm(true)}>
          + Adaugă adresă nouă
        </button>
      )}
    </div>
  );
};

export default CheckoutStepAddress;
