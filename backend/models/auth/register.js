const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const ROLES = Object.freeze({
  CLIENT: "client",
  VENDOR: "vendor",
  ADMIN: "admin",
});

const RegisterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: {
        values: Object.values(ROLES),
        message: "{VALUE} is not a valid role",
      },
      default: ROLES.CLIENT,
    },
    phone: {
      type: String,
      match: [/^(\+40|0)[0-9]{9}$/, "Please add a valid Romanian phone number"],
    },
    avatar: {
      type: String,
      default: null,
    },
    vendorStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    shopName: {
      type: String,
      maxlength: [100, "Shop name cannot exceed 100 characters"],
      default: null,
    },
    stripeCustomerId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

RegisterSchema.index({ email: 1 }, { unique: true });
RegisterSchema.index({ role: 1 });
RegisterSchema.index({ vendorStatus: 1 });

RegisterSchema.virtual("isAdmin").get(function () {
  return this.role === ROLES.ADMIN;
});

RegisterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

RegisterSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, name: this.name, email: this.email, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "30d" }
  );
};

RegisterSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Register = mongoose.model("Register", RegisterSchema, "users");
module.exports = { Register, ROLES };
