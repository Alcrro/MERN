import Stars from "../../../products/singleProducts/Stars";
import "./VendorPageHeader.css";

const MONTHS_RO = [
  "Ianuarie","Februarie","Martie","Aprilie","Mai","Iunie",
  "Iulie","August","Septembrie","Octombrie","Noiembrie","Decembrie",
];

const formatActiveSince = (iso) => {
  const d = new Date(iso);
  return `${MONTHS_RO[d.getMonth()]} ${d.getFullYear()}`;
};

const VendorPageHeaderSkeleton = () => (
  <div className="vph__skeleton">
    <div className="vph__sk-name sk-pulse" />
    <div className="vph__sk-line sk-pulse" />
    <div className="vph__sk-line sk-pulse" style={{ width: "55%" }} />
  </div>
);

const VendorPageHeader = ({ vendor, isLoading }) => {
  if (isLoading) return <VendorPageHeaderSkeleton />;

  const vp      = vendor?.vendorProfile ?? {};
  const rating  = vendor?.vendorRating ?? { average: 0, count: 0 };
  const hasDepo = Boolean(vp.orasDepozit);

  return (
    <div className="vph">
      <div className="vph__top">
        <div className="vph__name-row">
          <h1 className="vph__name">{vendor.shopName}</h1>
          {vp.tipEntitate && <span className="vph__entitate">{vp.tipEntitate}</span>}
          <span className={`vph__badge${hasDepo ? " vph__badge--depot" : " vph__badge--drop"}`}>
            {hasDepo ? `Depozit: ${vp.orasDepozit}` : "Dropshipping"}
          </span>
        </div>

        {rating.count > 0 && (
          <div className="vph__rating">
            <Stars value={rating.average} size={18} />
            <span className="vph__rating-val">{rating.average.toFixed(1)}</span>
            <span className="vph__rating-count">({rating.count} recenzii)</span>
          </div>
        )}
      </div>

      {vendor.shopDescription && (
        <p className="vph__desc">{vendor.shopDescription}</p>
      )}

      <div className="vph__meta">
        {vp.denumireFirma && <span className="vph__meta-item"><b>Firmă:</b> {vp.denumireFirma}</span>}
        {vp.cui           && <span className="vph__meta-item"><b>CUI:</b> {vp.cui}</span>}
        {vp.emailContact  && <span className="vph__meta-item"><b>Contact:</b> {vp.emailContact}</span>}
        {(vp.zileLivrare?.min != null && vp.zileLivrare?.max != null) && (
          <span className="vph__meta-item">
            <b>Livrare:</b> {vp.zileLivrare.min}–{vp.zileLivrare.max} zile
          </span>
        )}
        {vp.returZile != null && (
          <span className="vph__meta-item"><b>Retur:</b> {vp.returZile} zile</span>
        )}
        {vendor.createdAt && (
          <span className="vph__meta-item"><b>Activ din:</b> {formatActiveSince(vendor.createdAt)}</span>
        )}
      </div>
    </div>
  );
};

export default VendorPageHeader;
