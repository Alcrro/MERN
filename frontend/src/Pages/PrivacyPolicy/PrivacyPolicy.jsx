import "./PrivacyPolicy.css";

const Section = ({ title, children }) => (
  <section className="privacy__section">
    <h2 className="privacy__h2">{title}</h2>
    {children}
  </section>
);

const PrivacyPolicy = () => (
  <div className="privacy">
    <div className="privacy__inner">
      <header className="privacy__header">
        <p className="privacy__label">Politică de confidențialitate</p>
        <h1 className="privacy__title">Cum utilizăm datele tale</h1>
        <p className="privacy__meta">Ultima actualizare: iulie 2026 · alcrro.ro</p>
      </header>

      <Section title="1. Cine suntem">
        <p>
          Operatorul de date cu caracter personal este <strong>alcrro.ro</strong>,
          magazin online de telefoane și accesorii.
          Ne poți contacta la <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>.
        </p>
      </Section>

      <Section title="2. Ce date colectăm și de ce">
        <table className="privacy__table">
          <thead>
            <tr>
              <th>Tip de date</th>
              <th>Scop</th>
              <th>Temei legal</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Adresă de email (newsletter)</td>
              <td>Trimiterea de oferte și noutăți</td>
              <td>Consimțământ (art. 6(1)(a) GDPR)</td>
            </tr>
            <tr>
              <td>Nume, adresă de livrare, telefon</td>
              <td>Procesarea comenzilor</td>
              <td>Contract (art. 6(1)(b) GDPR)</td>
            </tr>
            <tr>
              <td>Email și parolă (cont)</td>
              <td>Autentificare și gestionarea contului</td>
              <td>Contract (art. 6(1)(b) GDPR)</td>
            </tr>
            <tr>
              <td>Date de navigare (cookies tehnice)</td>
              <td>Funcționarea corectă a site-ului</td>
              <td>Interes legitim (art. 6(1)(f) GDPR)</td>
            </tr>
          </tbody>
        </table>
      </Section>

      <Section title="3. Newsletter">
        <p>
          Dacă te abonezi la newsletter, stocăm adresa ta de email în baza noastră de date.
          Folosim acest email exclusiv pentru a-ți trimite oferte, noutăți și promoții alcrro.
        </p>
        <p>
          <strong>Te poți dezabona oricând</strong> folosind linkul „Dezabonează-te" din
          orice email primit sau scriindu-ne la{" "}
          <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>.
          La dezabonare, adresa ta este marcată inactivă și nu mai primești comunicări.
        </p>
      </Section>

      <Section title="4. Cât timp păstrăm datele">
        <ul className="privacy__list">
          <li><strong>Email newsletter</strong> — până la dezabonare, apoi marcat inactiv</li>
          <li><strong>Date cont</strong> — pe durata existenței contului</li>
          <li><strong>Date comenzi</strong> — 5 ani conform obligațiilor contabile</li>
        </ul>
      </Section>

      <Section title="5. Cui transmitem datele">
        <p>
          Nu vindem și nu închiriem datele tale. Le partajăm doar cu furnizorii strict
          necesari funcționării serviciului:
        </p>
        <ul className="privacy__list">
          <li><strong>Resend</strong> — trimiterea emailurilor (newsletter și tranzacționale)</li>
          <li><strong>Cloudinary</strong> — stocarea imaginilor de produs</li>
          <li><strong>MongoDB Atlas</strong> — baza de date (server UE)</li>
        </ul>
        <p>Toți furnizorii respectă GDPR și au contracte de procesare a datelor semnate.</p>
      </Section>

      <Section title="6. Drepturile tale">
        <ul className="privacy__list">
          <li><strong>Acces</strong> — poți solicita oricând o copie a datelor tale</li>
          <li><strong>Rectificare</strong> — poți corecta datele incorecte</li>
          <li><strong>Ștergere</strong> — poți cere ștergerea datelor („dreptul de a fi uitat")</li>
          <li><strong>Portabilitate</strong> — poți primi datele într-un format structurat</li>
          <li><strong>Opoziție</strong> — poți obiecta față de prelucrarea bazată pe interes legitim</li>
          <li><strong>Retragerea consimțământului</strong> — oricând, fără a afecta prelucrările anterioare</li>
        </ul>
        <p>
          Pentru orice solicitare, scrie la <a href="mailto:contact@alcrro.ro">contact@alcrro.ro</a>.
          Ai dreptul să depui plângere la{" "}
          <a href="https://www.dataprotection.ro" target="_blank" rel="noreferrer">ANSPDCP</a>{" "}
          dacă consideri că datele tale au fost prelucrate incorect.
        </p>
      </Section>

      <Section title="7. Securitate">
        <p>
          Parolele sunt criptate (bcrypt). Comunicarea cu serverul se face exclusiv prin HTTPS.
          Accesul la baza de date este restricționat și monitorizat.
        </p>
      </Section>

      <Section title="8. Modificări ale politicii">
        <p>
          Orice modificare va fi publicată pe această pagină cu data actualizării.
          Continuarea utilizării site-ului după modificări constituie acceptarea noii politici.
        </p>
      </Section>
    </div>
  </div>
);

export default PrivacyPolicy;
