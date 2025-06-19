// server/models/Books.js

const mongoose = require("mongoose");

// Define the schema for a single book
const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, // Trim whitespace from the beginning and end
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      // You might want to add validation for year (e.g., min/max)
    },
    description: {
      type: String,
      trim: true,
    },
    available: {
      type: Boolean,
      default: true, // Books are available by default when added
    },
    // Nested object to store borrowing information
    borrowInfo: {
      name: {
        type: String,
        default: null, // Null if not currently borrowed
      },
      department: {
        type: String,
        default: null,
      },
      section: {
        type: String,
        default: null,
      },
      borrowDate: {
        type: Date,
        default: null, // Date when the book was borrowed
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Book model from the schema
// Mongoose will create a collection named 'books' (lowercase and pluralized) in MongoDB
const Book = mongoose.model("Book", bookSchema);

// Export the Book model for use in other files (like index.js)
module.exports = Book;
