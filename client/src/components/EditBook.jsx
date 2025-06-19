import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // THIS IS THE CORRECTED LINE

import BookForm from '../components/BookForm'; 

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user (which contains the token)

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use VITE_BACKEND_URL for the deployed backend
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}` // Send token for protected route
          }
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorData.message || response.statusText}`);
        }

        const data = await response.json();
        setBook(data); 
      } catch (err) {
        console.error("Error fetching book for edit:", err);
        setError(`Failed to load book for editing: ${err.message}`);
        console.warn("Book not found or failed to load for editing.");
        navigate('/home'); // Navigate to home if book not found or error
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) { // Only fetch if user and token exist
      fetchBook();
    } else {
      setLoading(false); 
      // If no user/token, it means not authenticated, ProtectedRoute will handle redirect
      // Or you might want to show an error message if this page is directly accessed without login
    }
  }, [id, navigate, user]); // Depend on id, navigate, and user (for token)

  const handleUpdate = (updatedBook) => {
    console.log("BookForm finished updating book:", updatedBook);
    // BookForm already navigates back to /home after submission
  };

  if (loading) {
    return <p className="text-center text-white mt-10">Loading book details for edit...</p>;
  }

  if (error) {
    return (
        <div className="flex justify-center items-center h-48 bg-[#0F172A] rounded-lg shadow-md mx-auto mt-10 p-4"> {/* Adjusted background */}
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg relative" role="alert">
                <strong className="font-bold text-lg">Error!</strong>
                <p className="block sm:inline ml-2 text-base">{error}</p>
                <button
                    onClick={() => navigate('/home')} // Navigate to /home
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
