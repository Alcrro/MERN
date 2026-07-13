import { useGetAdminVendorsQuery, useApproveVendorMutation } from "../../../features/admin/rtkAdmin";
import "./AdminVendors.css";

const STATUS_LABEL = { approved: "Aprobat", pending: "În așteptare", rejected: "Respins" };

const AdminVendorRowSkeleton = () => (
  <tr className="admin-vendors__skel-row">
    <td>
      <div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--name" />
      <div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--sub" style={{ marginTop: "0.3rem" }} />
    </td>
    <td><div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--email" /></td>
    <td><div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--badge" /></td>
    <td>
      <div className="admin-vendors__skel-btns">
        <div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--btn" />
        <div className="skel admin-vendors__skel-cell admin-vendors__skel-cell--btn" />
      </div>
    </td>
  </tr>
);

const AdminVendors = () => {
  const { data, isFetching } = useGetAdminVendorsQuery();
  const [approveVendor, { isLoading }] = useApproveVendorMutation();

  const vendors = data?.vendors ?? [];

  const handle = async (id, action) => {
    if (action === "reject" && !window.confirm("Respingi acest vânzător?")) return;
    await approveVendor({ id, action });
  };

  return (
    <div className="admin-vendors">
      <h2 className="admin-vendors__title">Vânzători</h2>

      {isFetching ? (
        <div className="admin-vendors__table-wrap">
          <table className="admin-vendors__table">
            <thead>
              <tr>
                <th>Nume / Shop</th>
                <th>Email</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3].map((i) => <AdminVendorRowSkeleton key={i} />)}
            </tbody>
          </table>
        </div>
      ) : vendors.length === 0 ? (
        <p className="admin-vendors__empty">Niciun vânzător înregistrat.</p>
      ) : (
        <div className="admin-vendors__table-wrap">
          <table className="admin-vendors__table">
            <thead>
              <tr>
                <th>Nume / Shop</th>
                <th>Email</th>
                <th>Status</th>
                <th>Acțiuni</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((v) => (
                <tr key={v._id}>
                  <td>
                    <span className="admin-vendors__name">{v.shopName || v.name}</span>
                    {v.shopName && <span className="admin-vendors__sub">{v.name}</span>}
                  </td>
                  <td className="admin-vendors__email">{v.email}</td>
                  <td>
                    <span className={`admin-vendors__badge admin-vendors__badge--${v.vendorStatus}`}>
                      {STATUS_LABEL[v.vendorStatus] || v.vendorStatus}
                    </span>
                  </td>
                  <td className="admin-vendors__actions">
                    {v.vendorStatus !== "approved" && (
                      <button
                        type="button"
                        className="admin-vendors__btn admin-vendors__btn--approve"
                        disabled={isLoading}
                        onClick={() => handle(v._id, "approve")}
                      >
                        Aprobă
                      </button>
                    )}
                    {v.vendorStatus !== "rejected" && (
                      <button
                        type="button"
                        className="admin-vendors__btn admin-vendors__btn--reject"
                        disabled={isLoading}
                        onClick={() => handle(v._id, "reject")}
                      >
                        Respinge
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminVendors;
