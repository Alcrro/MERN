import { useState } from "react";
import { useRedeemPointsMutation } from "../../../features/shopCard/rtkShopCard";
import "./PointsConverter.css";

const PointsConverter = ({ availablePoints }) => {
  const [pts, setPts] = useState("");
  const [redeem, { isLoading }] = useRedeemPointsMutation();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const creditsPreview = pts && Number(pts) >= 10 ? (Math.floor(Number(pts) / 10) * 10) / 10 : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const val = Math.floor(Number(pts) / 10) * 10;
    if (val < 10) { setError("Minim 10 puncte, multiplu de 10."); return; }
    if (val > availablePoints) { setError("Puncte insuficiente."); return; }
    try {
      const res = await redeem({ points: val }).unwrap();
      setResult(res);
      setPts("");
    } catch (err) {
      setError(err?.data?.message || "Eroare. Încearcă din nou.");
    }
  };

  return (
    <div className="pts-conv">
      <h2 className="pts-conv__title">Convertește puncte în credite</h2>
      <p className="pts-conv__sub">10 puncte = 1 credit (1 RON). Ai {availablePoints.toLocaleString("ro-RO")} puncte disponibile.</p>

      {result ? (
        <div className="pts-conv__ok">
          <span className="pts-conv__ok-icon">★</span>
          <p>{result.creditsAdded} credite adăugate! Sold nou: {result.newCredits} credite, {result.newPoints} puncte.</p>
          <button type="button" className="pts-conv__ok-btn" onClick={() => setResult(null)}>Convertește din nou</button>
        </div>
      ) : (
        <form className="pts-conv__form" onSubmit={handleSubmit}>
          <div className="pts-conv__row">
            <input
              type="number"
              min="10"
              step="10"
              max={availablePoints}
              value={pts}
              onChange={(e) => setPts(e.target.value)}
              placeholder="ex: 50"
              className="pts-conv__input"
              disabled={isLoading || availablePoints < 10}
              aria-label="Număr puncte de convertit"
            />
            <span className="pts-conv__arrow">→</span>
            <span className="pts-conv__preview">{creditsPreview > 0 ? `${creditsPreview} credite` : "—"}</span>
          </div>
          {error && <p className="pts-conv__err">{error}</p>}
          <button
            type="submit"
            className="pts-conv__btn"
            disabled={isLoading || !pts || availablePoints < 10}
          >
            {isLoading ? "Se procesează…" : "Convertește"}
          </button>
          {availablePoints < 10 && (
            <p className="pts-conv__empty">Ai nevoie de minim 10 puncte pentru conversie.</p>
          )}
        </form>
      )}
    </div>
  );
};

export default PointsConverter;
