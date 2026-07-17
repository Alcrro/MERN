import "./Terms.css";

const Section = ({ title, children }) => (
  <section className="terms__section">
    <h2 className="terms__h2">{title}</h2>
    {children}
  </section>
);

const Terms = () => (
  <div className="terms">
    <div className="terms__inner">
      <header className="terms__header">
        <p className="terms__label">Termeni și Condiții</p>
        <h1 className="terms__title">Regulile utilizării serviciilor noastre</h1>
        <p className="terms__meta">Ultima actualizare: iulie 2026 · alcrro.ro</p>
      </header>

      <Section title="1. Acceptarea termenilor">
        <p>
          Prin accesarea și utilizarea site-ului <strong>alcrro.ro</strong>, ești de acord cu
          prezentii Termeni și Condiții. Dacă nu ești de acord, te rugăm să nu utilizezi serviciile noastre.
          Continuarea utilizării site-ului după modificarea termenilor constituie acceptarea noii versiuni.
        </p>
      </Section>

      <Section title="2. Produse și prețuri">
        <p>
          Ne rezervăm dreptul de a modifica prețurile și disponibilitatea produselor fără notificare
          prealabilă. Prețurile afișate includ TVA. Fotografiile produselor sunt orientative.
        </p>
        <p>
          În cazul în care un produs este afișat la un preț incorect din cauza unei erori tehnice,
          ne rezervăm dreptul de a anula comanda și de a informa clientul înainte de livrare.
        </p>
      </Section>

      <Section title="3. Plasarea comenzilor">
        <p>
          O comandă plasată pe alcrro.ro constituie o ofertă de cumpărare. Comanda este confirmată
          prin email după verificarea stocului și procesarea plății.
        </p>
        <ul className="terms__list">
          <li>Trebuie să ai cel puțin 18 ani sau acordul unui tutore legal</li>
          <li>Datele furnizate la comandă trebuie să fie corecte și complete</li>
          <li>O comandă poate fi anulată înainte de expediere prin <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a></li>
          <li>Confirmarea comenzii prin email nu garantează disponibilitatea stocului</li>
        </ul>
      </Section>

      <Section title="4. Livrare">
        <p>
          Livrăm în toată România prin curieri parteneri. Termenul estimat de livrare este de
          {" "}<strong>1–3 zile lucrătoare</strong> de la confirmarea comenzii.
        </p>
        <ul className="terms__list">
          <li>Costul livrării este afișat în coșul de cumpărături înainte de finalizare</li>
          <li>Livrarea gratuită se aplică pentru comenzi conform condițiilor afișate pe site</li>
          <li>alcrro.ro nu răspunde pentru întârzieri cauzate de curieri sau forță majoră</li>
          <li>La primire, verifică integritatea coletului înainte de a semna de primire</li>
        </ul>
      </Section>

      <Section title="5. Returnări și garanție">
        <p>
          Conform legislației române și europene (OUG nr. 34/2014), ai dreptul să returnezi orice
          produs în termen de <strong>14 zile calendaristice</strong> de la primire, fără a fi
          nevoie să oferi o justificare.
        </p>
        <ul className="terms__list">
          <li>Produsul trebuie returnat în ambalajul original, fără urme de utilizare</li>
          <li>Costul returnului este suportat de client dacă returnarea nu este din vina noastră</li>
          <li>Rambursarea se efectuează în maximum 14 zile de la primirea returnului</li>
          <li>Garanția legală este de 2 ani pentru toate produsele noi</li>
          <li>Defectele apărute din utilizare necorespunzătoare nu sunt acoperite de garanție</li>
        </ul>
      </Section>

      <Section title="6. Contul de utilizator">
        <p>
          Ești responsabil pentru confidențialitatea credențialelor contului tău. Ne rezervăm
          dreptul de a suspenda conturile care încalcă prezentii termeni, care sunt utilizate
          în mod abuziv sau care sunt implicate în activități frauduloase.
        </p>
        <p>
          Îți poți șterge contul oricând din secțiunea Profil → Setări sau scriindu-ne
          la <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>.
        </p>
      </Section>

      <Section title="7. Proprietate intelectuală">
        <p>
          Tot conținutul site-ului (texte, imagini, logo-uri, design, cod sursă) este proprietatea
          {" "}<strong>alcrro.ro</strong> sau a partenerilor noștri și este protejat de legislația
          drepturilor de autor. Reproducerea parțială sau integrală fără acordul scris este interzisă.
        </p>
      </Section>

      <Section title="8. Limitarea răspunderii">
        <p>
          alcrro.ro nu răspunde pentru daunele indirecte, incidentale sau consecutive rezultate
          din utilizarea sau imposibilitatea utilizării site-ului. Răspunderea totală față de
          client nu va depăși valoarea comenzii plasate.
        </p>
      </Section>

      <Section title="9. Legea aplicabilă">
        <p>
          Prezentii termeni sunt guvernați de legea română. Orice litigiu va fi soluționat
          pe cale amiabilă în primul rând. În caz de eșec, competente sunt instanțele din România.
        </p>
        <p>
          Pentru plângeri legate de comerțul online poți accesa platforma europeană{" "}
          <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer">ODR</a>{" "}
          sau contacta{" "}
          <a href="https://anpc.ro" target="_blank" rel="noreferrer">ANPC</a>.
          Pentru orice întrebări, scrie la{" "}
          <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>.
        </p>
      </Section>
    </div>
  </div>
);

export default Terms;
