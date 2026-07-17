import { useState } from "react";
import { useApplyReferralMutation } from "../../../features/shopCard/rtkShopCard";
import "./ReferralPanel.css";

const ReferralPanel = ({ referralCode, hasUsedReferral }) => {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [apply, { isLoading }] = useApplyReferralMutation();
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apply({ referralCode: code.trim() }).unwrap();
      setSuccess(res.bonusPoints);
      setCode("");
    } catch (err) {
      setError(err?.data?.message || "Cod invalid.");
    }
  };

  return (
    <div className="referral">
      <h2 className="referral__title">Cod de referral</h2>

      <div className="referral__own">
        <p className="referral__own-label">Codul tău</p>
        <div className="referral__own-row">
          <span className="referral__code">{referralCode}</span>
          <button type="button" className="referral__copy" onClick={handleCopy} aria-label="Copiază codul de referral">
            {copied ? "Copiat!" : "Copiază"}
          </button>
        </div>
        <p className="referral__own-hint">
          Prietenul tău primește 50 pct, tu primești 100 pct la prima lui comandă.
        </p>
      </div>

      {!hasUsedReferral && (
        <div className="referral__apply">
          <p className="referral__apply-label">Ai un cod de la un prieten?</p>
          {success ? (
            <p className="referral__success">+{success} puncte adăugate în contul tău!</p>
          ) : (
            <form className="referral__form" onSubmit={handleApply}>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="ex: ALEX42"
                className="referral__input"
                maxLength={8}
                disabled={isLoading}
                aria-label="Cod referral primit"
              />
              <button type="submit" className="referral__btn" disabled={isLoading || !code.trim()}>
                {isLoading ? "Se aplică…" : "Aplică"}
              </button>
            </form>
          )}
          {error && <p className="referral__err">{error}</p>}
        </div>
      )}

      {hasUsedReferral && (
        <p className="referral__used">Ai folosit deja un cod de referral.</p>
      )}
    </div>
  );
};

export default ReferralPanel;
