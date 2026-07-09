import { MailIcon } from "./homeIcons";
import { useNewsletter } from "./useNewsletter";

const NewsletterSection = () => {
  const { email, setEmail, subscribed, handleSubscribe } = useNewsletter();

  return (
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
  );
};

export default NewsletterSection;
