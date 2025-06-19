import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MessageModal from "../components/MessageModal"; // Import the new modal component

function BorrowBook() {
  const { id } = useParams(); // MongoDB _id
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [user, setUser] = useState({
    name: "",
    department: "",
    section: "",
    borrowDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState(null); // State to control the MessageModal

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch book from backend
        const res = await fetch(`http://localhost:5074/api/books/${id}`); // Use backend URL and port
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
          throw new Error(`HTTP error! Status: ${res.status}, Message: ${errorData.message || res.statusText}`);
        }
        const data = await res.json();
        setBook(data);
      } catch (err) {
        console.error("Error fetching book:", err);
        setError(`Failed to load book: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]); // Only re-run if 'id' changes

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleBorrow = async () => {
    if (!user.name || !user.department || !user.section || !user.borrowDate) {
      setError("Please fill all fields"); // Set error for UI display
      return;
    }

    try {
      const res = await fetch(`http://localhost:5074/api/books/${id}/borrow`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: false, borrowInfo: user }),
      });

      if (res.ok) {
        // Set modal message on successful borrow, replacing alert()
        setModalMessage("The Book must be returned within 15 days!");
      } else {
        const errorData = await res.json().catch(() => ({ message: "Unknown error" }));
        console.error("Failed to borrow book:", errorData);
        setError(`Failed to borrow book: ${errorData.message || res.statusText}`); // Display error
      }
    } catch (err) {
      console.error("Borrow error:", err);
      setError(`Network error during borrow: ${err.message}`); // Display network error
    }
  };

  // Function to close the modal and then navigate to the home page
  const handleModalClose = () => {
    setModalMessage(null); // Clear the message to hide the modal
    navigate("/"); // Navigate back to the home page
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
                    onClick={() => navigate('/')}
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

  // Input styling from BookForm for consistency
  const inputClassName = "w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Borrow: {book.title}</h2>

        {/* Input fields */}
        <input className={inputClassName} type="text" name="name" placeholder="Your Name" value={user.name} onChange={handleChange} required />
        <input className={inputClassName} type="text" name="department" placeholder="Department" value={user.department} onChange={handleChange} required />
        <input className={inputClassName} type="text" name="section" placeholder="Section" value={user.section} onChange={handleChange} required />
        <input className={inputClassName} type="date" name="borrowDate" value={user.borrowDate} onChange={handleChange} required />

        <button onClick={handleBorrow} className="bg-green-600 hover:bg-green-700 text-white font-semibold w-full py-3 rounded-lg shadow-lg transition duration-200">
          Borrow Book
        </button>
      </div>

      {/* Render the MessageModal if modalMessage has content */}
      <MessageModal message={modalMessage} onClose={handleModalClose} />
    </div>
  );
}

export default BorrowBook;
