import "./SingleProductSkeleton.css";

const SingleProductSkeleton = () => (
  <div className="sp-page">

    {/* breadcrumb */}
    <div className="sp-skel-bc">
      <div className="sk sp-skel-bc__item" />
      <div className="sk sp-skel-bc__item sp-skel-bc__item--cur" />
    </div>

    {/* hero */}
    <div className="sp-hero-skel">
      <div className="sk sk-img" />
      <div className="sk-col">
        <div className="sk sk-chip" />
        <div className="sk sk-h1" />
        <div className="sk sk-stars" />
        <div className="sk sk-line" />
        <div className="sk sk-line w60" />
        <div className="sk sk-line w40" />
        <div className="sk sp-skel-del" />
      </div>
      <div className="sk-col">
        <div className="sk sk-price" />
        <div className="sk sk-btn" />
        <div className="sk sk-btn op6" />
      </div>
    </div>

    {/* vendor bar */}
    <div className="sk sp-skel-vib" />

    {/* tabs */}
    <div className="sp-skel-tabs">
      {[90, 80, 110, 70].map((w, i) => (
        <div key={i} className="sk sp-skel-tab" style={{ width: w }} />
      ))}
    </div>

    {/* descriere */}
    <div className="sp-skel-section">
      <div className="sk sp-skel-sec-title" />
      <div className="sk sk-line" />
      <div className="sk sk-line" />
      <div className="sk sk-line w60" />
    </div>

    {/* specificatii */}
    <div className="sp-skel-section">
      <div className="sk sp-skel-sec-title" />
      <div className="sp-skel-specs">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="sp-skel-spec-card">
            <div className="sk sp-skel-spec-icon" />
            <div className="sk sp-skel-spec-label" />
            <div className="sk sp-skel-spec-val" />
          </div>
        ))}
      </div>
    </div>

    {/* cum se foloseste */}
    <div className="sp-skel-section">
      <div className="sk sp-skel-sec-title" />
      <div className="sk sk-line" />
      <div className="sk sk-line w60" />
    </div>

    {/* recenzii */}
    <div className="sp-skel-section">
      <div className="sk sp-skel-sec-title" />
      <div className="sp-skel-reviews">
        {[0, 1, 2].map((i) => (
          <div key={i} className="sp-rskel">
            <div className="sk sp-skel-av" />
            <div className="sp-rskel-col">
              <div className="sk sp-skel-rn" />
              <div className="sk sp-skel-rs" />
              <div className="sk sp-skel-rt" />
            </div>
          </div>
        ))}
      </div>
    </div>

  </div>
);

export default SingleProductSkeleton;
