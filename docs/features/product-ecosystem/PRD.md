# PRD: Product Ecosystem

> **Status:** `Shipped`
> **Owner:** Alexandru Roventa
> **Last updated:** 2026-07-13
> **Related tech spec:** [tech-spec.md](./tech-spec.md)

---

## Problem Statement

**Current state:** Pe pagina de listing (`/products/electronice/telefon`) utilizatorul
vede o grilă de produse și filtre în sidebar. Nu există niciun ghid despre ce accesorii
să cumpere împreună cu produsul principal.

**Pain point:** Vendorii nu știu și nu adaugă manual relații între produse. Utilizatorul
trebuie să facă singur cercetare externă pentru a afla ce îi mai trebuie (husă, încărcător,
trepied etc.). Mulți cumpărători pleacă fără accesorii esențiale și se întorc cu returnări
sau reclamații.

**Why now:** Avem o structură de categorii (`tip`) care permite generarea automată a
ecosistemului pe backend. OpenAI poate acoperi toate nișele de utilizare pe care vendorii
nu le anticipează, fără efort manual.

---

## User Stories

| # | Role | Want to | So that |
|---|------|---------|---------|
| 1 | client | văd ce accesorii sunt **obligatorii** pentru produsul pe care îl cumpăr | nu rămân fără ceva esențial la prima utilizare |
| 2 | client | văd accesorii recomandate | îmi completez experiența fără să caut pe cont propriu |
| 3 | client | văd grupuri de accesorii bazate pe ce vreau să fac cu produsul | îmi aleg setup-ul potrivit use case-ului meu specific |
| 4 | client | dau click pe un accesoriu și ajung la pagina lui de listing | pot cumpăra imediat ce am descoperit |

---

## Acceptance Criteria

- [ ] `#1` — Widgetul apare în sidebar pe `/products/electronice/telefon` (și orice pagină cu `tip` definit care are ecosystem)
- [ ] `#1` — Nivel 1 (Critic) este always-expanded și conține cel puțin 1 accesoriu cu `reason` vizibil
- [ ] `#2` — Nivel 2 (Recomandat) este always-expanded cu cel puțin 1 accesoriu
- [ ] `#3` — Nivel 3 afișează minim 2 task-uri, fiecare collapsed by default
- [ ] `#3` — Click pe un task îl expandează și afișează accesoriile aferente
- [ ] `#4` — Fiecare accesoriu este un link funcțional spre `/products/...`
- [ ] Dacă `tip` nu are ecosystem definit → widgetul nu se afișează (null)
- [ ] Dacă OpenAI call eșuează → se afișează fallback-ul static fără eroare vizibilă
- [ ] Widgetul funcționează în dark mode

---

## Out of Scope (v1)

- Banner contextual pe pagina destinație (`?context=gaming-mobile`) — planificat v3
- Extindere la alte `tip`-uri decât `Telefon` — planificat v4
- Admin panel pentru override manual al ecosistemului — planificat v5
- Produse recomandate din catalog propriu (cross-sell real-time) — feature separat
- Personalizare per utilizator bazată pe istoric cumpărături
