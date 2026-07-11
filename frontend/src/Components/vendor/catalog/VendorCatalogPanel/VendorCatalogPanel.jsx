import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CatalogTable from "./CatalogTable";
import { CATALOG_TREE } from "../../../../utils/constants";
import "./VendorCatalogPanel.css";

const KINDS = [
  { value: "Electronics", label: "Electronice" },
  { value: "Clothing",    label: "Modă" },
  { value: "Furniture",   label: "Mobilă" },
  { value: "HomeGarden",  label: "Casă & Grădină" },
  { value: "Books",       label: "Cărți" },
];

const VendorCatalogPanel = () => {
  const navigate = useNavigate();
  const [kind, setKind] = useState("Electronics");
  const [tip,  setTip]  = useState(null);

  const handleKindSelect = (k) => { setKind(k); setTip(null); };

  const tips = CATALOG_TREE[kind] ?? [];

  return (
    <div className="vcp">
      <div className="vcp__filters">
        <div className="vcp__filters-row">
          <div className="vcp__kinds">
            {KINDS.map(({ value, label }) => (
              <button key={value} type="button"
                className={`vcp__kind${kind === value ? " vcp__kind--on" : ""}`}
                onClick={() => handleKindSelect(value)}>
                {label}
              </button>
            ))}
          </div>

          <button type="button" className="vcp__propose-btn"
            onClick={() => navigate("/vendor/dashboard/catalog?view=add")}>
            + Propune produs
          </button>
        </div>

        {tips.length > 0 && (
          <div className="vcp__tips">
            <button type="button"
              className={`vcp__tip${!tip ? " vcp__tip--on" : ""}`}
              onClick={() => setTip(null)}>
              Toate
            </button>
            {tips.map(({ label, tip: t }) => (
              <button key={t} type="button"
                className={`vcp__tip${tip === t ? " vcp__tip--on" : ""}`}
                onClick={() => setTip(t)}>
                {label}
              </button>
            ))}
          </div>
        )}
      </div>

      <CatalogTable key={`${kind}-${tip}`} kind={kind} tip={tip} />
    </div>
  );
};

export default VendorCatalogPanel;
