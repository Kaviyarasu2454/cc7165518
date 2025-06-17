import BookCard from '../components/BookCard';
import { useState, useEffect } from 'react';

function Home() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('books')) || [];
    setBooks(stored);
  }, []);

  const handleDelete = (id) => {
    const updated = books.filter((b) => b.id !== id);
    localStorage.setItem("books", JSON.stringify(updated));
    setBooks(updated);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {books.length === 0 ? (
        <p className="text-gray-500 text-center w-full">No books added yet.</p>
      ) : (
        books.map((book) => (
          <BookCard key={book.id} book={book} onDelete={handleDelete} />
        ))
      )}
    </div>
  );
}

export default Home;
