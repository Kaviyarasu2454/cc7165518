// server/index.js

// Load environment variables from .env file
require("dotenv").config();

// Import necessary packages
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Import the Book model 
const Book = require("./models/Books"); 
// Import the User model
const User = require("./models/User");

// Import authentication routes and middleware
const authRoutes = require("./routes/authRoutes"); 
const { protect } = require("./middleware/authMiddleware");

// Initialize the Express application
const app = express();

// Define the port the server will listen on
const PORT = process.env.PORT || 5074; 

// --- CORS Configuration (Dynamic for Local and Deployed) ---
// Define all allowed origins here
const allowedOrigins = [
    'http://localhost:5173',          // Your local frontend development server
    'https://cc7165518.vercel.app',   // Your deployed Vercel frontend URL
    // Add any other deployed Vercel preview URLs if needed (e.g., branch deployments)
    // If you add a custom domain, add it here too: 'https://yourcustomdomain.com'
];

app.use(cors({
    origin: function (origin, callback) {
        // If the origin is not provided (e.g., for same-origin requests or tools like Postman/Curl)
        // or if the origin is in our allowed list, allow the request.
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            // Otherwise, block the request and return an error
            const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
            console.error(msg); // Log the specific origin being blocked
            callback(new Error(msg), false);
        }
    },
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
app.use("/api/auth", authRoutes); 

// --- API Routes for Books ---

// Root route to confirm API is running
app.get("/", (req, res) => {
    res.send("Book Management API is running!");
});

// GET all books (accessible publicly without authentication)
app.get("/api/books", async (req, res) => {
    try {
        const books = await Book.find(); 
        res.json(books); 
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).json({ message: "Failed to fetch books", error: error.message });
    }
});

// Apply protection middleware to all subsequent routes
app.use(protect); 

// Protected routes for book management
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
