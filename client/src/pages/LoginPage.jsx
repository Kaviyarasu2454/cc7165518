// client/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
import MessageModal from '../components/MessageModal'; // For displaying messages

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [modalMessage, setModalMessage] = useState(null); // For success/error modals
  const navigate = useNavigate();
  const { login } = useAuth(); // Get login function from AuthContext

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    try {
      // Use VITE_BACKEND_URL for the deployed backend
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data); // Call login from AuthContext to set user and token
        setModalMessage("Login successful!");
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Invalid credentials or server error.' }));
        setError(errorData.message);
        setModalMessage(`Login failed: ${errorData.message}`);
      }
    } catch (err) {
      console.error("Login network error:", err);
      setError("Network error during login. Please try again.");
      setModalMessage("Network error during login. Please try again.");
    }
  };

  const handleModalClose = () => {
    setModalMessage(null);
    if (!error) { // If login was successful, navigate to home
      navigate('/home'); // Navigate to /home (protected route)
    }
  };

  // Input and button styles consistent with BorrowBook.jsx / BookForm.jsx
  const inputClassName = "w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonClassName = "w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 shadow-lg";


  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F172A] p-6">
      <div className="bg-[#1E293B] p-8 rounded-xl shadow-2xl max-w-md w-full text-white">
        <h2 className="text-3xl font-bold mb-6 text-center text-blue-400">Login</h2>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={inputClassName}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClassName}
            required
          />
          
          {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

          <button type="submit" className={buttonClassName}>
            Login
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-purple-400 hover:underline">
            Register here
          </Link>
        </p>
      </div>
      <MessageModal message={modalMessage} onClose={handleModalClose} />
    </div>
  );
}

export default LoginPage;
