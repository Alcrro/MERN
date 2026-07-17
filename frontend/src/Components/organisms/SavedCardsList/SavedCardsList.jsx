import { useState } from "react";
import { useGetPaymentMethodsQuery } from "../../../features/paymentMethods/rtkPaymentMethods";
import SavedCardItem from "../../molecules/SavedCardItem";
import AddCardForm from "../AddCardForm";
import "./SavedCardsList.css";

const SavedCardsList = () => {
  const { data, isLoading, isError, refetch } = useGetPaymentMethodsQuery();
  const [showForm, setShowForm] = useState(false);

  const cards = data?.data ?? [];

  const handleSuccess = () => {
    refetch();
    setShowForm(false);
  };

  if (isLoading) return <p className="scl__status">Se încarcă…</p>;
  if (isError) return <p className="scl__status scl__status--error">Eroare la încărcarea cardurilor.</p>;

  return (
    <div className="scl">
      <div className="scl__toolbar">
        {!showForm && (
          <button type="button" className="scl__add-btn" onClick={() => setShowForm(true)}>
            + Adaugă card
          </button>
        )}
      </div>

      {showForm && (
        <AddCardForm onSuccess={handleSuccess} onCancel={() => setShowForm(false)} />
      )}

      {cards.length === 0 && !showForm && (
        <p className="scl__empty">Nu ai carduri salvate.</p>
      )}

      {cards.length > 0 && (
        <ul className="scl__list">
          {cards.map((pm) => (
            <li key={pm.id}>
              <SavedCardItem paymentMethod={pm} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SavedCardsList;
