import "./GDPR.css";

const Section = ({ title, children }) => (
  <section className="gdpr__section">
    <h2 className="gdpr__h2">{title}</h2>
    {children}
  </section>
);

const RightCard = ({ title, desc, how }) => (
  <div className="gdpr__card">
    <h3 className="gdpr__card-title">{title}</h3>
    <p className="gdpr__card-desc">{desc}</p>
    {how && (
      <p className="gdpr__card-how">
        <span className="gdpr__card-how-label">Cum îl exerciți:</span> {how}
      </p>
    )}
  </div>
);

const RIGHTS = [
  {
    title: "Dreptul de acces",
    desc: "Poți solicita oricând o copie a datelor personale pe care le deținem despre tine, inclusiv scopul prelucrării și destinatarii.",
    how: "Trimite un email la contact@alcrro.ro cu subiectul 'Solicitare acces date'.",
  },
  {
    title: "Dreptul la rectificare",
    desc: "Dacă datele tale sunt incorecte sau incomplete, ai dreptul să soliciți corectarea lor fără întârzieri nejustificate.",
    how: "Actualizează datele din Profil → Informații sau contactează-ne prin email.",
  },
  {
    title: "Dreptul la ștergere",
    desc: "Poți solicita ștergerea datelor tale ('dreptul de a fi uitat') dacă nu există o obligație legală de păstrare (ex. date contabile).",
    how: "Trimite cererea la contact@alcrro.ro cu subiectul 'Solicitare ștergere date'.",
  },
  {
    title: "Dreptul la portabilitate",
    desc: "Poți solicita datele tale într-un format structurat, lizibil automat (JSON sau CSV), pentru a le transfera altui operator.",
    how: "Contactează-ne la contact@alcrro.ro cu subiectul 'Portabilitate date'.",
  },
  {
    title: "Dreptul la opoziție",
    desc: "Poți obiecta față de prelucrarea bazată pe interes legitim sau în scopuri de marketing direct, inclusiv profilare.",
    how: "Dezabonează-te din orice email sau trimite cererea la contact@alcrro.ro.",
  },
  {
    title: "Dreptul la restricționarea prelucrării",
    desc: "Poți solicita limitarea prelucrării datelor tale pe durata verificării exactității lor sau a unei opoziții.",
    how: "Contactează-ne la contact@alcrro.ro specificând motivul și perioada dorită.",
  },
  {
    title: "Retragerea consimțământului",
    desc: "Dacă prelucrarea se bazează pe consimțământul tău (ex. newsletter), îl poți retrage oricând fără a afecta legalitatea prelucrărilor anterioare.",
    how: "Folosește linkul 'Dezabonează-te' din orice email sau contactează-ne direct.",
  },
];

const GDPR = () => (
  <div className="gdpr">
    <div className="gdpr__inner">
      <header className="gdpr__header">
        <p className="gdpr__label">GDPR</p>
        <h1 className="gdpr__title">Drepturile tale asupra datelor personale</h1>
        <p className="gdpr__meta">Ultima actualizare: iulie 2026 · alcrro.ro</p>
      </header>

      <Section title="Ce este GDPR?">
        <p>
          Regulamentul General privind Protecția Datelor (GDPR — Regulamentul UE 2016/679)
          este legea europeană care protejează datele personale ale cetățenilor UE.
          Ca persoană vizată, ai drepturi clare asupra modului în care datele tale sunt
          colectate, stocate și utilizate.
        </p>
        <p>
          Mai jos găsești o descriere completă a drepturilor tale și modul în care le poți
          exercita față de <strong>alcrro.ro</strong>. Pentru detalii despre ce date colectăm
          și de ce, consultă{" "}
          <a href="/privacy">Politica de confidențialitate</a>.
        </p>
      </Section>

      <Section title="Drepturile tale">
        <div className="gdpr__cards">
          {RIGHTS.map((r) => (
            <RightCard key={r.title} {...r} />
          ))}
        </div>
      </Section>

      <Section title="Cum depui o solicitare">
        <p>
          Trimite un email la{" "}
          <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a> cu:
        </p>
        <ul className="gdpr__list">
          <li>Numele tău complet</li>
          <li>Adresa de email asociată contului</li>
          <li>Tipul de solicitare (acces, ștergere, rectificare etc.)</li>
          <li>Orice detalii relevante pentru identificarea datelor</li>
        </ul>
        <p>
          Putem solicita o metodă suplimentară de verificare a identității pentru a proteja
          datele tale de accesul neautorizat al terților.
        </p>
      </Section>

      <Section title="Termen de răspuns">
        <p>
          Răspundem tuturor solicitărilor în termen de{" "}
          <strong>30 de zile calendaristice</strong> conform art. 12 GDPR.
          În cazuri complexe, termenul poate fi prelungit cu maximum 60 de zile,
          cu notificarea ta prealabilă și motivarea întârzierii.
        </p>
        <p>
          Serviciul este gratuit. Dacă solicitările sunt vădit nefondate sau excesive,
          ne rezervăm dreptul de a percepe o taxă administrativă rezonabilă.
        </p>
      </Section>

      <Section title="Plângeri la autoritatea de supraveghere">
        <p>
          Dacă consideri că drepturile tale au fost încălcate și răspunsul nostru nu te
          satisface, ai dreptul să depui o plângere la ANSPDCP:
        </p>
        <ul className="gdpr__list">
          <li><strong>Site:</strong>{" "}<a href="https://www.dataprotection.ro" target="_blank" rel="noreferrer">dataprotection.ro</a></li>
          <li><strong>Email:</strong>{" "}<a href="mailto:anspdcp@dataprotection.ro">anspdcp@dataprotection.ro</a></li>
          <li><strong>Telefon:</strong> +40.318.059.211</li>
          <li><strong>Adresă:</strong> B-dul Magheru 28–30, Sector 1, București</li>
        </ul>
      </Section>
    </div>
  </div>
);

export default GDPR;
