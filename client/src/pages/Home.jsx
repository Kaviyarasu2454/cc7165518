import React, { useState, useEffect, useCallback } from 'react';
import BookCard from '../components/BookCard';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get token

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isAuthenticated } = useAuth(); // Get user (which contains the token) and isAuthenticated

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Only send Authorization header if user and token exist
      // Note: GET /api/books is public in index.js, but it's good practice to send token if available
      const headers = user && user.token ? { 'Authorization': `Bearer ${user.token}` } : {};

      // Use VITE_BACKEND_URL from environment variables
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books`, {
        headers: headers
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
      }

      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(`Failed to load books: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]); // Depend on user, so it re-fetches when login state changes

  useEffect(() => {
    // Only attempt to fetch if user is logged in
    if (isAuthenticated) { 
      fetchBooks();
    } else {
      setLoading(false); // If not logged in, stop loading and show no books/login prompt
      setBooks([]);
    }
  }, [isAuthenticated, fetchBooks]); // Depend on isAuthenticated and memoized fetchBooks

  const handleDelete = useCallback(async (deletedBookId) => {
    // Optimistically remove the book from the UI
    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== deletedBookId));
    console.log("Attempting to delete book with ID:", deletedBookId);
    
    // Trigger a re-fetch of the list to ensure consistency after deletion
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = books.filter((book) => {
    if (!book || !book.title || !book.author || !book.genre) return false;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.author.toLowerCase().includes(lowerCaseSearchTerm) ||
      book.genre.toLowerCase().includes(lowerCaseSearchTerm)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-10 px-3 flex justify-center items-center">
        <p className="text-xl text-gray-300">Loading books...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F172A] py-10 px-3 flex justify-center items-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-md" role="alert">
          <strong className="font-bold text-lg">Error!</strong>
          <p className="block sm:inline ml-2 text-base">{error}</p>
          <button
            onClick={fetchBooks} // Allow user to retry fetching
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-3 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto p-3 rounded-xl text-gray-800 bg-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length === 0 ? (
            <p className="text-gray-300 text-center col-span-full text-lg">No books found. Add some!</p>
          ) : (
            filteredBooks.map((book) => (
              <BookCard key={book._id} book={book} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
