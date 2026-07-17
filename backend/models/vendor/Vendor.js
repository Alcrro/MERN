const mongoose = require("mongoose");

const OrarSchema = new mongoose.Schema({
  lv:       { type: String, default: null },
  sambata:  { type: String, default: null },
  duminica: { type: String, default: null },
}, { _id: false });

const LocationSchema = new mongoose.Schema({
  oras:    { type: String, required: true, maxlength: 100 },
  adresa:  { type: String, maxlength: 200, default: null },
  telefon: { type: String, default: null },
  zileLivrare: {
    min: { type: Number, min: 0, default: null },
    max: { type: Number, min: 0, default: null },
  },
  orar: { type: OrarSchema, default: () => ({}) },
});

const ProfileSchema = new mongoose.Schema({
  cui:           { type: String, default: null },
  denumireFirma: { type: String, maxlength: 150, default: null },
  tipEntitate:   { type: String, enum: ["SRL", "PFA", "SA", "RA", "II", "ONG", null], default: null },
  returZile:     { type: Number, min: 0, default: 30 },
  telefon:       { type: String, default: null },
  emailContact:  { type: String, default: null },
}, { _id: false });

const VendorSchema = new mongoose.Schema({
  user:            { type: mongoose.Schema.Types.ObjectId, ref: "Register", required: true, unique: true },
  shopDescription: { type: String, maxlength: 500, default: null },
  profile:         { type: ProfileSchema, default: () => ({}) },
  locations:       [LocationSchema],
  rating: {
    average: { type: Number, default: 0 },
    count:   { type: Number, default: 0 },
  },
}, { timestamps: true });

VendorSchema.index({ user: 1 });

module.exports = mongoose.model("Vendor", VendorSchema);
