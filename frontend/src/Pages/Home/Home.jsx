import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import {
  useGetProductsQuery,
  useGetCategoriesQuery,
} from "../../features/product/rtkProducts";
import Cards from "../../Components/products/cards/Cards";

/* ── Icons ──────────────────────────────────────────────────── */
const ChevLeft  = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevRight = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>;
const ArrowRight = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const TruckIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const ShieldIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><polyline points="9 12 11 14 15 10"/></svg>;
const ReturnIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 12a9 9 0 109-9M3 3v4h4"/></svg>;
const HeadsetIcon= () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/><path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>;
const MailIcon   = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;

const FEATURES = [
  { icon: <TruckIcon />,   title: "Livrare gratuită",  sub: "La comenzi peste 500 RON" },
  { icon: <ShieldIcon />,  title: "Plată securizată",  sub: "SSL 256-bit encryption" },
  { icon: <ReturnIcon />,  title: "Retur 30 zile",     sub: "Fără întrebări" },
  { icon: <HeadsetIcon />, title: "Suport 24/7",       sub: "0800 123 456" },
];

const STATS = [
  { value: "500+",  label: "Produse disponibile" },
  { value: "30+",   label: "Branduri de top" },
  { value: "12K+",  label: "Clienți mulțumiți" },
  { value: "4.9★",  label: "Rating mediu" },
];

/* ── Reusable carousel ──────────────────────────────────────── */
const CARD_W = 256;
const GAP    = 16;

const ProductCarousel = ({ title, linkTo, data, isLoading }) => {
  const ref = useRef(null);
  const scroll = (d) => ref.current?.scrollBy({ left: d * (CARD_W + GAP) * 2, behavior: "smooth" });

  return (
    <section className="home-carousel-section" aria-label={title}>
      <div className="section-header">
        <h2 className="section-title">{title}</h2>
        <Link to={linkTo} className="section-link">
          Vezi toate <ArrowRight />
        </Link>
      </div>

      {isLoading ? (
        <div className="carousel-viewport">
          <div className="carousel-track">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="carousel-item skeleton-card">
                <div className="skeleton-img skeleton-pulse" />
                <div className="skeleton-line skeleton-pulse" style={{ width: "75%" }} />
                <div className="skeleton-line skeleton-pulse" style={{ width: "45%" }} />
              </div>
            ))}
          </div>
        </div>
      ) : data?.length > 0 ? (
        <div className="carousel-wrapper">
          <button className="carousel-btn carousel-btn-prev" onClick={() => scroll(-1)} aria-label="Înapoi"><ChevLeft /></button>
          <div className="carousel-viewport" ref={ref}>
            <div className="carousel-track">
              {data.map((item, i) => (
                <div className="carousel-item" key={i}><Cards products={item} /></div>
              ))}
            </div>
          </div>
          <button className="carousel-btn carousel-btn-next" onClick={() => scroll(1)} aria-label="Înainte"><ChevRight /></button>
        </div>
      ) : null}
    </section>
  );
};

/* ── Skeleton for category cards ────────────────────────────── */
const CatSkeleton = () => (
  <div className="cat-card cat-card--skeleton">
    <div className="cat-card__icon skeleton-pulse" />
    <div className="skeleton-line skeleton-pulse" style={{ width: "60%", height: 12, borderRadius: 4 }} />
  </div>
);

