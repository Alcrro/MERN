import { STATS } from "../../../utils/constants";

const HomeStats = () => (
  <section className="home-stats" aria-label="Statistici">
    <div className="home-stats__inner">
      {STATS.map((s) => (
        <div key={s.label} className="home-stats__item">
          <span className="home-stats__val">{s.value}</span>
          <span className="home-stats__label">{s.label}</span>
        </div>
      ))}
    </div>
  </section>
);

export default HomeStats;
