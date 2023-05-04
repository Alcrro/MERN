const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");
2;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true,
    maxlength: [50, "Name can not be more than 50 characters"],
    unique: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  slug: String,
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Create bootcamp slug from the name
//pre run before operation
// UserSchema.pre("save", function (next) {
//   console.log("Slugify ran", this.name);
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//Match  user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Users = mongoose.model("User", UserSchema);
module.exports = Users;
