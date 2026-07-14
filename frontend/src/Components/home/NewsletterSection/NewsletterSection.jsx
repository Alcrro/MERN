import { MailIcon } from "../homeIcons";
import { useNewsletter } from "./useNewsletter";

const NewsletterSection = () => {
  const { email, setEmail, subscribed, handleSubscribe, isLoading, error } = useNewsletter();

  return (
    <section className="home-newsletter" aria-label="Newsletter">
      <div className="home-newsletter__inner">
        <span className="home-newsletter__icon"><MailIcon /></span>
        <h2 className="home-newsletter__title">Fii primul care află ofertele</h2>
        <p className="home-newsletter__sub">
          Abonează-te și primești oferte exclusive, noutăți și prețuri speciale direct pe email.
        </p>
        {subscribed ? (
          <p className="home-newsletter__thanks">✓ Mulțumim! Verifică-ți emailul pentru confirmare.</p>
        ) : (
          <form className="home-newsletter__form" onSubmit={handleSubscribe}>
            <input
              type="email"
              placeholder="adresa@email.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="home-newsletter__input"
              aria-label="Adresa de email"
            />
            <button type="submit" disabled={isLoading} className="home-newsletter__btn">
              {isLoading ? "Se trimite…" : "Abonează-te"}
            </button>
          </form>
        )}
        {error && (
          <p className="home-newsletter__error">
            {error?.data?.message || "Ceva nu a mers. Încearcă din nou."}
          </p>
        )}
        <p className="home-newsletter__notice">Fără spam. Te poți dezabona oricând.</p>
      </div>
    </section>
  );
};

export default NewsletterSection;
