# Order Controller — Tranzacții MongoDB

## Ce face codul

### `createOrder` — fluxul complet

```
POST /api/orders
      │
      ├─ validare items + adresă
      │
      ├─ startSession() + startTransaction()
      │
      ├─ pentru fiecare produs:
      │     findOneAndUpdate(
      │       { _id, stock.quantity >= qty },   ← condiție atomică
      │       { $inc: { stock.quantity: -qty } } ← decrementare atomică
      │     )
      │     ↓ dacă null → insufficient stock → aruncă eroare
      │
      ├─ Order.create([...], { session })
      │
      ├─ commitTransaction()  ✓ → totul salvat
      │  abortTransaction()   ✗ → totul anulat (stock restaurat automat)
      │
      └─ endSession()
```

### `cancelOrder` — același principiu

```
PUT /api/orders/:id/cancel
      │
      ├─ validare: owner + status === "Pending"
      │
      ├─ startSession() + startTransaction()
      │
      ├─ pentru fiecare item:
      │     findByIdAndUpdate(productId, { $inc: +qty }, { session })
      │
      ├─ order.status = "Cancelled" + save({ session })
      │
      └─ commit / abort / endSession
```

---

## Problema pe care o rezolvă

### Race condition (fără tranzacție)

```
User A ──── citește stock=1 ────────────────── save(0) ──── Order A ✓
User B ──────────── citește stock=1 ─── save(0) ──────────── Order B ✓
                                                          ↑ BUG: -1 stoc
```

**Rezultat:** 2 comenzi create, 0 produse în stoc → oversell.

### Cu tranzacție (implementarea actuală)

```
User A ──── findOneAndUpdate(qty>=1 → -1) → stock=0 ──── Order A ✓ ── commit
User B ──── findOneAndUpdate(qty>=1 → -1) → NULL ──── throw 400
                                            ↑ condiția $gte pică → nimeni nu poate
                                              scădea sub 0
```

---

## 3 implementări posibile

### 1. Fără protecție (cum era înainte) ❌

```js
const product = await Product.findById(id);
if (product.stock.quantity < qty) throw error; // ← citire separată
product.stock.quantity -= qty;
await product.save();                           // ← scriere separată
// între citire și scriere, alt user poate trece verificarea
```

**Probleme:**
- Race condition între cereri concurente
- Dacă `Order.create` pică după `product.save()` → stoc pierdut permanent

---

### 2. Atomic update fără sesiune (parțial corect) ⚠️

```js
const product = await Product.findOneAndUpdate(
  { _id: id, 'stock.quantity': { $gte: qty } },
  { $inc: { 'stock.quantity': -qty } },
  { new: true }
);
if (!product) throw new ErrorResponse('Insufficient stock', 400);

await Order.create({ ... }); // ← dacă pică AICI, stocul e deja scăzut
```

**Rezolvă:** race condition  
**Nu rezolvă:** dacă `Order.create` pică → stoc pierdut

---

### 3. Tranzacție completă cu sesiune (implementarea actuală) ✓

```js
const session = await mongoose.startSession();
session.startTransaction();
try {
  await Product.findOneAndUpdate(..., { session }); // atomic + în tranzacție
  await Order.create([...], { session });           // dacă pică → abort total
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction(); // stocul se restaurează automat
  throw err;
} finally {
  session.endSession();
}
```

**Rezolvă:** race condition + partial failure  
**Cerință:** MongoDB Replica Set (Atlas by default ✓)

---

## ACID — ce înseamnă

| Literă | Termen | Ce înseamnă în practică |
|--------|--------|------------------------|
| **A** | Atomicity | Ori totul reușește, ori nimic. Nu există stare intermediară. |
| **C** | Consistency | DB trece dintr-o stare validă în altă stare validă. |
| **I** | Isolation | Tranzacțiile concurente nu se văd între ele până la commit. |
| **D** | Durability | După commit, datele sunt salvate permanent. |

---

## Întrebări de interviu

---

**Q: Ce este o tranzacție în MongoDB și de când e suportată?**

> Din MongoDB 4.0 pe Replica Sets, 4.2 pe Sharded Clusters. Înainte, MongoDB era document-oriented și nu suporta tranzacții multi-document — fiecare operație era atomică doar la nivel de document individual.

---

**Q: De ce ai nevoie de Replica Set pentru tranzacții?**

> Tranzacțiile necesită un mecanism de log (oplog) pentru a putea face rollback. Replica Set-ul menține acest oplog. Fără el, MongoDB nu poate garanta că poate anula o tranzacție parțial executată.

---

**Q: Care e diferența dintre `findOneAndUpdate` cu `$inc` și o tranzacție completă?**

> `findOneAndUpdate` e atomic la nivel de **un singur document** — rezolvă race condition-ul pe stock. Tranzacția rezolvă în plus consistența **între mai multe documente** (stock + order): dacă order-ul nu se creează, stocul se restaurează automat.

---

**Q: Ce se întâmplă dacă uiți `session.endSession()`?**

> Sesiunea rămâne deschisă și consumă resurse pe server (connection pool). MongoDB are un timeout de sesiune (30 minute default), dar în producție sub load mare poți epuiza pool-ul de conexiuni. De aceea `endSession()` e mereu în `finally`.

---

**Q: Alternativă la tranzacții dacă nu ai Replica Set?**

> **Compensating transactions** — operații inverse manuale. Ex: dacă `Order.create` pică, faci `$inc: +quantity` înapoi. Dezavantaj: dacă și restore-ul pică, datele sunt corupte și ai nevoie de un job de reconciliere. Nu e echivalent cu tranzacțiile reale.

---

**Q: De ce `Order.create([doc], { session })` și nu `Order.create(doc, { session })`?**

> Mongoose cere forma cu array când folosești session în `create()`. Forma fără array ignoră session-ul în unele versiuni. Returnează array, de aceea destructurăm: `const [order] = await Order.create([...], { session })`.

---

**Q: Ce este un race condition?**

> Situație în care rezultatul depinde de ordinea și timing-ul operațiilor concurente. Exemplu: doi useri citesc simultan `stock=1`, ambii trec verificarea, ambii scad — rezultat: `stock=-1`. Soluție: operații atomice sau locks.

---

**Q: Când NU ai nevoie de tranzacție?**

> Când modifici un **singur document**. MongoDB garantează atomicitate la nivel de document individual — un `findOneAndUpdate` cu câmpuri nested e safe fără tranzacție. Tranzacțiile sunt necesare doar când modifici **mai multe documente** care trebuie să fie consistente împreună.
