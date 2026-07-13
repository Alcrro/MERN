import { useNavigate } from "react-router-dom";
import { useDeleteVendorProductMutation, usePublishVendorProductMutation } from "../../../../features/vendor/rtkVendor";
import ListingStatusBadge from "../../shared/ListingStatusBadge";
import "./VendorProductRow.css";

const getIssues = (p) => {
  const issues = [];
  if (!p.images || p.images.length === 0) issues.push("imagine lipsă");
  if (!p.description || p.description.trim().length < 10) issues.push("descriere prea scurtă");
  if (!p.price || p.price <= 0) issues.push("preț invalid");
  if (p.stock == null || p.stock.quantity == null) issues.push("stoc neluat");
  return issues;
};

const VendorProductRow = ({ product: p }) => {
  const navigate = useNavigate();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteVendorProductMutation();
  const [publishProduct, { isLoading: isPublishing }] = usePublishVendorProductMutation();

  const name = p.model || p.title || p.name || p.brand;
  const canPublish = p.listingStatus === "approved" && p.publishStatus !== "published";
  const isPublished = p.publishStatus === "published";
  const issues = canPublish ? getIssues(p) : [];

  const handleDelete = async () => {
    if (!window.confirm(`Ștergi "${name}"?`)) return;
    await deleteProduct(p._id);
  };

  const handlePublish = async () => {
    if (issues.length > 0) return;
    await publishProduct(p._id);
  };

  return (
    <div className="vpr">
      {p.images?.[0] && <img className="vpr__img" src={p.images[0]} alt={name} />}
      <div className="vpr__info">
        <span className="vpr__name">{name}</span>
        <span className="vpr__brand">{p.brand}</span>
        <span className="vpr__kind">{p.kind}</span>
      </div>
      <div className="vpr__meta">
        <span className="vpr__price">{p.price} RON</span>
        <span className="vpr__qty">Stoc: {p.stock?.quantity ?? 0}</span>
      </div>

      <div className="vpr__status-col">
        <ListingStatusBadge status={p.listingStatus} reason={p.rejectionReason} />
        {isPublished && <span className="vpr__pub-badge">Publicat</span>}
        {canPublish && issues.length === 0 && (
          <span className="vpr__pub-badge vpr__pub-badge--ready">Gata de publicare</span>
        )}
        {canPublish && issues.length > 0 && (
          <ul className="vpr__issues">
            {issues.map((iss) => <li key={iss}>{iss}</li>)}
          </ul>
        )}
      </div>

      <div className="vpr__actions">
        {canPublish && (
          <button
            type="button"
            className="vpr__btn vpr__btn--publish"
            disabled={issues.length > 0 || isPublishing}
            title={issues.length > 0 ? `Completează: ${issues.join(", ")}` : "Publică în shop"}
            onClick={handlePublish}
          >
            {isPublishing ? "…" : "Publică"}
          </button>
        )}
        <button
          type="button"
          className="vpr__btn vpr__btn--edit"
          onClick={() => navigate(`/vendor/dashboard/products/${p._id}/edit`)}
        >
          Editează
        </button>
        <button
          type="button"
          className="vpr__btn vpr__btn--delete"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          Șterge
        </button>
      </div>
    </div>
  );
};

export default VendorProductRow;
