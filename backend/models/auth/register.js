const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
2;

const RegisterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [false, "Please add a name"],
  },

  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: [true, "Email already taken"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please add a valid email",
    ],
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },

  createdAt: {
    type: Date,
    imutable: true,
    default: () => Date.now(),
  },
  updateAt: {
    type: Date,
    default: () => Date.now(),
  },
});

// Create bootcamp slug from the name
// pre run before operation
RegisterSchema.pre("save", function (next) {
  console.log("Slugify ran", this.name);
  this.slug = slugify(this.name, { lower: true });
  next();
});

// //Encrypt password using bcrypt
// RegisterSchema.pre("save", async function (next) {
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// //Match  user entered password to hashed password in database
// RegisterSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

//Sign JWT and return
RegisterSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id, name: this.name, email: this.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Register = mongoose.model("Register", RegisterSchema);
module.exports = Register;
