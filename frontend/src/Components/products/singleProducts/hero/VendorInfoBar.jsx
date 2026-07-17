import "./VendorInfoBar.css";

const VendorInfoBar = ({ vendor }) => {
  const vp  = vendor.profile ?? {};
  const loc = vendor.locations?.[0] ?? {};
  const min = loc.zileLivrare?.min;
  const max = loc.zileLivrare?.max;

  return (
    <div className="vib">
      <div className="vib__identity">
        <span className="vib__label">Vânzător</span>
        <span className="vib__shop">{vendor.shopName}</span>
        {vp.tipEntitate && <span className="vib__tip">{vp.tipEntitate}</span>}
      </div>
      <div className="vib__meta">
        {loc.oras      && <span>📍 {loc.oras}</span>}
        {min != null && max != null && <span>🚚 {min}–{max} zile</span>}
        {vp.returZile  != null && <span>↩ {vp.returZile} zile retur</span>}
      </div>
    </div>
  );
};

export default VendorInfoBar;
