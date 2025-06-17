import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function ReturnBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [returnDate, setReturnDate] = useState("");
  const [userDetails, setUserDetails] = useState({
    name: "",
    department: "",
    section: "",
    borrowDate: "",
  });

  useEffect(() => {
    const books = JSON.parse(localStorage.getItem("books")) || [];
    const found = books.find((b) => b.id === Number(id));
    if (found && found.borrowInfo) {
      setUserDetails({
        name: found.borrowInfo.name || "",
        department: found.borrowInfo.department || "",
        section: found.borrowInfo.section || "",
        borrowDate: found.borrowInfo.borrowDate || "",
      });
    }
    setBook(found);
  }, [id]);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleReturn = () => {
    if (!returnDate) {
      alert("Please enter return date");
      return;
    }

    const borrowDateObj = new Date(userDetails.borrowDate);
    const returnDateObj = new Date(returnDate);
    const daysBorrowed = Math.floor(
      (returnDateObj - borrowDateObj) / (1000 * 60 * 60 * 24)
    );

    if (daysBorrowed > 10) {
      alert("You have kept the book for more than 10 days!");
    } else {
      alert("Book returned successfully!");
    }

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updated = books.map((b) =>
      b.id === Number(id) ? { ...b, available: true, borrowInfo: null } : b
    );
    localStorage.setItem("books", JSON.stringify(updated));
    navigate("/");
  };

  if (!book)
    return <p className="text-center text-white">No book found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Return: {book.title}</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="name"
          value={userDetails.name}
          onChange={handleChange}
          placeholder="Your Name"
        />

        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="department"
          value={userDetails.department}
          onChange={handleChange}
          placeholder="Department"
        />

        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="section"
          value={userDetails.section}
          onChange={handleChange}
          placeholder="Section"
        />

        <input
          className="w-full p-2 mb-3 rounded bg-[#475569] text-white border border-gray-500"
          type="text"
          name="borrowDate"
          value={userDetails.borrowDate}
          readOnly
          placeholder="Borrow Date"
        />

        <input
          className="w-full p-2 mb-4 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          placeholder="Return Date"
        />

        <button
          onClick={handleReturn}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold w-full py-2 rounded"
        >
          Return Book
        </button>
      </div>
    </div>
  );
}

export default ReturnBook;
