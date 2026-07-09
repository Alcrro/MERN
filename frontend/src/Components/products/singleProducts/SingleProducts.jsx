import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetSingleProductQuery,
  useGetReviewsQuery,
  useAddReviewMutation,
  useDeleteReviewMutation,
} from "../../../features/product/rtkProducts";
import { addToCart } from "../../../features/product/addToCart/addToCartSlice";
import "./singleProduct.css";
import pandaImg from "../../../Assets/images/panda.png";

/* ─── per-kind specs ──────────────────────────────────────── */
const getSpecs = (p) => {
  switch (p.kind) {
    case "Electronics":
      return [
        { label: "Brand",          value: p.brand,          icon: "🏷️" },
        p.tip        && { label: "Tip",          value: p.tip,        icon: "📦" },
        { label: "Model",          value: p.model,          icon: "📱" },
        p.stocare    && { label: "Stocare",      value: p.stocare,    icon: "💾" },
        p.RAM        && { label: "RAM",          value: p.RAM,        icon: "⚡" },
        p.procesor   && { label: "Procesor",     value: p.procesor,   icon: "🔧" },
        p.GPU        && { label: "GPU",          value: p.GPU,        icon: "🎮" },
        p.display    && { label: "Display",      value: p.display,    icon: "🖥️" },
        p.camera     && { label: "Cameră",       value: p.camera,     icon: "📷" },
        p.baterie    && { label: "Baterie",      value: p.baterie,    icon: "🔋" },
        p.OS         && { label: "OS",           value: p.OS,         icon: "💻" },
        p.conectivitate && { label: "Conectivitate", value: p.conectivitate, icon: "📡" },
      ].filter(Boolean);
    case "Furniture":
      return [
        { label: "Brand",      value: p.brand,              icon: "🏷️" },
        { label: "Nume",       value: p.name,               icon: "🛋️" },
        p.material   && { label: "Material",   value: p.material,   icon: "🪵" },
        p.dimensiuni && { label: "Dimensiuni", value: p.dimensiuni, icon: "📐" },
        p.culoare    && { label: "Culoare",    value: p.culoare,    icon: "🎨" },
        p.stil       && { label: "Stil",       value: p.stil,       icon: "✨" },
        p.nrLocuri   && { label: "Nr. locuri", value: String(p.nrLocuri), icon: "🪑" },
      ].filter(Boolean);
    case "HomeGarden":
      return [
        { label: "Brand",      value: p.brand,              icon: "🏷️" },
        { label: "Nume",       value: p.name,               icon: "🏡" },
        p.material   && { label: "Material",   value: p.material,   icon: "🪵" },
        p.dimensiuni && { label: "Dimensiuni", value: p.dimensiuni, icon: "📐" },
        p.culoare    && { label: "Culoare",    value: p.culoare,    icon: "🎨" },
        p.tip        && { label: "Tip",        value: p.tip,        icon: "🔖" },
      ].filter(Boolean);
    default:
      return [
        { label: "Brand", value: p.brand, icon: "🏷️" },
        (p.model || p.name) && { label: "Model / Nume", value: p.model || p.name, icon: "📦" },
        p.stocare && { label: "Stocare", value: p.stocare, icon: "💾" },
      ].filter(Boolean);
  }
};

