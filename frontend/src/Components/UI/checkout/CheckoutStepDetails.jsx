import { useState, useEffect } from "react";
import { useGetAddressesQuery, useAddAddressMutation } from "../../../features/address/rtkAddresses";
import { useGetPaymentMethodsQuery } from "../../../features/paymentMethods/rtkPaymentMethods";
import InstallmentPlanForm from "../../molecules/InstallmentPlanForm";
import { fmt } from "../../products/add-to-Cart/cartUtils";
import panda from "../../../Assets/images/panda.png";

const COUNTIES = [
  "Alba","Arad","Arges","Bacau","Bihor","Bistrita-Nasaud","Botosani",
  "Braila","Brasov","Bucuresti","Buzau","Calarasi","Cluj","Constanta",
  "Covasna","Dambovita","Dolj","Galati","Giurgiu","Gorj","Harghita",
  "Hunedoara","Ialomita","Iasi","Ilfov","Maramures","Mehedinti","Mures",
  "Neamt","Olt","Prahova","Salaj","Satu Mare","Sibiu","Suceava",
  "Teleorman","Timis","Tulcea","Vaslui","Valcea","Vrancea",
];

const EMPTY_ADDR = { street: "", city: "", county: "", zip: "", phone: "" };

const FULL_METHODS = [
  { value: "Card",    label: "Plată cu cardul",    desc: "Visa, Mastercard — online securizat" },
  { value: "Ramburs", label: "Ramburs la livrare", desc: "Plătești când primești coletul" },
];

const BRAND_LABEL = { visa: "Visa", mastercard: "Mastercard", amex: "Amex", maestro: "Maestro" };

const itemLabel = (item) => [item.data.brand, item.data.model || item.data.name].filter(Boolean).join(" ") || "Produs";

