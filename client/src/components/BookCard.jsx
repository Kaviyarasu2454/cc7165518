import { Link, useNavigate } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import useAuth to get the authentication token

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get the authenticated user object, which contains the token

  const handleDelete = async () => {
    console.log("Confirming delete for book:", book.title);
    const confirmDelete = true; // Replace with a custom modal in production

    if (!confirmDelete) return;

    try {
      // Use the VITE_BACKEND_URL from environment variables for dynamic URL
      // Add Authorization header with the user's token, as book routes are protected
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${book._id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${user?.token}`, // Send the token if user and token exist
        },
      });

      if (res.ok) { // Check if the response status is 2xx (e.g., 200 OK)
        console.log("Book deleted successfully:", book.title);
        onDelete(book._id); // Inform the parent component (Home.jsx) to update its state
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Failed to delete the book:", errorData);
        // Log a warning to the console, replace with a user-friendly toast/modal in a real app
        console.warn(`Failed to delete the book: ${errorData.message || res.statusText}. Please ensure you are logged in.`);
      }
    } catch (err) {
      console.error("Delete error (network or unexpected):", err);
      // Log a warning to the console, replace with a user-friendly toast/modal in a real app
      console.warn("Network error during delete. Please check your connection and ensure backend is running.");
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
        {/* Link to Edit Book page, using book._id and VITE_BACKEND_URL */}
        <Link
          to={`/edit/${book._id}`}
          // FIX: Changed bg-black-500 to bg-blue-500 for better visibility
          className="bg-blue-500 hover:bg-blue-600 text-white text-center py-1 rounded transition duration-200" 
        >
          ✏️ Edit
        </Link>

        {book.available ? (
          // Link to Borrow Book page, using book._id and VITE_BACKEND_URL
          <Link
            to={`/borrow-book/${book._id}`}
            className="bg-green-500 hover:bg-green-600 text-white text-center py-1 rounded transition duration-200"
          >
            📖 Borrow Book
          </Link>
        ) : (
          // Link to Return Book page, using book._id and VITE_BACKEND_URL
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
