const mongoose = require("mongoose");
const Product = require("../Product");

// Covers: books, e-books, audiobooks, comics, magazines, games, films, music
const BooksSchema = new mongoose.Schema({
  title:     { type: String, required: [true, "Please add a title"], trim: true },
  author:    { type: String, required: [true, "Please add an author"] },
  isbn:      { type: String },
  publisher: { type: String },
  genre:     { type: String },  // "Roman", "SF", "Non-fiction", "Manga", etc.
  format:    { type: String, enum: ["Fizic", "Digital", "Audio"] },
  language:  { type: String, default: "Română" },
  pages:     { type: Number },
});

BooksSchema.index({ title: "text" });
BooksSchema.index({ author: 1 });
BooksSchema.index({ isbn: 1 }, { sparse: true });

const Books = Product.discriminator("Books", BooksSchema);
module.exports = Books;
