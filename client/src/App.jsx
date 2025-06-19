import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import EditBook from "./components/EditBook"; // Confirmed path based on your provided App.jsx
import BorrowBook from "./pages/BorrowBook";
import ReturnBook from "./pages/ReturnBook";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0F172A]"> {/* Adjusted background */}
        <nav className="w-full bg-[#1E293B] shadow-md"> {/* Adjusted background */}
          <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
            <h1 className="text-2xl font-bold text-white">MyBook Store</h1> {/* Adjusted text color */}
            <div className="space-x-6">
              <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">Home</Link> {/* Adjusted link color */}
              <Link to="/add" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">Add Book</Link> {/* Adjusted link color */}
            </div>
          </div>
        </nav>

        <main className="flex-1 flex justify-center items-start">
          <div className="w-full max-w-5xl bg-[#1E293B] rounded-lg shadow p-8 mt-8"> {/* Adjusted background */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/add" element={<AddBook />} />
              <Route path="/edit/:id" element={<EditBook />} />
              <Route path="/borrow-book/:id" element={<BorrowBook />} />
              <Route path="/return-book/:id" element={<ReturnBook />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
