const mongoose = require("mongoose");

const INSTALLMENT_BANKS  = ["BT", "ING", "Raiffeisen", "BCR"];
const INSTALLMENT_MONTHS = [3, 6, 10, 12];

const InstallmentPlanSchema = new mongoose.Schema(
  {
    bank:          { type: String, enum: INSTALLMENT_BANKS,  required: true },
    months:        { type: Number, enum: INSTALLMENT_MONTHS, required: true },
    monthlyAmount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

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
    vendor: { type: mongoose.Schema.ObjectId, ref: "Register", default: null },
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
    stripePaymentIntentId: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isRefunded: {
      type: Boolean,
      default: false,
    },
    refundedAt: {
      type: Date,
    },
    paymentDetails: {
      last4:      { type: String },
      brand:      { type: String },
      receiptUrl: { type: String },
    },
    installmentPlan: {
      type: InstallmentPlanSchema,
      default: null,
    },
    awb: {
      type: String,
      default: null,
    },
    shippedAt: {
      type: Date,
    },
    deliveredAt: {
      type: Date,
    },
    creditsUsed: {
      type: Number,
      default: 0,
      min: 0,
    },
    pointsEarned: {
      type: Number,
      default: 0,
      min: 0,
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

// webhook lookup: order după stripePaymentIntentId
OrderSchema.index({ stripePaymentIntentId: 1 }, { sparse: true });

OrderSchema.pre("save", function (next) {
  if (this.paymentMethod === "Ramburs" && this.installmentPlan) {
    return next(new Error("Ramburs nu este compatibil cu un plan de rate"));
  }
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
module.exports = { Order, ORDER_STATUS, INSTALLMENT_BANKS, INSTALLMENT_MONTHS };
