import { useNavigate } from "react-router-dom";

function BookCard({ book, onDelete }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white shadow-md rounded-xl p-4 text-gray-800 w-full max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
      <p><strong>Author:</strong> {book.author}</p>
      <p><strong>Genre:</strong> {book.genre}</p>
      <p><strong>Year:</strong> {book.year}</p>
      <p><strong>Description:</strong> {book.description}</p>
      <p>
        <strong>Available:</strong>{" "}
        <span className={book.available ? "text-green-600" : "text-red-600"}>
          {book.available ? "Yes" : "No"}
        </span>
      </p>

      <div className="mt-4 flex gap-3">
        <button
          onClick={() => navigate(`/edit/${book.id}`)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(book.id)}
          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default BookCard;
