import BookCard from '../components/BookCard';
import { useState, useEffect } from 'react';

function Home() {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(stored);
  }, []);

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0F172A] py-10 px-4 text-white">
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
            <p className="text-gray-300 text-center col-span-full">No books found.</p>
          ) : (
            filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
