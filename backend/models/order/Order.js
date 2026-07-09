const mongoose = require("mongoose");

const ORDER_STATUS = Object.freeze({
  PENDING: "Pending",
  PROCESSING: "Processing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
});

// snapshot al produsului la momentul comenzii — pretul nu se schimba daca produsul se modifica
const OrderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Products",
      required: true,
    },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
      validate: {
        validator: Number.isInteger,
        message: "Quantity must be a whole number",
      },
    },
  },
  { _id: false }
);

// snapshot al adresei la momentul comenzii — adresa user-ului se poate schimba
const DeliveryAddressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    county: { type: String, required: true },
    zip: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },
    deliveryAddress: {
      type: DeliveryAddressSchema,
      required: [true, "Delivery address is required"],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(ORDER_STATUS),
        message: "{VALUE} is not a valid order status",
      },
      default: ORDER_STATUS.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: ["Card", "Ramburs"],
      required: [true, "Payment method is required"],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// comenzile unui user, cele mai noi primele
OrderSchema.index({ user: 1, createdAt: -1 });

// admin: toate comenzile cu un anumit status, sortate
OrderSchema.index({ status: 1, createdAt: -1 });

// admin: toate comenzile neplătite
OrderSchema.index({ isPaid: 1, createdAt: -1 });

OrderSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  next();
});

OrderSchema.virtual("itemCount").get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = { Order, ORDER_STATUS };
