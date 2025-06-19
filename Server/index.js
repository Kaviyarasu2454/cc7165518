// server/index.js

// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import the Book model 
// The path must match your file structure: server/models/Books.js
const Book = require("./models/Books"); 

// Initialize the Express application
const app = express();

// Define the port the server will listen on
// It uses the PORT from .env or defaults to 5074
const PORT = process.env.PORT || 5074; 

// --- Middleware ---

// Configure CORS to explicitly allow requests from your frontend's origin
// IMPORTANT FIX: Changed origin to http://localhost:5173 to match your frontend's current actual port.
app.use(cors({
    origin: 'http://localhost:5173', // <--- THIS IS THE CRUCIAL CHANGE FOR YOUR CORS ERROR
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    credentials: true 
}));

// Middleware to parse JSON bodies from incoming requests
app.use(express.json());

// --- MongoDB Connection ---

mongoose
    .connect(process.env.MONGO_URI, {
        // These options are deprecated in newer Mongoose versions but generally harmless
        // useNewUrlParser: true,      
        // useUnifiedTopology: true,   
    })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        // It's often better to let the server attempt to start even without DB connection
        // and handle DB errors per request, but existing `process.exit(1)` is fine if intended
        // process.exit(1); 
    });

// --- API Routes for Books ---

// Root route to confirm API is running
app.get("/", (req, res) => {
    res.send("Book Management API is running!");
});

// GET all books
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find(); // Fetch all books from the database
        res.json(books); // Send them as JSON response
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
});

// GET a single book by ID
app.get("/api/books/:id", async (req, res) => {
    try {
        // Find a book by ID. Mongoose models have findById method
        const book = await Book.findById(req.params.id);
        if (book) {
            res.json(book); // Send the found book
        } else {
            res.status(404).json({ message: "Book not found" }); // Book not found
        }
    } catch (error) {
        console.error("Error fetching book by ID:", error);
        // Handle CastError for invalid IDs (e.g., not a valid MongoDB ObjectId)
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid book ID format" });
        }
        res.status(500).json({ message: "Failed to fetch book", error: error.message });
    }
});

// POST a new book
app.post("/api/books", async (req, res) => {
    try {
        const newBook = new Book(req.body); // Create a new book document from request body
        const savedBook = await newBook.save(); // Save the new book to the database
        res.status(201).json({ message: "Book added successfully", book: savedBook }); // Respond with the created book and 201 status
    } catch (error) {
        console.error("Error adding book:", error);
        // Handle validation errors (e.g., missing required fields like title, author)
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, errors: error.errors });
        }
        res.status(500).json({ message: "Failed to add book", error: error.message });
    }
});

// PUT (Update) an existing book by ID
app.put("/api/books/:id", async (req, res) => {
    try {
        // Find and update a book by ID. { new: true } returns the updated document.
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true } // runValidators ensures schema validation on update
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

// DELETE a book by ID
app.delete("/api/books/:id", async (req, res) => {
    try {
        // Find and delete a book by ID
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

// PUT route for borrowing a book (mark as unavailable and save borrow info)
app.put("/api/books/:id/borrow", async (req, res) => {
    try {
        const { name, department, section, borrowDate } = req.body.borrowInfo; // Destructure borrowInfo
        if (!name || !department || !section || !borrowDate) {
            return res.status(400).json({ message: "Borrower information is incomplete." });
        }

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                available: false, // Mark as unavailable
                borrowInfo: { name, department, section, borrowDate: new Date(borrowDate) } // Save borrow info
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

// PUT route for returning a book (mark as available and clear borrow info)
app.put("/api/books/:id/return", async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            {
                available: true, // Mark as available
                borrowInfo: null // Clear borrow information
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

// Listen for incoming requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
