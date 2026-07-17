# PRD: Checkout Payment — Opțiunea A (Integrală vs Rate)

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-16
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Step 3 din checkout (`CheckoutStepPayment.jsx`) oferă doar două opțiuni plate: „Plată cu cardul" și „Ramburs la livrare". Nu există nicio logică legată de rate — deși produsele din coș afișează deja badge-uri de rate (ex. „6 rate · 653 RON/lună"), clientul nu poate alege efectiv rate la plată.

**Pain point:** Clientul vede rate pe produs și în coș, dar la checkout nu există această opțiune. Fluxul actual permite și „Ramburs" chiar dacă coșul conține produse cu rate — ceea ce e incorect din punct de vedere business (banca procesează rata, nu curierul).

**Why now:** Badge-urile de rate sunt deja implementate vizual (`InstallmentWidget.jsx`). Lipsa selecției la plată face ca toată munca de UI informativ să nu aibă efect practic.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | să văd clar cele două căi de plată (integrală vs rate) la Step 3 | știu exact ce aleg înainte de a confirma |
| 2 | client | dacă aleg rate, să pot selecta banca și numărul de rate | știu ce sumă lunară plătesc |
| 3 | client | opțiunea „Ramburs" să fie blocată automat dacă aleg rate | nu pot face o eroare de flux |
| 4 | client | dacă niciun produs din coș nu suportă rate, să nu văd opțiunea rate | UI-ul să fie relevant pentru coșul meu |
| 5 | admin | să văd pe comandă ce metodă de plată + plan de rate a ales clientul | pot gestiona comenzile corect |

---

## Acceptance Criteria

- [ ] `#1` — Step 3 afișează două secțiuni distincte: „Plată integrală" și „Rate fără dobândă"
- [ ] `#1` — Dacă niciun produs din coș nu are `installmentOptions`, secțiunea „Rate" nu apare
- [ ] `#2` — La selectarea „Rate", apare un sub-formular cu selector bancă (BT, ING, Raiffeisen, BCR) și selector număr rate (3, 6, 10, 12)
- [ ] `#2` — Sub-formularul afișează suma lunară calculată dinamic: `totalCoș / nrRate`
- [ ] `#3` — Dacă este selectat „Rate", opțiunea „Ramburs" din secțiunea integrală este dezactivată/ascunsă
- [ ] `#3` — Backend-ul respinge o comandă cu `paymentMethod: "Ramburs"` dacă `installmentPlan` este prezent
- [ ] `#4` — Logica de detecție a eligibilității ratelor se face pe coșul clientului (cel puțin un produs cu `installmentOptions`)
- [ ] `#5` — Modelul `Order` salvează `installmentPlan: { bank, months, monthlyAmount }` dacă clientul a ales rate

---

## Out of Scope

- Integrarea cu API-ul real al băncilor (BT Pay, ING API etc.) — rămâne simulat/stored only
- Validarea cardului bancar în timp real (se stochează doar alegerea băncii)
- Rate per-produs individual (toată comanda e pe același plan)
- Split automat în sub-comenzi când coșul are produse mixte (cu și fără rate)
- Logică de rambursare pentru comenzi cu rate
- Notificări email specifice pentru rate