const CheckoutStepDetails = ({ delivery, billing, payment, cart }) => {
  const { data: addrData, isLoading: addrLoading } = useGetAddressesQuery();
  const [addAddress, { isLoading: isSaving }] = useAddAddressMutation();
  const [showForm, setShowForm]   = useState(false);
  const [addrForm, setAddrForm]   = useState(EMPTY_ADDR);
  const { data: pmData }          = useGetPaymentMethodsQuery();

  const addresses    = addrData?.addresses ?? [];
  const savedCards   = pmData?.data ?? [];
  const installItems = cart.items.filter((i) => i.data?._selectedRate);
  const regularItems = cart.items.filter((i) => !i.data?._selectedRate);

  useEffect(() => {
    if (payment.method !== "Card" || savedCards.length === 0 || payment.savedCardId !== null) return;
    const def = savedCards.find((c) => c.isDefault) ?? savedCards[0];
    payment.onSavedCardChange(def.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payment.method, savedCards.length]);

  const handleAddrSave = async (e) => {
    e.preventDefault();
    const res = await addAddress(addrForm);
    if (res.data) {
      delivery.onAddressSelect(res.data.address._id);
      setShowForm(false);
      setAddrForm(EMPTY_ADDR);
    }
  };

  return (
    <div className="ck-details">

      {/* ── 1. Modalitate livrare ── */}
      <section className="ck-section">
        <div className="ck-section__hd">
          <span className="ck-section__num">1</span>
          <h3 className="ck-section__title">Modalitate livrare</h3>
        </div>

        <div className="ck-dlv-tabs">
          <button type="button"
            className={`ck-dlv-tab${delivery.method === "pickup" ? " ck-dlv-tab--active" : ""}`}
            onClick={() => delivery.onMethodChange("pickup")}>
            Ridicare personală
          </button>
          <button type="button"
            className={`ck-dlv-tab${delivery.method === "courier" ? " ck-dlv-tab--active" : ""}`}
            onClick={() => delivery.onMethodChange("courier")}>
            Livrare prin curier
          </button>
        </div>

        {delivery.method === "pickup" && (
          <p className="ck-pickup-msg">
            Vei ridica comanda din sediul nostru. Te vom contacta cu detaliile de confirmare.
          </p>
        )}

        {delivery.method === "courier" && (
          <div className="ck-courier">
            {addrLoading ? (
              <p className="ck-loading">Se încarcă adresele...</p>
            ) : (
              <>
                {addresses.length === 0 && !showForm && (
                  <p className="ck-hint">Nu ai adrese salvate. Adaugă una mai jos.</p>
                )}
                {addresses.map((addr) => (
                  <label key={addr._id}
                    className={`ck-addr${delivery.addressId === addr._id ? " ck-addr--active" : ""}`}>
                    <input type="radio" name="address" value={addr._id}
                      checked={delivery.addressId === addr._id}
                      onChange={() => delivery.onAddressSelect(addr._id)} />
                    <span className="ck-addr__text">
                      {addr.street}, {addr.city}, jud. {addr.county}, {addr.zip}
                      <small>{addr.phone}</small>
                    </span>
                  </label>
                ))}
                {showForm ? (
                  <form className="ck-form" onSubmit={handleAddrSave}>
                    <input className="ck-input" placeholder="Stradă și număr" value={addrForm.street} required
                      onChange={(e) => setAddrForm({ ...addrForm, street: e.target.value })} />
                    <input className="ck-input" placeholder="Oraș" value={addrForm.city} required
                      onChange={(e) => setAddrForm({ ...addrForm, city: e.target.value })} />
                    <select className="ck-input" value={addrForm.county} required
                      onChange={(e) => setAddrForm({ ...addrForm, county: e.target.value })}>
                      <option value="">Selectează județul</option>
                      {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <input className="ck-input" placeholder="Cod poștal" value={addrForm.zip} required
                      onChange={(e) => setAddrForm({ ...addrForm, zip: e.target.value })} />
                    <input className="ck-input" placeholder="Telefon" value={addrForm.phone} required
                      onChange={(e) => setAddrForm({ ...addrForm, phone: e.target.value })} />
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
              </>
            )}
          </div>
        )}
      </section>

      {/* ── 2. Date factură ── */}
      <section className="ck-section">
        <div className="ck-section__hd">
          <span className="ck-section__num">2</span>
          <h3 className="ck-section__title">Date factură</h3>
        </div>
        <div className="ck-form__row">
          <input className="ck-input" placeholder="Prenume"
            value={billing.firstName}
            onChange={(e) => billing.onChange({ firstName: e.target.value })} />
          <input className="ck-input" placeholder="Nume"
            value={billing.lastName}
            onChange={(e) => billing.onChange({ lastName: e.target.value })} />
        </div>
        <input className="ck-input" placeholder="Număr de telefon"
          value={billing.phone}
          onChange={(e) => billing.onChange({ phone: e.target.value })} />
        <p className="ck-hint">Adresa de facturare: aceeași cu adresa de livrare.</p>
      </section>

      {/* ── 3. Modalitate de plată ── */}
      <section className="ck-section">
        <div className="ck-section__hd">
          <span className="ck-section__num">3</span>
          <h3 className="ck-section__title">Modalitate de plată</h3>
        </div>

        {/* Rate group — only if there are eligible products */}
        {installItems.length > 0 && (
          <div className={`ck-pay-group${payment.path === "installments" ? " ck-pay-group--active" : ""}`}>
            <label className="ck-pay-group__pick">
              <input type="radio" name="payPath" value="installments"
                checked={payment.path === "installments"}
                onChange={() => payment.onPathChange("installments")} />
              <span className="ck-pay-group__pick-label">Rate fără dobândă</span>
              <span className="ck-pay-group__pick-badge">0% dobândă</span>
            </label>
            <div className="ck-pay-group__items">
              {installItems.map((item) => (
                <div key={item.data._id} className="ck-pay-item">
                  <img
                    src={item.data._variantImages?.[0] ?? item.data.images?.[0] ?? panda}
                    alt={itemLabel(item)}
                    className="ck-pay-item__img"
                  />
                  <div className="ck-pay-item__info">
                    {item.data.brand && <span className="ck-pay-item__brand">{item.data.brand}</span>}
                    <span className="ck-pay-item__name">{item.data.model || item.data.name || "Produs"}</span>
                  </div>
                  <span className="ck-pay-item__rate-badge">În rate</span>
                  <span className="ck-pay-item__price">{fmt(item.itemAmountPrice)} RON</span>
                </div>
              ))}
            </div>
            {payment.path === "installments" && (
              <div className="ck-pay-group__config">
                <InstallmentPlanForm plan={payment.plan} onPlanChange={payment.onPlanChange} totalCart={cart.total} />
              </div>
            )}
          </div>
        )}

        {/* Regular payment group */}
        <div className={`ck-pay-group${payment.path === "full" ? " ck-pay-group--active" : ""}`}>
          <label className="ck-pay-group__pick">
            <input type="radio" name="payPath" value="full"
              checked={payment.path === "full"}
              onChange={() => payment.onPathChange("full")} />
            <span className="ck-pay-group__pick-label">Plată integrală</span>
          </label>

          {regularItems.length > 0 && (
            <div className="ck-pay-group__items">
              {regularItems.map((item) => (
                <div key={item.data._id} className="ck-pay-item">
                  <img
                    src={item.data._variantImages?.[0] ?? item.data.images?.[0] ?? panda}
                    alt={itemLabel(item)}
                    className="ck-pay-item__img"
                  />
                  <div className="ck-pay-item__info">
                    {item.data.brand && <span className="ck-pay-item__brand">{item.data.brand}</span>}
                    <span className="ck-pay-item__name">{item.data.model || item.data.name || "Produs"}</span>
                  </div>
                  {item.itemQuantity > 1 && (
                    <span className="ck-pay-item__qty">×{item.itemQuantity}</span>
                  )}
                  <span className="ck-pay-item__price">{fmt(item.itemAmountPrice)} RON</span>
                </div>
              ))}
            </div>
          )}

          {payment.path === "full" && (
            <div className="ck-pay-group__config">
              <div className="ck-pay-methods">
                {FULL_METHODS.map((m) => (
                  <label key={m.value}
                    className={`ck-method${payment.method === m.value ? " ck-method--active" : ""}`}>
                    <input type="radio" name="payment" value={m.value}
                      checked={payment.method === m.value}
                      onChange={() => payment.onMethodChange(m.value)} />
                    <div className="ck-method__body">
                      <span className="ck-method__label">{m.label}</span>
                      <span className="ck-method__desc">{m.desc}</span>
                    </div>
                  </label>
                ))}
              </div>

              {payment.method === "Card" && savedCards.length > 0 && (
                <div className="ck-saved-cards">
                  <p className="ck-saved-cards__title">Carduri salvate</p>
                  {savedCards.map((pm) => (
                    <label key={pm.id}
                      className={`ck-saved-card${payment.savedCardId === pm.id ? " ck-saved-card--active" : ""}`}>
                      <input type="radio" name="savedCard" value={pm.id}
                        checked={payment.savedCardId === pm.id}
                        onChange={() => payment.onSavedCardChange(pm.id)} />
                      <span className="ck-saved-card__brand">{BRAND_LABEL[pm.brand] ?? pm.brand.toUpperCase()}</span>
                      <span className="ck-saved-card__number">•••• {pm.last4}</span>
                      <span className="ck-saved-card__exp">
                        {String(pm.expMonth).padStart(2, "0")}/{String(pm.expYear).slice(-2)}
                      </span>
                      {pm.isDefault && <span className="ck-saved-card__badge">Implicit</span>}
                    </label>
                  ))}
                  <label className={`ck-saved-card${payment.savedCardId === null ? " ck-saved-card--active" : ""}`}>
                    <input type="radio" name="savedCard" value=""
                      checked={payment.savedCardId === null}
                      onChange={() => payment.onSavedCardChange(null)} />
                    <span className="ck-saved-card__new">+ Card nou</span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default CheckoutStepDetails;
