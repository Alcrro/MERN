# Database: Cart → Order

> **Last updated:** 2026-07-10
> **Affects collections:** `Order`

---

## Note

The cart is client-side only (Redux + localStorage). When the user finalises the order at checkout, the cart contents are sent to the backend and saved as an `Order` document.

---

## Collection: `Order`

```js
// backend/models/order/Order.js

OrderItemSchema {
  product:  ObjectId  ref:"Products"  (required)
  brand:    String    (required)   // price + name snapshotted at order time
  model:    String    (required)
  price:    Number    (required)
  quantity: Number    (required, min:1, must be integer)
  _id: false
}

DeliveryAddressSchema {
  street: String  (required)   // snapshot — independent of user address changes
  city:   String  (required)
  county: String  (required)
  zip:    String  (required)
  phone:  String  (required)
  _id: false
}

OrderSchema {
  user:            ObjectId  ref:"Register"    (required)
  items:           [OrderItemSchema]           (min 1 item validated)
  deliveryAddress: DeliveryAddressSchema       (required)
  totalPrice:      Number    (auto via pre-save hook)
  status:          String    enum: Pending|Processing|Shipped|Delivered|Cancelled
                             default: "Pending"
  paymentMethod:   String    enum: Card|Ramburs   (required)
  isPaid:          Boolean   default: false
  paidAt:          Date
  deliveredAt:     Date
  timestamps: true
  virtual: itemCount  (sum of all item.quantity)
}
```

## Indexes

```js
{ user: 1, createdAt: -1 }    // user's own orders, newest first
{ status: 1, createdAt: -1 }  // admin: filter by status
{ isPaid: 1, createdAt: -1 }  // admin: unpaid orders
```

## How totalPrice is calculated

`pre("save")` hook: `items.reduce((sum, item) => sum + item.price * item.quantity, 0)`.
Price is snapshotted at order creation — product price changes don't affect existing orders.

## Status transitions

```
Pending → Processing → Shipped → Delivered
Pending → Cancelled   (only Pending orders can be cancelled; stock is restored)
```
