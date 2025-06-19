import React, { useState, useEffect, useCallback } from 'react'; // Added useCallback
import BookCard from '../components/BookCard';

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Memoized function to fetch books from the backend
  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("http://localhost:5074/api/books"); // Use backend URL and port

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
  }, []); // No dependencies, so it only gets created once

  // Fetch books on component mount
  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]); // Depend on fetchBooks (which is memoized)

  // Handle book deletion and trigger a re-fetch
  const handleDelete = useCallback(async (deletedBookId) => {
    // Optimistically remove the book from the UI
    setBooks((prevBooks) => prevBooks.filter((book) => book._id !== deletedBookId));
    console.log("Attempting to delete book with ID:", deletedBookId);

    // No need for explicit fetch here, BookCard handles its own delete API call
    // We just need to trigger a re-fetch of the list to ensure consistency.
    // The BookCard's handleDelete already sends the DELETE request and updates the UI
    // Here we just re-fetch the entire list from the backend to be safe.
    fetchBooks();
  }, [fetchBooks]); // Depend on fetchBooks

  // Filter books based on search term
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
        {/* 🔍 Search Input */}
        <div className="mb-8 text-center">
          <input
            type="text"
            placeholder="Search by title, author, or genre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto p-3 rounded-xl text-gray-800 bg-white placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* 📚 Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.length === 0 ? (
            <p className="text-gray-300 text-center col-span-full text-lg">No books found. Add some!</p>
          ) : (
            filteredBooks.map((book) => (
              // Ensure key uses book._id and pass onDelete handler
              <BookCard key={book._id} book={book} onDelete={handleDelete} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
