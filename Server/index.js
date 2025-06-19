// server/index.js

// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import the Book model 
const Book = require("./models/Books"); // Assuming your book model is in models/Books.js
// NEW: Import the User model
const User = require("./models/User");

// NEW: Import authentication routes and middleware
const authRoutes = require("./routes/authRoutes"); 
const { protect } = require("./middleware/authMiddleware");

// Initialize the Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 5074; 

// --- Middleware ---

// Configure CORS to explicitly allow requests from your frontend's origin
// IMPORTANT: Set to 5173 as per your current frontend port based on the error.
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// --- MongoDB Connection ---

mongoose
    .connect(process.env.MONGO_URI, {})
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });

// --- Authentication Routes ---
// All routes starting with /api/auth will use authRoutes (e.g., /api/auth/register, /api/auth/login)
app.use("/api/auth", authRoutes); // NEW: Use authentication routes

// --- API Routes for Books ---

// Root route to confirm API is running
app.get("/", (req, res) => {
    res.send("Book Management API is running!");
});

// GET all books (accessible publicly without authentication)
// You might later want to protect this too, but for now, it's public for the intro page
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find(); 
        res.json(books); 
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
});

// NEW: Apply protection middleware to all subsequent routes (book CRUD, borrow, return)
// This means any route defined *after* this line will require a valid JWT in the Authorization header.
app.use(protect); 

// GET a single book by ID (now protected)
app.get("/api/books/:id", async (req, res) => { 
    try {
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
});

// POST a new book (now protected)
app.post("/api/books", async (req, res) => { 
    try {
        const newBook = new Book(req.body); 
        const savedBook = await newBook.save();
        res.status(201).json({ message: "Book added successfully", book: savedBook });
    } catch (error) {
        console.error("Error adding book:", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: "Failed to add book", error: error.message });
    }
});

// PUT (Update) an existing book by ID (now protected)
app.put("/api/books/:id", async (req, res) => { 
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (updatedBook) {
            res.json({ message: "Book updated successfully", book: updatedBook });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error updating book:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: "Failed to update book", error: error.message });
    }
});

// DELETE a book by ID (now protected)
app.delete("/api/books/:id", async (req, res) => { 
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (deletedBook) {
            res.json({ message: "Book deleted successfully", book: deletedBook });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: "Failed to delete book", error: error.message });
    }
});

// PUT route for borrowing a book (now protected)
app.put("/api/books/:id/borrow", async (req, res) => { 
    try {
        const { name, department, section, borrowDate } = req.body.borrowInfo; 
        if (!name || !department || !section || !borrowDate) {
            return res.status(400).json({ message: "Borrower information is incomplete." });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                available: false,
                borrowInfo: { name, department, section, borrowDate: new Date(borrowDate) } 
            },
            { new: true, runValidators: true }
        );

        if (updatedBook) {
            res.json({ message: "Book borrowed successfully", book: updatedBook });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error borrowing book:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: "Failed to borrow book", error: error.message });
    }
});

// PUT route for returning a book (now protected)
app.put("/api/books/:id/return", async (req, res) => { 
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                available: true,
                borrowInfo: null
            },
            { new: true, runValidators: true }
        );

        if (updatedBook) {
            res.json({ message: "Book returned successfully", book: updatedBook });
        } else {
            res.status(404).json({ message: "Book not found" });
        }
    } catch (error) {
        console.error("Error returning book:", error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: "Failed to return book", error: error.message });
    }
});


// Catch-all route for undefined API endpoints
app.use((req, res) => {
    res.status(404).json({ message: "API Endpoint not found" });
});

// --- Start the Server ---

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
