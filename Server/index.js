const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;
const DATA_PATH = path.join(__dirname, "data", "Books.json"); // ✅ Capital B

app.use(cors());
app.use(express.json());

// 🔹 Utility functions
const readBooks = () => JSON.parse(fs.readFileSync(DATA_PATH));
const writeBooks = (data) => {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
};

// 🔹 Root check
app.get("/", (req, res) => {
  res.send("Book API is running!");
});

// 🔹 Get all books
app.get("/api/books", (req, res) => {
  try {
    const books = readBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error reading book data" });
  }
});

// 🔹 Get a book by ID
app.get("/api/books/:id", (req, res) => {
  const books = readBooks();
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

// 🔹 Add a new book
app.post("/api/books", (req, res) => {
  const books = readBooks();
  const newBook = { ...req.body, id: Date.now(), available: true };
  books.push(newBook);
  writeBooks(books);
  res.status(201).json(newBook);
});

// 🔹 Edit book details (or borrow/return)
app.put("/api/books/:id", (req, res) => {
  let books = readBooks();
  const id = parseInt(req.params.id);
  books = books.map((b) => (b.id === id ? { ...b, ...req.body } : b));
  writeBooks(books);
  res.json({ message: "Book updated successfully" });
});

// 🔹 Delete a book
app.delete("/api/books/:id", (req, res) => {
  let books = readBooks();
  books = books.filter((b) => b.id !== parseInt(req.params.id));
  writeBooks(books);
  res.json({ message: "Book deleted successfully" });
});

// 🔹 Fallback for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// 🔹 Start the server
app.listen(PORT, () => {
  console.log(`Book Server is running on http://localhost:${PORT}`);
});
