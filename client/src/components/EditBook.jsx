import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BookForm from '../components/BookForm'; // Path confirmed as components/EditBook from App.jsx

function EditBook() {
  const { id } = useParams(); // This 'id' is now the MongoDB '_id'
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch the specific book from the backend using its _id
        const response = await fetch(`http://localhost:5074/api/books/${id}`); // Use backend URL and port

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        setBook(data); // Set the fetched book data
      } catch (err) {
        console.error("Error fetching book for edit:", err);
        setError(`Failed to load book for editing: ${err.message}`);
        // Replace alert with a custom message/toast
        // alert("Book not found or failed to load!");
        console.warn("Book not found or failed to load for editing.");
        navigate('/'); // Navigate home if book not found or error
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, navigate]); // Depend on id and navigate

  // The BookForm component itself handles the PUT request now
  // handleUpdate would be triggered by onFormSubmit if you needed additional logic here
  const handleUpdate = (updatedBook) => {
    console.log("BookForm finished updating book:", updatedBook);
    // BookForm already navigates back to '/'
    // If you needed other logic here (e.g., show a toast), you'd put it.
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Loading book details for edit...</p>;
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-48 bg-red-50 rounded-lg shadow-md mx-auto mt-10 p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
                <strong className="font-bold text-lg">Error!</strong>
                <p className="block sm:inline ml-2 text-base">{error}</p>
                <button
                    onClick={() => navigate('/')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
  }

  return (
    <div>
      {book ? (
        <BookForm onFormSubmit={handleUpdate} initialData={book} />
      ) : (
        <p className="text-center text-white mt-10">No book found for editing.</p>
      )}
    </div>
  );
}

export default EditBook;
