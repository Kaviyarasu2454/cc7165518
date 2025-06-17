import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function BorrowBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [user, setUser] = useState({
    name: "",
    department: "",
    section: "",
    borrowDate: "",
  });

  useEffect(() => {
    const allBooks = JSON.parse(localStorage.getItem("books")) || [];
    const found = allBooks.find((b) => b.id === Number(id));
    setBook(found);
  }, [id]);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleBorrow = () => {
    if (!user.name || !user.department || !user.section || !user.borrowDate) {
      alert("Please fill all fields");
      return;
    }

    const books = JSON.parse(localStorage.getItem("books")) || [];
    const updated = books.map((b) =>
      b.id === Number(id) ? { ...b, available: false, borrowInfo: user } : b
    );
    localStorage.setItem("books", JSON.stringify(updated));

    alert("The book must be returned after 10 days!");
    navigate("/");
  };

  if (!book)
    return <p className="text-center text-white mt-10">No book found.</p>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4">
      <div className="w-full max-w-md bg-[#1e293b] text-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Borrow: {book.title}</h2>

        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="name"
          placeholder="Your Name"
          onChange={handleChange}
        />
        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="department"
          placeholder="Department"
          onChange={handleChange}
        />
        <input
          className="w-full p-2 mb-3 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="text"
          name="section"
          placeholder="Section"
          onChange={handleChange}
        />
        <input
          className="w-full p-2 mb-4 rounded bg-[#334155] text-white placeholder-gray-300 border border-gray-500"
          type="date"
          name="borrowDate"
          onChange={handleChange}
        />

        <button
          onClick={handleBorrow}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full py-2 rounded"
        >
          Borrow Book
        </button>
      </div>
    </div>
  );
}

export default BorrowBook;
