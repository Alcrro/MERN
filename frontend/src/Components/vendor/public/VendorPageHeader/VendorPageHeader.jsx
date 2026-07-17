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

  const vp     = vendor?.profile ?? {};
  const rating = vendor?.rating ?? { average: 0, count: 0 };
  const locs   = vendor?.locations ?? [];

  return (
    <div className="vph">
      <div className="vph__top">
        <div className="vph__name-row">
          <h1 className="vph__name">{vendor.shopName}</h1>
          {vp.tipEntitate && <span className="vph__entitate">{vp.tipEntitate}</span>}
          {locs.length > 0 ? (
            <span className="vph__badge vph__badge--depot">
              {locs.length === 1 ? `Depozit: ${locs[0].oras}` : `${locs.length} locații`}
            </span>
          ) : (
            <span className="vph__badge vph__badge--drop">Dropshipping</span>
          )}
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
        {vp.returZile != null && (
          <span className="vph__meta-item"><b>Retur:</b> {vp.returZile} zile</span>
        )}
        {vendor.createdAt && (
          <span className="vph__meta-item"><b>Activ din:</b> {formatActiveSince(vendor.createdAt)}</span>
        )}
      </div>

      {locs.length > 1 && (
        <div className="vph__locations">
          {locs.map((loc, i) => (
            <div key={i} className="vph__loc">
              <span className="vph__loc-oras">{loc.oras}</span>
              {loc.zileLivrare?.min != null && loc.zileLivrare?.max != null && (
                <span className="vph__loc-livrare">{loc.zileLivrare.min}–{loc.zileLivrare.max} zile</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorPageHeader;
