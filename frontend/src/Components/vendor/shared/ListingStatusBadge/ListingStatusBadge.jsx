import { LISTING_STATUS_LABELS } from "../../../../utils/constants";
import "./ListingStatusBadge.css";

const ListingStatusBadge = ({ status, reason }) => (
  <span className={`lsb lsb--${status}`} title={status === "rejected" && reason ? reason : undefined}>
    {LISTING_STATUS_LABELS[status] ?? status}
  </span>
);

export default ListingStatusBadge;
