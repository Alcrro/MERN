import { FEATURES } from "../homeIcons";

const FeaturesStrip = () => (
  <section className="features-strip" aria-label="Avantaje">
    <div className="features-inner">
      {FEATURES.map((f) => (
        <div className="feature-item" key={f.title}>
          <span className="feature-icon">{f.icon}</span>
          <div><strong>{f.title}</strong><p>{f.sub}</p></div>
        </div>
      ))}
    </div>
  </section>
);

export default FeaturesStrip;
