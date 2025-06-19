// client/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth(); // Get auth state and logout function
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call logout from AuthContext
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <nav className="w-full bg-[#1E293B] shadow-md">
      <div className="max-w-5xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold text-white">MyBook Store</h1>
        <div className="space-x-6 flex items-center">
          {/* Link to Home will now conditionally go to Intro or Book List based on login */}
          <Link to="/" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">Home</Link>
          
          {isAuthenticated ? (
            <>
              {/* Show Add Book link only if authenticated */}
              <Link to="/add" className="text-blue-400 hover:text-blue-300 font-medium transition duration-200">Add Book</Link>
              <span className="text-gray-300">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="text-red-400 hover:text-red-300 font-medium transition duration-200 focus:outline-none"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Show Login/Register links if not authenticated */}
              <Link to="/login" className="text-green-400 hover:text-green-300 font-medium transition duration-200">Login</Link>
              <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium transition duration-200">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