const getHowto = (kind) => {
  if (kind === "Electronics") return [
    { icon: "1", title: "Despachetați cu grijă", body: "Scoateți produsul din ambalaj și verificați că toate accesoriile sunt prezente: cablu, încărcător, documentație." },
    { icon: "2", title: "Prima pornire", body: "Conectați la sursă de alimentare sau încărcați bateria înainte de prima utilizare. Urmați pașii de configurare inițială." },
    { icon: "3", title: "Actualizați software-ul", body: "Accesați setările și instalați toate actualizările disponibile pentru a beneficia de cele mai noi funcții și corecții de securitate." },
    { icon: "4", title: "Personalizați și bucurați-vă", body: "Configurați conturile, instalați aplicațiile necesare și ajustați setările după preferințele dumneavoastră." },
  ];
  if (kind === "Furniture") return [
    { icon: "1", title: "Verificați coletul", body: "La primire, verificați că ambalajul nu este deteriorat și că toate piesele sunt prezente conform listei din manualul de asamblare." },
    { icon: "2", title: "Pregătiți sculele", body: "De obicei aveți nevoie de cheie Allen și șurubelniță. Toate sculele necesare sunt incluse în pachet." },
    { icon: "3", title: "Urmați instrucțiunile", body: "Respectați ordinea pașilor din manual. Nu strângeți șuruburile complet până când toate piesele sunt montate." },
    { icon: "4", title: "Finalizați și bucurați-vă", body: "Strângeți toate șuruburile, verificați stabilitatea mobilierului și bucurați-vă de noua achiziție!" },
  ];
  if (kind === "HomeGarden") return [
    { icon: "1", title: "Verificați conținutul", body: "Deschideți ambalajul cu grijă și verificați că toate componentele sunt prezente și în stare bună." },
    { icon: "2", title: "Citiți instrucțiunile", body: "Parcurgeți manualul de utilizare înainte de instalare sau folosire pentru a evita erorile comune." },
    { icon: "3", title: "Instalați sau montați", body: "Urmați pașii din instrucțiuni. Dacă produsul necesită fixare, folosiți materiale adecvate pentru suprafața dumneavoastră." },
    { icon: "4", title: "Întreținere periodică", body: "Curățați produsul conform recomandărilor producătorului pentru a-i prelungi durata de viață." },
  ];
  return [
    { icon: "1", title: "Verificați coletul", body: "La primire verificați că ambalajul nu este deteriorat și că toate componentele sunt prezente conform specificațiilor din colet." },
    { icon: "2", title: "Citiți instrucțiunile", body: "Parcurgeți manualul de utilizare furnizat înainte de prima folosire pentru o experiență optimă și în siguranță." },
    { icon: "3", title: "Configurați produsul", body: "Urmați pașii de instalare sau configurare indicați în documentație. Contactați suportul dacă întâmpinați dificultăți." },
    { icon: "4", title: "Întreținere și garanție", body: "Păstrați documentele de garanție. Curățați și întreținuți produsul conform recomandărilor producătorului." },
  ];
};

/* ─── constants ───────────────────────────────────────────── */
const AVAIL_COLOR = {
  "In Stoc":      { bg: "#d1fae5", color: "#065f46" },
  "Nou":          { bg: "#dbeafe", color: "#1d4ed8" },
  "Promotii":     { bg: "#fef3c7", color: "#92400e" },
  "Resigilat":    { bg: "#ede9fe", color: "#5b21b6" },
  "Precomanda":   { bg: "#fef3c7", color: "#92400e" },
  "Stoc Epuizat": { bg: "#fee2e2", color: "#991b1b" },
};
const DEMO_COLORS = [
  { name: "Negru", hex: "#1c1c1e" },
  { name: "Alb",   hex: "#f5f5f0" },
  { name: "Albastru", hex: "#2563eb" },
];
const AVATAR_BG = ["#2563eb","#059669","#d97706","#7c3aed","#db2777","#0891b2"];
/* ─── small helpers ───────────────────────────────────────── */
const avatarColor = (name = "") => AVATAR_BG[name.charCodeAt(0) % AVATAR_BG.length];
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("ro-RO", { day: "numeric", month: "long", year: "numeric" });
const deliveryDate = () => {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return d.toLocaleDateString("ro-RO", { weekday: "long", day: "numeric", month: "long" });
};

/* ─── sub-components ──────────────────────────────────────── */
const Stars = ({ value, size = 17 }) => (
  <span className="sp-stars" style={{ "--sz": `${size}px` }}>
    <span className="sp-stars-empty">★★★★★</span>
    <span className="sp-stars-fill" style={{ width: `${((value / 5) * 100).toFixed(1)}%` }}>★★★★★</span>
  </span>
);

const StarPicker = ({ value, onChange }) => (
  <div className="sp-star-picker">
    {[1, 2, 3, 4, 5].map((n) => (
      <button key={n} type="button"
        className={`sp-pick-star${n <= value ? " on" : ""}`}
        onClick={() => onChange(n)}>★</button>
    ))}
  </div>
);

/* collapsible section wrapper */
const Section = ({ id, sectionRef, title, collapsedH = 160, children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="sp-section" id={id} ref={sectionRef}>
      <div className="sp-section-body" style={{ "--ch": `${collapsedH}px` }}
        data-expanded={expanded}>
        {children}
        {!expanded && <div className="sp-section-fade" />}
      </div>
      <button className="sp-expand-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? "Arată mai puțin ▲" : "Citește mai mult ▼"}
      </button>
    </div>
  );
};

