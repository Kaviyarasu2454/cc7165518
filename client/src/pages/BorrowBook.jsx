import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageModal from "../components/MessageModal";
import { useAuth } from '../context/AuthContext'; // Import useAuth to get token

function BorrowBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user (which contains the token)

  const [book, setBook] = useState(null);
  const [userBorrower, setUserBorrower] = useState({ // Renamed 'user' to 'userBorrower' to avoid conflict with auth user
    name: "",
    department: "",
    section: "",
    borrowDate: "",
  });
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
        setError(`Failed to load book: ${err.message}`);
        console.warn("Error fetching book for borrow.");
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

  const handleChange = (e) => {
    setUserBorrower({ ...userBorrower, [e.target.name]: e.target.value });
  };

  const handleBorrow = async () => {
    if (!userBorrower.name || !userBorrower.department || !userBorrower.section || !userBorrower.borrowDate) {
      setError("Please fill all fields");
      return;
    }

    try {
      // Use VITE_BACKEND_URL for the deployed backend
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/books/${id}/borrow`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.token}` // Send token for protected route
        },
        body: JSON.stringify({ available: false, borrowInfo: userBorrower }),
      });

      if (res.ok) {
        setModalMessage("The Book must be returned within 15 days!");
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Failed to borrow book:", errorData);
        setError(`Failed to borrow book: ${errorData.message || res.statusText}`);
      }
    } catch (err) {
      console.error("Borrow error:", err);
      setError(`Network error during borrow: ${err.message}`);
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
    return <p className="text-center text-gray-600 mt-10">No book found.</p>;
  }

  const inputClassName = "w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Borrow: {book.title}</h2>

        <input className={inputClassName} type="text" name="name" placeholder="Your Name" value={userBorrower.name} onChange={handleChange} required />
        <input className={inputClassName} type="text" name="department" placeholder="Department" value={userBorrower.department} onChange={handleChange} required />
        <input className={inputClassName} type="text" name="section" placeholder="Section" value={userBorrower.section} onChange={handleChange} required />
        <input className={inputClassName} type="date" name="borrowDate" value={userBorrower.borrowDate} onChange={handleChange} required />

        <button onClick={handleBorrow} className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-3 rounded-lg shadow-lg transition duration-200">
          Borrow Book
        </button>
      </div>

      <MessageModal message={modalMessage} onClose={handleModalClose} />
    </div>
  );
}

export default BorrowBook;
