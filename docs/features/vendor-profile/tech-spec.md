# Tech Spec: Vendor Profile

> **Status:** `Shipped`
> **Last updated:** 2026-07-13

---

## Data Flow

### Vendor completează profilul
```
/vendor/dashboard/profile
  → VendorProfilePage (page)
      useGetVendorMeQuery()        → GET /api/vendor/me (date existente)
      useUpdateVendorProfileMutation()
        → PUT /api/vendor/profile  → salvează vendorProfile pe Register
        → invalidează VendorMe
```

### Client vede info vendor în SellerPicker
```
GET /api/products/sellers/:catalogRef
  → populate("vendor", "shopName vendorProfile")
  → SellerRow afișează: shopName + orasDepozit + zileLivrare + tipEntitate + returZile
```

### Admin vede lista vendorilor
```
GET /api/admin/vendors
  → Register.find({ role: "vendor" }).select("name email shopName vendorStatus vendorProfile")
  → AdminVendorList — tabel: firmă, CUI, tip, status, oraș, zile livrare
```

---

## API Contracts

### `PUT /api/vendor/profile` — `protect + authorize("vendor")`

**Body** (toate câmpurile opționale, patch semantic):
```json
{
  "cui":           "RO12345678",
  "denumireFirma": "AlcrroTech SRL",
  "tipEntitate":   "SRL",
  "orasDepozit":   "Cluj-Napoca",
  "zileLivrare":   { "min": 1, "max": 3 },
  "returZile":     30,
  "telefon":       "0740000000",
  "emailContact":  "contact@alcrrotech.ro"
}
```

**Validări:**
- `cui` — `/^\d{2,10}$/` (cifre pure, fără prefix "RO")
- `tipEntitate` — enum: `["SRL", "PFA", "SA", "RA", "II", "ONG"]`
- `zileLivrare.min <= zileLivrare.max`
- `returZile >= 0`

**Response `200`:**
```json
{ "success": true, "vendorProfile": { ... } }
```

**Error `400`:** câmp invalid (CUI format, min > max, etc.)

---

### `GET /api/vendor/me` — modificat

Răspuns extins cu `vendorProfile`:
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "name": "Vendor Alex",
    "email": "vendor@alcrro.ro",
    "shopName": "AlcrroTech",
    "shopDescription": "...",
    "vendorStatus": "approved",
    "vendorProfile": {
      "cui": "12345678",
      "denumireFirma": "AlcrroTech SRL",
      "tipEntitate": "SRL",
      "orasDepozit": "Cluj-Napoca",
      "zileLivrare": { "min": 1, "max": 3 },
      "returZile": 30,
      "telefon": "0740000000",
      "emailContact": "contact@alcrrotech.ro"
    }
  }
}
```

---

### `GET /api/products/sellers/:catalogRef` — modificat

`populate("vendor", "shopName vendorProfile")` → fiecare seller include:
```json
{
  "_id": "listing_id",
  "price": 4299,
  "stock": { "quantity": 12, "availability": "In Stoc" },
  "vendor": {
    "_id": "...",
    "shopName": "AlcrroTech",
    "vendorProfile": {
      "tipEntitate": "SRL",
      "orasDepozit": "Cluj-Napoca",
      "zileLivrare": { "min": 1, "max": 3 },
      "returZile": 30
    }
  }
}
```

---

### `GET /api/admin/vendors` — `protect + authorize("admin")` — NOU

**Response:**
```json
{
  "success": true,
  "vendors": [
    {
      "_id": "...",
      "name": "Vendor Alex",
      "email": "vendor@alcrro.ro",
      "shopName": "AlcrroTech",
      "vendorStatus": "approved",
      "vendorProfile": { "cui": "12345678", "denumireFirma": "AlcrroTech SRL", "tipEntitate": "SRL", "orasDepozit": "Cluj-Napoca" }
    }
  ],
  "count": 1
}
```

---

## Component Tree

```
Pages/Vendor/VendorDashboard → /vendor/dashboard/profile
  Components/vendor/dashboard/VendorLayout/VendorLayout.jsx   ← REUSE
    Components/vendor/dashboard/VendorProfilePanel/           ← NEW organism (≤ 150 linii)
      VendorProfilePanel.jsx
      VendorProfilePanel.css
      index.js

Components/vendor/shared/SellerRow/SellerRow.jsx              ← MODIFY
  → afișează orasDepozit + zileLivrare + returZile din vendor.vendorProfile
```

### Reuse
| Componentă | De unde | Utilizare |
|---|---|---|
| `VendorLayout` | `vendor/dashboard/VendorLayout/` | shell cu sidebar |
| `VendorSidebar` | `vendor/dashboard/VendorSidebar/` | adaugă link "Profil" în `VENDOR_LINKS` |
| `StatCard` | `vendor/shared/StatCard/` | completion indicator opțional |

---

## RTK Changes

`features/vendor/rtkVendor.js`:

```js
// Adaugă:
updateVendorProfile: builder.mutation({
  query: (body) => ({ url: "vendor/profile", method: "PUT", body }),
  invalidatesTags: ["VendorMe"],
}),
```

Tag nou: `"VendorMe"` — deja există; invalidare automată după update.

---

## Constants

```js
// utils/constants.js — implementat cu label-uri scurte:
export const TIP_ENTITATE_OPTIONS = [
  { value: "SRL", label: "SRL" },
  { value: "PFA", label: "PFA" },
  { value: "SA",  label: "SA" },
  { value: "RA",  label: "RA" },
  { value: "II",  label: "II" },
  { value: "ONG", label: "ONG" },
];

// VENDOR_LINKS — adaugă intrarea pentru profil:
{ to: "/vendor/dashboard/profile", label: "Profil firmă", end: false }
```
