import { Link, useNavigate } from "react-router-dom";

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();

  const handleDelete = async () => {
    // Replaced window.confirm with a console log.
    // In a production app, use a custom confirmation modal here.
    console.log("Confirming delete for book:", book.title);
    const confirmDelete = true; // For testing, assume confirmed. Remove in production.

    if (!confirmDelete) return;

    try {
      // Use the correct backend URL and book's _id for deletion
      const res = await fetch(`http://localhost:5074/api/books/${book._id}`, {
        method: "DELETE",
      });

      if (res.ok) { // Check if the response status is 2xx
        console.log("Book deleted successfully:", book.title);
        onDelete(book._id); // Pass the ID back to the parent to update state
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Failed to delete the book:", errorData);
        // Replace alert with a custom toast or message
        // alert(`Failed to delete the book: ${errorData.message}`);
        console.warn(`Failed to delete the book: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Delete error (network or unexpected):", err);
      // Replace alert with a custom toast or message
      // alert("Network error during delete. Please try again.");
      console.warn("Network error during delete. Please try again.");
    }
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
        {/* Link to Edit Book page, using book._id */}
        <Link
          to={`/edit/${book._id}`}
          className="bg-black-500 hover:bg-blue-600 text-white text-center py-1 rounded transition duration-200" // Adjusted class for visibility
        >
          ✏️ Edit
        </Link>

        {book.available ? (
          // Link to Borrow Book page, using book._id
          <Link
            to={`/borrow-book/${book._id}`}
            className="bg-green-500 hover:bg-green-600 text-white text-center py-1 rounded transition duration-200"
          >
            📖 Borrow Book
          </Link>
        ) : (
          // Link to Return Book page, using book._id
          <Link
            to={`/return-book/${book._id}`}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-center py-1 rounded transition duration-200"
          >
            🔄 Return Book
          </Link>
        )}

        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="bg-red-500 hover:bg-red-600 text-white text-center py-1 rounded transition duration-200"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;