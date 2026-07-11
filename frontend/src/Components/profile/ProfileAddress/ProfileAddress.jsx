import { useGetAddressesQuery, useDeleteAddressMutation } from "../../../features/address/rtkAddresses";

const ProfileAddress = () => {
  const { data, isLoading } = useGetAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const addresses = data?.addresses ?? [];

  if (isLoading) return <div className="prf-section"><p className="prf-loading">Se încarcă...</p></div>;

  return (
    <div className="prf-section">
      <h2 className="prf-sec-title">Adresele mele</h2>
      {addresses.length === 0 ? (
        <div className="prf-empty">
          <p>Nu ai nicio adresă salvată. Adaugă una la checkout.</p>
        </div>
      ) : (
        <div className="prf-addr-list">
          {addresses.map((addr) => (
            <div key={addr._id} className="prf-addr-card">
              <div className="prf-addr-card__info">
                <p className="prf-addr-card__line">{addr.street}</p>
                <p className="prf-addr-card__line">{addr.city}, jud. {addr.county}, {addr.zip}</p>
                <p className="prf-addr-card__line prf-addr-card__phone">{addr.phone}</p>
              </div>
              <button
                type="button"
                className="prf-addr-card__del"
                onClick={() => deleteAddress(addr._id)}
                aria-label="Șterge adresa"
              >
                Șterge
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileAddress;
