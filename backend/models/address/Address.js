const mongoose = require("mongoose");

const ROMANIAN_COUNTIES = Object.freeze([
  "Alba", "Arad", "Arges", "Bacau", "Bihor", "Bistrita-Nasaud", "Botosani",
  "Braila", "Brasov", "Bucuresti", "Buzau", "Calarasi", "Cluj", "Constanta",
  "Covasna", "Dambovita", "Dolj", "Galati", "Giurgiu", "Gorj", "Harghita",
  "Hunedoara", "Ialomita", "Iasi", "Ilfov", "Maramures", "Mehedinti", "Mures",
  "Neamt", "Olt", "Prahova", "Salaj", "Satu Mare", "Sibiu", "Suceava",
  "Teleorman", "Timis", "Tulcea", "Vaslui", "Valcea", "Vrancea",
]);

const AddressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "Register",
      required: true,
    },
    label: {
      type: String,
      trim: true,
      maxlength: [30, "Label cannot exceed 30 characters"],
      default: "Acasă",
    },
    street: {
      type: String,
      required: [true, "Street address is required"],
      trim: true,
      maxlength: [150, "Street cannot exceed 150 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
      maxlength: [50, "City cannot exceed 50 characters"],
    },
    county: {
      type: String,
      required: [true, "County is required"],
      enum: {
        values: ROMANIAN_COUNTIES,
        message: "{VALUE} is not a valid Romanian county",
      },
    },
    zip: {
      type: String,
      required: [true, "ZIP code is required"],
      match: [/^\d{6}$/, "ZIP code must be exactly 6 digits"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^(\+40|0)[0-9]{9}$/, "Please add a valid Romanian phone number"],
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// toate adresele unui user
AddressSchema.index({ user: 1 });

// adresa default a unui user — query frecvent la checkout
AddressSchema.index({ user: 1, isDefault: 1 });

// only one default address per user
AddressSchema.pre("save", async function (next) {
  if (this.isModified("isDefault") && this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

AddressSchema.virtual("fullAddress").get(function () {
  return `${this.street}, ${this.city}, jud. ${this.county}, ${this.zip}`;
});

const Address = mongoose.model("Address", AddressSchema);
module.exports = { Address, ROMANIAN_COUNTIES };