/* ── Main Home component ─────────────────────────────────────── */
const Home = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: newest, isLoading: loadingNewest } = useGetProductsQuery({
    limit: 10, page: 1, sort: "Newest", brand: [], rating: [], model: [],
  });

  const { data: topRated, isLoading: loadingTop } = useGetProductsQuery({
    limit: 10, page: 1, sort: "-rating", brand: [], rating: [], model: [],
  });

  const { data: catData, isLoading: loadingCats } = useGetCategoriesQuery();
  const categories = catData?.categories ?? [];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) { setSubscribed(true); setEmail(""); }
  };

  return (
    <main className="home-page">

      {/* ── 1. Hero ── */}
      <section className="hero-section" aria-label="Hero">
        <div className="hero-content">
          <span className="hero-badge">Nou în 2026</span>
          <h1 className="hero-title">
            Cel mai bun<br />
            <span className="hero-highlight">smartphone</span><br />
            la prețul tău
          </h1>
          <p className="hero-subtitle">
            Descoperă cele mai noi telefoane din brandurile de top. Livrare
            gratuită, garanție 24 luni și retur în 30 de zile.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="hero-btn-primary">
              Explorează produsele <ArrowRight />
            </Link>
            <Link to="/products?availability=Promotii" className="hero-btn-secondary">
              Oferte zilnice
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card-float hero-card-1"><span>⭐ 4.9</span><span>Top Rated</span></div>
          <div className="hero-card-float hero-card-2"><TruckIcon /><span>Livrare gratuită</span></div>
          <div className="hero-image-placeholder">
            <img src={require("../../Assets/images/panda.png")} alt="Telefon de top" className="hero-img" />
          </div>
        </div>
      </section>

      {/* ── 2. Features strip ── */}
      <section className="features-strip" aria-label="Avantaje">
        <div className="features-inner">
          {FEATURES.map((f) => (
            <div className="feature-item" key={f.title}>
              <span className="feature-icon">{f.icon}</span>
              <div>
                <strong>{f.title}</strong>
                <p>{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. Categories ── */}
      {(loadingCats || categories.length > 0) && (
        <section className="home-section home-categories" aria-label="Categorii">
          <div className="section-header">
            <h2 className="section-title">Navighează după categorie</h2>
            <Link to="/products" className="section-link">Toate <ArrowRight /></Link>
          </div>
          <div className="cat-grid">
            {loadingCats
              ? [...Array(6)].map((_, i) => <CatSkeleton key={i} />)
              : categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/products?kind=${cat.kind}`}
                  className="cat-card"
                  aria-label={cat.label}
                >
                  <span className="cat-card__icon">{cat.icon}</span>
                  <span className="cat-card__label">{cat.label}</span>
                  <span className="cat-card__arrow"><ArrowRight /></span>
                </Link>
              ))}
          </div>
        </section>
      )}

      {/* ── 4. Produse recente carousel ── */}
      <div className="home-carousel-wrap home-carousel-wrap--blue">
        <div className="home-carousel-inner">
          <ProductCarousel
            title="Produse recente"
            linkTo="/products?sort=Newest"
            data={newest?.queryProducts}
            isLoading={loadingNewest}
          />
        </div>
      </div>

      {/* ── 5. Promo banner ── */}
      <section className="home-promo" aria-label="Oferte zilnice">
        <div className="home-promo__inner">
          <div className="home-promo__content">
            <span className="home-promo__tag">Limitat</span>
            <h2 className="home-promo__title">Oferte zilnice cu până la <em>40% reducere</em></h2>
            <p className="home-promo__sub">
              Stoc limitat — prețuri actualizate în fiecare zi la cele mai căutate modele.
            </p>
            <Link to="/products?availability=Promotii" className="home-promo__btn">
              Vezi ofertele <ArrowRight />
            </Link>
          </div>
          <div className="home-promo__decoration" aria-hidden>
            <span className="home-promo__circle home-promo__circle--1" />
            <span className="home-promo__circle home-promo__circle--2" />
            <span className="home-promo__badge">−40%</span>
          </div>
        </div>
      </section>

      {/* ── 6. Top vânzări carousel ── */}
      <div className="home-carousel-wrap home-carousel-wrap--purple">
        <div className="home-carousel-inner">
          <ProductCarousel
            title="Top vânzări"
            linkTo="/products?sort=-rating"
            data={topRated?.queryProducts}
            isLoading={loadingTop}
          />
        </div>
      </div>

      {/* ── 7. Stats ── */}
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

      {/* ── 8. Newsletter ── */}
      <section className="home-newsletter" aria-label="Newsletter">
        <div className="home-newsletter__inner">
          <span className="home-newsletter__icon"><MailIcon /></span>
          <h2 className="home-newsletter__title">Fii primul care află ofertele</h2>
          <p className="home-newsletter__sub">
            Abonează-te și primești oferte exclusive, noutăți și prețuri speciale direct pe email.
          </p>
          {subscribed ? (
            <p className="home-newsletter__thanks">✓ Mulțumim! Te-ai abonat cu succes.</p>
          ) : (
            <form className="home-newsletter__form" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="adresa@email.ro"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="home-newsletter__input"
                aria-label="Adresa de email"
              />
              <button type="submit" className="home-newsletter__btn">Abonează-te</button>
            </form>
          )}
          <p className="home-newsletter__notice">Fără spam. Te poți dezabona oricând.</p>
        </div>
      </section>

    </main>
  );
};

export default Home;
