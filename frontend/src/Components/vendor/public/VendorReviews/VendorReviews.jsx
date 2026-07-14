import { useReducer } from "react";
import { useSelector } from "react-redux";
import { useGetVendorReviewsQuery, useAddVendorReviewMutation } from "../../../../features/vendor/rtkVendor";
import Stars from "../../../products/singleProducts/Stars";
import StarPicker from "../../../products/singleProducts/sections/StarPicker";
import "./VendorReviews.css";

const initial = { star: 0, comment: "", err: "", submitting: false };
const reducer = (s, a) => {
  switch (a.type) {
    case "STAR":    return { ...s, star: a.v, err: "" };
    case "COMMENT": return { ...s, comment: a.v };
    case "ERR":     return { ...s, err: a.v, submitting: false };
    case "SUBMIT":  return { ...s, submitting: true, err: "" };
    case "DONE":    return initial;
    default:        return s;
  }
};

const formatDate = (iso) => new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "short", year: "numeric" });
const truncName  = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
};

const VendorReviews = ({ vendorId }) => {
  const user  = useSelector((s) => s.auth.user);
  const [form, dispatch] = useReducer(reducer, initial);

  const { data, isLoading } = useGetVendorReviewsQuery(vendorId, { skip: !vendorId });
  const [addReview] = useAddVendorReviewMutation();

  const reviews    = data?.reviews ?? [];
  const userReview = reviews.find((r) => r.user?._id === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.star) return dispatch({ type: "ERR", v: "Selectează un rating." });
    dispatch({ type: "SUBMIT" });
    try {
      await addReview({ vendorId, value: form.star, comment: form.comment }).unwrap();
      dispatch({ type: "DONE" });
    } catch (err) {
      dispatch({ type: "ERR", v: err?.data?.message ?? "Eroare la trimitere." });
    }
  };

  return (
    <section className="vr">
      <h2 className="vr__title">Recenzii vânzător</h2>

      {isLoading ? (
        <div className="vr__loading">Se încarcă recenziile...</div>
      ) : reviews.length === 0 ? (
        <p className="vr__empty">Fii primul care lasă o recenzie.</p>
      ) : (
        <div className="vr__list">
          {reviews.map((r) => (
            <div key={r._id} className="vr__item">
              <div className="vr__item-top">
                <Stars value={r.value} size={15} />
                <span className="vr__item-name">{truncName(r.user?.name)}</span>
                <span className="vr__item-date">{formatDate(r.createdAt)}</span>
              </div>
              {r.comment && <p className="vr__item-comment">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}

      <div className="vr__form-wrap">
        <h3 className="vr__form-title">Lasă o recenzie</h3>

        {!user ? (
          <p className="vr__auth-msg">Autentifică-te pentru a lăsa o recenzie.</p>
        ) : userReview ? (
          <p className="vr__already">Ai lăsat deja o recenzie pentru acest vânzător.</p>
        ) : (
          <form className="vr__form" onSubmit={handleSubmit}>
            <div className="vr__form-row">
              <label className="vr__label">Rating</label>
              <StarPicker value={form.star} onChange={(v) => dispatch({ type: "STAR", v })} />
            </div>
            <div className="vr__form-row">
              <label className="vr__label" htmlFor="vr-comment">Comentariu</label>
              <textarea
                id="vr-comment"
                className="vr__textarea"
                rows={3}
                maxLength={500}
                placeholder="Experiența ta cu acest vânzător..."
                value={form.comment}
                onChange={(e) => dispatch({ type: "COMMENT", v: e.target.value })}
              />
            </div>
            {form.err && <p className="vr__err">{form.err}</p>}
            <button type="submit" className="vr__submit" disabled={form.submitting}>
              {form.submitting ? "Se trimite..." : "Trimite recenzia"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default VendorReviews;
