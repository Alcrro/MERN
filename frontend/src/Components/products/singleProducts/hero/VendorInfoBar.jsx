import "./VendorInfoBar.css";

const VendorInfoBar = ({ vendor }) => {
  const vp   = vendor.vendorProfile ?? {};
  const min  = vp.zileLivrare?.min;
  const max  = vp.zileLivrare?.max;

  return (
    <div className="vib">
      <div className="vib__identity">
        <span className="vib__label">Vânzător</span>
        <span className="vib__shop">{vendor.shopName}</span>
        {vp.tipEntitate && <span className="vib__tip">{vp.tipEntitate}</span>}
      </div>
      <div className="vib__meta">
        {vp.orasDepozit && <span>📍 {vp.orasDepozit}</span>}
        {min != null && max != null && <span>🚚 {min}–{max} zile</span>}
        {vp.returZile   != null && <span>↩ {vp.returZile} zile retur</span>}
      </div>
    </div>
  );
};

export default VendorInfoBar;
