import { useState, useEffect } from "react";
import {
  useListVouchersQuery,
  useToggleVoucherMutation,
  useGetVendorRuleQuery,
  useUpsertVendorRuleMutation,
} from "../../../../features/voucher/rtkVoucher";
import VendorVoucherForm from "../VendorVoucherForm";
import "./VendorVouchersPanel.css";

const fmtVal = (v) =>
  Number(v).toLocaleString("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const RuleSection = () => {
  const { data: ruleData, isLoading: ruleLoading } = useGetVendorRuleQuery();
  const [upsert, { isLoading: saving }] = useUpsertVendorRuleMutation();

  const rule = ruleData?.data;

  const [form, setForm] = useState({
    enabled: false, type: "percent", value: 10, minOrderAmount: 0, validDays: 30,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (rule) {
      setForm({
        enabled:        rule.enabled        ?? false,
        type:           rule.type           ?? "percent",
        value:          rule.value          ?? 10,
        minOrderAmount: rule.minOrderAmount ?? 0,
        validDays:      rule.validDays      ?? 30,
      });
    }
  }, [rule]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    await upsert(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (ruleLoading) return null;

  return (
    <div className="vvp__rule">
      <div className="vvp__rule-head">
        <h2 className="vvp__rule-title">Regulă voucher automat</h2>
        <label className="vvp__rule-toggle">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
          />
          <span>{form.enabled ? "Activată" : "Dezactivată"}</span>
        </label>
      </div>

      <p className="vvp__rule-hint">
        La fiecare comandă plătită din magazinul tău, cumpărătorul primește automat un voucher de reducere.
      </p>

      <div className="vvp__rule-fields">
        <div className="vvp__rule-group">
          <label className="vvp__rule-label">Tip reducere</label>
          <div className="vvp__rule-radios">
            {["percent", "fixed"].map((t) => (
              <label key={t} className="vvp__rule-radio">
                <input type="radio" name="rule-type" value={t} checked={form.type === t}
                  onChange={() => set("type", t)} />
                {t === "percent" ? "Procent (%)" : "Fix (RON)"}
              </label>
            ))}
          </div>
        </div>

        <div className="vvp__rule-group">
          <label className="vvp__rule-label">
            Valoare {form.type === "percent" ? "(%)" : "(RON)"}
          </label>
          <input className="vvp__rule-input" type="number" min={1} max={form.type === "percent" ? 100 : undefined}
            value={form.value} onChange={(e) => set("value", Number(e.target.value))} />
        </div>

        <div className="vvp__rule-group">
          <label className="vvp__rule-label">Comandă minimă (RON)</label>
          <input className="vvp__rule-input" type="number" min={0}
            value={form.minOrderAmount} onChange={(e) => set("minOrderAmount", Number(e.target.value))} />
        </div>

        <div className="vvp__rule-group">
          <label className="vvp__rule-label">Valabilitate voucher (zile)</label>
          <input className="vvp__rule-input" type="number" min={1} max={365}
            value={form.validDays} onChange={(e) => set("validDays", Number(e.target.value))} />
        </div>
      </div>

      <button type="button" className="vvp__rule-save" onClick={handleSave} disabled={saving}>
        {saved ? "Salvat!" : saving ? "Se salvează..." : "Salvează regula"}
      </button>
    </div>
  );
};

const VendorVouchersPanel = () => {
  const [showForm, setShowForm]             = useState(false);
  const { data, isLoading }                 = useListVouchersQuery();
  const [toggle, { isLoading: toggling }]   = useToggleVoucherMutation();
  const vouchers = data?.data ?? [];

  return (
    <div className="vvp">
      <div className="vvp__head">
        <h1 className="vvp__title">Voucherele mele</h1>
        <button
          type="button"
          className={`vvp__add${showForm ? " vvp__add--cancel" : ""}`}
          onClick={() => setShowForm((s) => !s)}
        >
          {showForm ? "Anulează" : "+ Voucher nou"}
        </button>
      </div>

      {showForm && <VendorVoucherForm onCreated={() => setShowForm(false)} />}

      {isLoading && (
        <div className="vvp__table-wrap">
          <p className="vvp__loading">Se încarcă voucherele...</p>
        </div>
      )}

      {!isLoading && vouchers.length === 0 && !showForm && (
        <div className="vvp__empty-state">
          <p className="vvp__empty-text">Nu ai vouchere create încă.</p>
          <p className="vvp__empty-hint">
            Creează primul voucher pentru clienții tăi apăsând „+ Voucher nou".
          </p>
        </div>
      )}

      {vouchers.length > 0 && (
        <div className="vvp__table-wrap">
          <table className="vvp__table">
            <thead>
              <tr>
                <th>Cod</th>
                <th>Tip</th>
                <th>Valoare</th>
                <th>Min. comandă</th>
                <th>Produse</th>
                <th>Expiră</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((v) => (
                <tr key={v._id}>
                  <td><span className="vvp__code">{v.code}</span></td>
                  <td>{v.type === "percent" ? "Procent" : "Fix"}</td>
                  <td className="vvp__val">
                    {v.type === "percent" ? `${v.value}%` : `${fmtVal(v.value)} RON`}
                  </td>
                  <td>
                    {v.minOrder > 0
                      ? `${fmtVal(v.minOrder)} RON`
                      : <span className="vvp__dash">—</span>}
                  </td>
                  <td>
                    {v.productIds?.length > 0
                      ? <span className="vvp__products-badge">{v.productIds.length} produse</span>
                      : <span className="vvp__dash">Toate</span>}
                  </td>
                  <td>
                    {v.expiresAt
                      ? new Date(v.expiresAt).toLocaleDateString("ro-RO")
                      : <span className="vvp__dash">—</span>}
                  </td>
                  <td>
                    <span className={`vvp__badge vvp__badge--${v.active ? "on" : "off"}`}>
                      {v.active ? "Activ" : "Inactiv"}
                    </span>
                  </td>
                  <td>
                    <button type="button" className="vvp__toggle" disabled={toggling}
                      onClick={() => toggle(v._id)}>
                      {v.active ? "Dezactivează" : "Activează"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <RuleSection />
    </div>
  );
};

export default VendorVouchersPanel;
