import Section from "./Section";
import ProductReviews from "./ProductReviews";
import { getSpecs } from "./singleProductUtils";
import "./ProductSections.css";

const ProductSections = ({ p, productName, sectionRefs, reviewData }) => (
  <div className="sp-sections">
    <Section id="descriere" sectionRef={sectionRefs.descriere} collapsedH={120}>
      <h2 className="sp-sec-title">Descriere</h2>
      <p className="sp-desc">{p.description || `${p.brand} ${productName} — produs de calitate superioară.`}</p>
    </Section>

    <Section id="specificatii" sectionRef={sectionRefs.specificatii} collapsedH={220}>
      <h2 className="sp-sec-title">Specificații tehnice</h2>
      <div className="sp-specs-grid">
        {getSpecs(p).map(({ label, value, icon }) => (
          <div key={label} className="sp-spec-card">
            <span className="sp-spec-icon">{icon}</span>
            <span className="sp-spec-label">{label}</span>
            <span className="sp-spec-value">{value}</span>
          </div>
        ))}
      </div>
    </Section>

    <Section id="howto" sectionRef={sectionRefs.howto} collapsedH={180}>
      <h2 className="sp-sec-title">Cum se folosește</h2>
      {p.howto?.length > 0 ? (
        <div className="sp-howto-grid">
          {p.howto.map((step, i) => (
            <div key={i} className="sp-howto-card">
              <span className="sp-howto-num">{i + 1}</span>
              <div>
                <strong className="sp-howto-t">{step.title}</strong>
                <p className="sp-howto-b">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="sp-no-rev">Instrucțiunile de utilizare vor fi disponibile în curând.</p>
      )}
    </Section>

    <Section id="recenzii" sectionRef={sectionRefs.recenzii} collapsedH={320}>
      <ProductReviews {...reviewData} />
    </Section>
  </div>
);

export default ProductSections;
