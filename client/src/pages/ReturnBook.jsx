import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import MessageModal from "../components/MessageModal";
import { useAuth } from '../context/AuthContext'; // Import useAuth to get token

// Constants for fine calculation
const GRACE_PERIOD_DAYS = 15;
const FINE_PER_DAY = 10;

function ReturnBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user (which contains the token)

  const [book, setBook] = useState(null);
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        // Use VITE_BACKEND_URL for the deployed backend
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}` // Send token for protected route
          }
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || res.statusText}`);
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(`Failed to load book for return: ${err.message}`);
        navigate('/home'); // Navigate to home if error
      } finally {
        setLoading(false);
      }
    };

    if (user && user.token) { // Only fetch if user and token exist
      fetchBook();
    } else {
      setLoading(false);
    }
  }, [id, navigate, user]);

  const handleReturn = async () => {
    if (!returnDate) {
      setError("Please enter return date to proceed.");
      return;
    }

    let finalMessage = "Book returned successfully!";
    let fineAmount = 0;

    const borrowDateStr = book?.borrowInfo?.borrowDate;
    if (borrowDateStr) {
      const borrowDateObj = new Date(borrowDateStr);
      const returnDateObj = new Date(returnDate);

      if (isNaN(borrowDateObj.getTime()) || isNaN(returnDateObj.getTime())) {
          setError("Invalid borrow or return date. Cannot calculate fine.");
          return;
      }

      const diffTime = Math.abs(returnDateObj.getTime() - borrowDateObj.getTime());
      const daysBorrowed = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      console.log(`Book was borrowed for ${daysBorrowed} days.`);

      if (daysBorrowed > GRACE_PERIOD_DAYS) {
        const daysExceeded = daysBorrowed - GRACE_PERIOD_DAYS;
        fineAmount = daysExceeded * FINE_PER_DAY;
        finalMessage = `You kept the book for ${daysBorrowed} days. Days exceeded: ${daysExceeded}. Your fine is ${fineAmount} rupees.`;
      }
    } else {
        console.warn("Borrow information not found for the book. No fine will be calculated.");
    }

    try {
      // Use VITE_BACKEND_URL for the deployed backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}/return`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}` // Send token for protected route
        },
        body: JSON.stringify({ available: true, borrowInfo: null }),
      });

      if (res.ok) {
        setModalMessage(finalMessage);
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Failed to return book:", errorData);
        setError(`Failed to return book: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Return error:", err);
      setError(`Network error during return: ${err.message}`);
    }
  };

  const handleModalClose = () => {
    setModalMessage(null);
    navigate("/home"); // Navigate to home after modal is closed
  };


  if (loading) {
    return <p className="text-center text-gray-300 mt-10">Loading book details...</p>;
  }

  if (error) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
            <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md text-center">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                    onClick={() => navigate('/home')} // Navigate to home
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
  }

  if (!book) {
    return <p className="text-center text-gray-300 mt-10">Book not found for returning.</p>;
  }

  const inputClassName = "w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Return: {book.title}</h2>

        <p className="text-sm text-gray-300 mb-2"><strong>Name:</strong> {book.borrowInfo?.name || "N/A"}</p>
        <p className="text-sm text-gray-300 mb-2"><strong>Department:</strong> {book.borrowInfo?.department || "N/A"}</p>
        <p className="text-sm text-gray-300 mb-2"><strong>Section:</strong> {book.borrowInfo?.section || "N/A"}</p>
        <p className="text-sm text-gray-300 mb-4">
            <strong>Borrowed On:</strong>{" "}
            {book.borrowInfo?.borrowDate
                ? new Date(book.borrowInfo.borrowDate).toLocaleDateString()
                : "N/A"}
        </p>

        <input 
          className={inputClassName} 
          type="date" 
          value={returnDate} 
          onChange={(e) => setReturnDate(e.target.value)} 
          required 
        />

        <button onClick={handleReturn} className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold w-full py-2 rounded">
          Return Book
        </button>
      </div>

      <MessageModal message={modalMessage} onClose={handleModalClose} />
    </div>
  );
}

export default ReturnBook;
