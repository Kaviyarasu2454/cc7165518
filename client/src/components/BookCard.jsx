import { Link, useNavigate } from "react-router-dom";

function BookCard({ book }) {
  const navigate = useNavigate();

  const handleDelete = () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this book?");
    if (!confirmDelete) return;

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updatedBooks = books.filter((b) => b.id !== book.id);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    navigate(0); // Refresh the page
  };

  return (
    <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-4 shadow hover:shadow-lg transition">
      <h3 className="text-xl font-semibold text-white mb-2">{book.title}</h3>
      <p className="text-gray-300 text-sm mb-1"><strong>Author:</strong> {book.author}</p>
      <p className="text-gray-300 text-sm mb-1"><strong>Genre:</strong> {book.genre}</p>
      <p className="text-gray-300 text-sm mb-1"><strong>Year:</strong> {book.year}</p>
      <p className="text-gray-300 text-sm mb-2"><strong>Description:</strong> {book.description}</p>
      <p className={`font-bold mb-4 ${book.available ? "text-green-400" : "text-red-400"}`}>
        {book.available ? "✅ Available" : "❌ Borrowed"}
      </p>

      <div className="flex flex-col gap-2">
        <Link
          to={`/edit/${book.id}`}
          className="bg-blue-500 hover:bg-blue-600 text-white text-center py-1 rounded"
        >
          ✏️ Edit
        </Link>

        {book.available ? (
          <Link
            to={`/borrow-book/${book.id}`} // ✅ FIXED
            className="bg-green-500 hover:bg-green-600 text-white text-center py-1 rounded"
          >
            📖 Borrow Book
          </Link>
        ) : (
          <Link
            to={`/return-book/${book.id}`} // ✅ FIXED
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-center py-1 rounded"
          >
            🔄 Return Book
          </Link>
        )}

        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-center py-1 rounded"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;