/* ─── main component ──────────────────────────────────────── */
const SingleProducts = () => {
  const { id }    = useParams();
  const dispatch  = useDispatch();
  const authUser  = useSelector((s) => s.auth.user);

  const [added,      setAdded]      = useState(false);
  const [selColor,   setSelColor]   = useState(0);
  const [activeTab,  setActiveTab]  = useState("descriere");
  const [starValue,  setStarValue]  = useState(0);
  const [comment,    setComment]    = useState("");
  const [formErr,    setFormErr]    = useState("");
  const [submitting, setSubmitting] = useState(false);

  const descriereRef    = useRef(null);
  const specificatiiRef = useRef(null);
  const howtoRef        = useRef(null);
  const recenziiRef     = useRef(null);
  const navRef          = useRef(null);

  const refs = useMemo(() => ({
    descriere:    descriereRef,
    specificatii: specificatiiRef,
    howto:        howtoRef,
    recenzii:     recenziiRef,
  }), []);

  const { data: pd, isLoading: pLoad } = useGetSingleProductQuery(id);
  const { data: rd, isLoading: rLoad } = useGetReviewsQuery(id);
  const [addReview]    = useAddReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();

  /* ── scroll spy ─────────────────────────────────────────── */
  const handleScroll = useCallback(() => {
    const offset = (navRef.current?.offsetHeight ?? 48) + 34 + 66 + 44 + 8;
    const keys = ["descriere", "specificatii", "howto", "recenzii"];
    let current = "descriere";
    for (const key of keys) {
      const el = refs[key].current;
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) current = key;
    }
    setActiveTab(current);
  }, [refs]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  /* ── scroll to section ───────────────────────────────────── */
  const scrollTo = (key) => {
    const el = refs[key].current;
    if (!el) return;
    const offset = (navRef.current?.offsetHeight ?? 48) + 34 + 66 + 44 + 8;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveTab(key);
  };

  /* ── loading ─────────────────────────────────────────────── */
  if (pLoad) return (
    <div className="sp-page">
      <div className="sp-hero-skel">
        <div className="sk sk-img" />
        <div className="sk-col"><div className="sk sk-chip" /><div className="sk sk-h1" /><div className="sk sk-stars" /><div className="sk sk-line" /><div className="sk sk-line w60" /></div>
        <div className="sk-col"><div className="sk sk-price" /><div className="sk sk-btn" /><div className="sk sk-btn op6" /></div>
      </div>
    </div>
  );

  if (!pd?.product) return (
    <div className="sp-page sp-err">
      <div className="sp-err-icon">🔍</div>
      <h2>Produsul nu a fost găsit</h2>
      <Link to="/products" className="sp-btn-primary">← Înapoi la produse</Link>
    </div>
  );

  const p           = pd.product;
  const productName = p.model || p.name || p.brand;
  const reviews     = rd?.reviews ?? [];
  const avail   = p.stock?.availability;
  const qty     = p.stock?.quantity ?? 0;
  const aStyle  = AVAIL_COLOR[avail] || AVAIL_COLOR["In Stoc"];
  const isOut   = avail === "Stoc Epuizat" || qty === 0;
  const isPromo = avail === "Promotii";
  const price   = p.price ?? 0;
  const fmtP    = price.toLocaleString("ro-RO");
  const avg     = p.rating?.average ?? 0;
  const rcount  = p.rating?.count ?? 0;
  const discount    = isPromo ? Math.round(price * 0.1) : 0;
  const finalPrice  = price - discount;
  const fmtFinal    = finalPrice.toLocaleString("ro-RO");
  const alreadyReviewed = authUser
    ? reviews.some((r) => r.user?._id === authUser.id || r.user?.id === authUser.id)
    : false;
  const breakdown = [5, 4, 3, 2, 1].map((s) => ({
    star: s, count: reviews.filter((r) => r.value === s).length,
  }));

  const TABS = [
    { key: "descriere",    label: "Descriere" },
    { key: "specificatii", label: "Specificații" },
    { key: "howto",        label: "Cum se folosește" },
    { key: "recenzii",     label: `Recenzii${rcount > 0 ? ` (${rcount})` : ""}` },
  ];

  const handleCart = () => {
    dispatch(addToCart({ data: p }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2200);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!starValue)      { setFormErr("Selectează un rating."); return; }
    if (!comment.trim()) { setFormErr("Scrie un comentariu."); return; }
    setFormErr(""); setSubmitting(true);
    try {
      await addReview({ productId: id, value: starValue, comment: comment.trim() }).unwrap();
      setStarValue(0); setComment("");
    } catch (err) {
      setFormErr(err?.data?.error || "Eroare. Încearcă din nou.");
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm("Ștergi această recenzie?")) return;
    await deleteReview({ reviewId, productId: id });
  };

  return (
    <div className="sp-page">

      {/* breadcrumb */}
      <nav className="sp-bc">
        <Link to="/">Acasă</Link><span>/</span>
        <Link to="/products">Produse</Link><span>/</span>
        <Link to={`/products?brand=${p.brand}`}>{p.brand}</Link><span>/</span>
        <span className="sp-bc-cur">{productName}</span>
      </nav>

      {/* ══ HERO 3-col ══ */}
      <section className="sp-hero">

        {/* ① image */}
        <div className="sp-img-wrap">
          {avail && (
            <span className="sp-avail" style={{ background: aStyle.bg, color: aStyle.color }}>
              {avail}
            </span>
          )}
          <div className="sp-img-inner">
            <img src={pandaImg} alt={`${p.brand} ${productName}`} />
          </div>
        </div>

        {/* ② details */}
        <div className="sp-details">
          <div className="sp-chips">
            <span className="sp-chip-brand">{p.brand}</span>
          </div>
          <h1 className="sp-title">{p.brand} {productName}</h1>
          {avg > 0 && (
            <div className="sp-rating-row">
              <Stars value={avg} size={17} />
              <span className="sp-avg-num">{avg.toFixed(1)}</span>
              <button className="sp-rev-link" onClick={() => scrollTo("recenzii")}>
                {rcount} {rcount === 1 ? "recenzie" : "recenzii"}
              </button>
            </div>
          )}
          <div className="sp-sep" />
          {p.stocare && (
            <div className="sp-variant-group">
              <span className="sp-variant-label">Stocare</span>
              <div className="sp-variant-chips">
                <button className="sp-vchip sp-vchip--on">{p.stocare}</button>
              </div>
            </div>
          )}
          <div className="sp-variant-group">
            <span className="sp-variant-label">Culoare: <strong>{DEMO_COLORS[selColor].name}</strong></span>
            <div className="sp-colors">
              {DEMO_COLORS.map((c, i) => (
                <button key={i} className={`sp-color${selColor === i ? " sp-color--on" : ""}`}
                  style={{ background: c.hex }} onClick={() => setSelColor(i)} title={c.name} />
              ))}
            </div>
          </div>
          <div className="sp-sep" />
          <div className="sp-delivery">
            <div className="sp-del-row">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              <div><span className="sp-del-title">Livrare gratuită</span><span className="sp-del-sub">Ajunge la tine: <strong>{deliveryDate()}</strong></span></div>
            </div>
            <div className="sp-del-row">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              <div><span className="sp-del-title">Retur gratuit 30 zile</span><span className="sp-del-sub">Fără întrebări</span></div>
            </div>
            <div className="sp-del-row">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div><span className="sp-del-title">Garanție 24 luni</span><span className="sp-del-sub">Produse originale cu factură</span></div>
            </div>
          </div>
          <div className="sp-stock">
            {isOut ? <span className="sp-s-out">✕ Stoc epuizat</span>
              : qty <= 3 ? <span className="sp-s-low">⚠ Ultimele {qty} bucăți</span>
              : <span className="sp-s-ok">✓ În stoc</span>}
          </div>
        </div>

        {/* ③ price panel */}
        <div className="sp-price-panel">
          <div className="sp-price-box">
            <div className="sp-prow">
              <span className="sp-plabel">Preț</span>
              <span className="sp-pval">{fmtP} RON</span>
            </div>
            {discount > 0 && (
              <div className="sp-prow sp-prow--discount">
                <span className="sp-plabel">Reducere (10%)</span>
                <span className="sp-pval sp-pval--discount">−{discount.toLocaleString("ro-RO")} RON</span>
              </div>
            )}
            <div className="sp-pdivider" />
            <div className="sp-prow sp-prow--total">
              <span className="sp-plabel-total">Total</span>
              <span className="sp-pval-total">{discount > 0 ? fmtFinal : fmtP} RON</span>
            </div>
          </div>
          <div className="sp-cta">
            <button
              className={`sp-btn-primary${added ? " sp-btn-primary--done" : ""}`}
              onClick={handleCart} disabled={isOut}>
              {added
                ? <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Adăugat în coș</>
                : <><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Adaugă în coș</>}
            </button>
            <button className="sp-btn-outline">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              Adaugă la favorite
            </button>
          </div>
          <div className="sp-mini-trust">
            <span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Plată securizată</span>
            <span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Produs original</span>
            <span><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6 6l.86-.86a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 21.73 16.92z"/></svg>Suport 24/7</span>
          </div>
        </div>
      </section>

      {/* ══ STICKY NAV ══ */}
      <nav className="sp-tabs-bar" ref={navRef}>
        <div className="sp-tabs-inner">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              className={`sp-tab${activeTab === key ? " sp-tab--active" : ""}`}
              onClick={() => scrollTo(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>

      {/* ══ SECTIONS ══ */}
      <div className="sp-sections">

        {/* descriere */}
        <Section id="descriere" sectionRef={refs.descriere} collapsedH={120}>
          <h2 className="sp-sec-title">Descriere</h2>
          <p className="sp-desc">{p.description || `${p.brand} ${productName} — produs de calitate superioară.`}</p>
        </Section>

        {/* specificatii */}
        <Section id="specificatii" sectionRef={refs.specificatii} collapsedH={220}>
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

        {/* how to use */}
        <Section id="howto" sectionRef={refs.howto} collapsedH={180}>
          <h2 className="sp-sec-title">Cum se folosește</h2>
          <div className="sp-howto-grid">
            {getHowto(p.kind).map((step) => (
              <div key={step.icon} className="sp-howto-card">
                <span className="sp-howto-num">{step.icon}</span>
                <div>
                  <strong className="sp-howto-t">{step.title}</strong>
                  <p className="sp-howto-b">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* recenzii */}
        <Section id="recenzii" sectionRef={refs.recenzii} collapsedH={320}>
          <h2 className="sp-sec-title">
            Recenzii clienți
            {rcount > 0 && <span className="sp-sec-badge">{rcount}</span>}
          </h2>

          {/* rating summary */}
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

          {/* add review */}
          {authUser && !alreadyReviewed && (
            <div className="sp-rev-form-wrap">
              <h3 className="sp-rev-form-title">Adaugă recenzia ta</h3>
              <form className="sp-rev-form" onSubmit={handleSubmit}>
                <div className="sp-fg">
                  <label className="sp-fl">Rating</label>
                  <StarPicker value={starValue} onChange={setStarValue} />
                </div>
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
            <div className="sp-already">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              Ai lăsat deja o recenzie pentru acest produs.
            </div>
          )}
          {!authUser && (
            <div className="sp-login-p">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              <span><Link to="/login" className="sp-ll">Conectează-te</Link> pentru a lăsa o recenzie.</span>
            </div>
          )}

          {/* list */}
          {rLoad ? (
            <div className="sp-rskel-wrap">
              {[1, 2, 3].map((i) => (
                <div key={i} className="sp-rskel">
                  <div className="sk sp-skel-av" />
                  <div className="sp-rskel-col"><div className="sk sp-skel-rn" /><div className="sk sp-skel-rs" /><div className="sk sp-skel-rt" /></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="sp-rev-list">
              {reviews.map((rev) => {
                const name  = rev.user?.name || "Anonim";
                const isOwn = authUser &&
                  (rev.user?._id === authUser.id || rev.user?.id === authUser.id);
                return (
                  <div key={rev._id} className="sp-rev-card">
                    <div className="sp-rh">
                      <div className="sp-av" style={{ background: avatarColor(name) }}>
                        {name[0].toUpperCase()}
                      </div>
                      <div className="sp-rm">
                        <span className="sp-rname">{name}</span>
                        <span className="sp-rdate">{fmtDate(rev.createdAt)}</span>
                      </div>
                      {isOwn && (
                        <button className="sp-rdel" onClick={() => handleDelete(rev._id)}>
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6M9 6V4h6v2"/></svg>
                        </button>
                      )}
                    </div>
                    <Stars value={rev.value} size={14} />
                    {rev.comment && <p className="sp-rcomment">{rev.comment}</p>}
                  </div>
                );
              })}
            </div>
          ) : null}
        </Section>

      </div>
    </div>
  );
};

export default SingleProducts;
