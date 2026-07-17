import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookieBanner.css";

const STORAGE_KEY = "cookie-consent";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
  }, []);

  const handleChoice = (choice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Consimțământ cookie-uri">
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          Folosim cookie-uri tehnice necesare funcționării site-ului. Cu acordul tău,
          folosim și cookie-uri pentru a îmbunătăți experiența.{" "}
          <Link to="/privacy">Politica de confidențialitate</Link>.
        </p>
        <div className="cookie-banner__actions">
          <button
            className="cookie-banner__reject"
            onClick={() => handleChoice("rejected")}
          >
            Respinge
          </button>
          <button
            className="cookie-banner__accept"
            onClick={() => handleChoice("accepted")}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
