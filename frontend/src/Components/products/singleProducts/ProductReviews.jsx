import { useState } from "react";
import { Link } from "react-router-dom";
import { useAddReviewMutation, useDeleteReviewMutation } from "../../../features/product/rtkProducts";
import Stars from "./Stars";
import StarPicker from "./StarPicker";
import { avatarColor, fmtDate } from "./singleProductUtils";
import { TrashSmIcon, LoginIcon, DoneIcon } from "./singleProductIcons";
import "./ProductReviews.css";

const ProductReviews = ({ reviews, isLoading, authUser, productId, avg, rcount }) => {
  const [starValue,  setStarValue]  = useState(0);
  const [comment,    setComment]    = useState("");
  const [formErr,    setFormErr]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [addReview]    = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  const alreadyReviewed = authUser
    ? reviews.some((r) => r.user?._id === authUser.id || r.user?.id === authUser.id)
    : false;

  const breakdown = [5, 4, 3, 2, 1].map((s) => ({
    star: s, count: reviews.filter((r) => r.value === s).length,
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!starValue)      { setFormErr("Selectează un rating."); return; }
    if (!comment.trim()) { setFormErr("Scrie un comentariu."); return; }
    setFormErr(""); setSubmitting(true);
    try {
      await addReview({ productId, value: starValue, comment: comment.trim() }).unwrap();
      setStarValue(0); setComment("");
    } catch (err) {
      setFormErr(err?.data?.error || "Eroare. Încearcă din nou.");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Ștergi această recenzie?")) return;
    await deleteReview({ reviewId, productId });
  };

  return (
    <>
      <h2 className="sp-sec-title">
        Recenzii clienți {rcount > 0 && <span className="sp-sec-badge">{rcount}</span>}
      </h2>

      {rcount > 0 && (
        <div className="sp-sum-inner">
          <div className="sp-sum-score">
            <span className="sp-big-score">{avg.toFixed(1)}</span>
            <Stars value={avg} size={20} />
            <span className="sp-score-sub">{rcount} {rcount === 1 ? "recenzie" : "recenzii"}</span>
          </div>
          <div className="sp-bars">
            {breakdown.map(({ star, count }) => {
              const pct = rcount ? Math.round((count / rcount) * 100) : 0;
              return (
                <div key={star} className="sp-bar-row">
                  <span className="sp-bar-lbl">{star}★</span>
                  <div className="sp-bar-track"><div className="sp-bar-fill" style={{ width: `${pct}%` }} /></div>
                  <span className="sp-bar-cnt">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {rcount === 0 && <p className="sp-no-rev">Fii primul care lasă o recenzie!</p>}
      <div className="sp-rev-divider" />

      {authUser && !alreadyReviewed && (
        <div className="sp-rev-form-wrap">
          <h3 className="sp-rev-form-title">Adaugă recenzia ta</h3>
          <form className="sp-rev-form" onSubmit={handleSubmit}>
            <div className="sp-fg"><label className="sp-fl">Rating</label><StarPicker value={starValue} onChange={setStarValue} /></div>
            <div className="sp-fg">
              <label className="sp-fl" htmlFor="rev-txt">Comentariu</label>
              <textarea id="rev-txt" className="sp-ta" rows={4} maxLength={500}
                placeholder="Descrie experiența ta cu acest produs..."
                value={comment} onChange={(e) => setComment(e.target.value)} />
              <span className="sp-char">{comment.length}/500</span>
            </div>
            {formErr && <p className="sp-ferr">{formErr}</p>}
            <button type="submit" className="sp-btn-primary sp-submit" disabled={submitting}>
              {submitting ? "Se trimite…" : "Trimite recenzia"}
            </button>
          </form>
        </div>
      )}
      {authUser && alreadyReviewed && (
        <div className="sp-already"><DoneIcon /> Ai lăsat deja o recenzie pentru acest produs.</div>
      )}
      {!authUser && (
        <div className="sp-login-p">
          <LoginIcon />
          <span><Link to="/login" className="sp-ll">Conectează-te</Link> pentru a lăsa o recenzie.</span>
        </div>
      )}

      {isLoading ? (
        <div className="sp-rskel-wrap">
          {[1, 2, 3].map((i) => (
            <div key={i} className="sp-rskel">
              <div className="sk sp-skel-av" />
              <div className="sp-rskel-col"><div className="sk sp-skel-rn" /><div className="sk sp-skel-rs" /><div className="sk sp-skel-rt" /></div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 && (
        <div className="sp-rev-list">
          {reviews.map((rev) => {
            const name  = rev.user?.name || "Anonim";
            const isOwn = authUser && (rev.user?._id === authUser.id || rev.user?.id === authUser.id);
            return (
              <div key={rev._id} className="sp-rev-card">
                <div className="sp-rh">
                  <div className="sp-av" style={{ background: avatarColor(name) }}>{name[0].toUpperCase()}</div>
                  <div className="sp-rm">
                    <span className="sp-rname">{name}</span>
                    <span className="sp-rdate">{fmtDate(rev.createdAt)}</span>
                  </div>
                  {isOwn && <button className="sp-rdel" onClick={() => handleDelete(rev._id)}><TrashSmIcon /></button>}
                </div>
                <Stars value={rev.value} size={14} />
                {rev.comment && <p className="sp-rcomment">{rev.comment}</p>}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default ProductReviews;
