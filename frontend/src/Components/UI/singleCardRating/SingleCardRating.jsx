import "./starRating.css";

const SingleCardRating = ({ data }) => {
  const average = data?.rating?.average ?? 0;
  const count = data?.rating?.count ?? 0;
  const width = `${(average / 5) * 100}%`;

  if (average === 0) return null;

  return (
    <>
      <div className="first-star-rating star-rating-read">
        <div className="star-rating-inner" style={{ width }} />
      </div>
      <span> {average.toFixed(1)} ({count})</span>
    </>
  );
};

export default SingleCardRating;
