import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Import AuthProvider and useAuth
import Navbar from './components/Navbar'; // Import the new Navbar

// Import all your existing pages/components
import Home from "./pages/Home";
import AddBook from "./pages/AddBook";
import EditBook from "./components/EditBook"; // Path confirmed from your previous App.jsx
import BorrowBook from "./pages/BorrowBook";
import ReturnBook from "./pages/ReturnBook";

// NEW: Import authentication pages
import IntroPage from './pages/IntroPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Component to protect routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth(); // Get authentication status

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the children (the protected component)
  return children;
};

function AppContent() { // Renamed App to AppContent to wrap with AuthProvider
  const { isAuthenticated } = useAuth(); // Use useAuth inside AuthProvider

  return (
    <div className="min-h-screen flex flex-col bg-[#0F172A]">
      <Navbar /> {/* Render the new Navbar component here */}

      <main className="flex-1 flex justify-center items-start">
        {/* Adjusted main container to fill width with some padding */}
        <div className="w-full max-w-5xl bg-[#1E293B] rounded-lg shadow p-8 mt-8 mx-4 lg:mx-auto"> 
          <Routes>
            {/* Public Routes */}
            {/* If logged in, navigate to /home; otherwise, show IntroPage as the default landing */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/home" replace /> : <IntroPage />} /> 
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes - only accessible if logged in */}
            <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/add" element={<ProtectedRoute><AddBook /></ProtectedRoute>} />
            <Route path="/edit/:id" element={<ProtectedRoute><EditBook /></ProtectedRoute>} />
            <Route path="/borrow-book/:id" element={<ProtectedRoute><BorrowBook /></ProtectedRoute>} />
            <Route path="/return-book/:id" element={<ProtectedRoute><ReturnBook /></ProtectedRoute>} />

            {/* Redirect any unmatched routes to intro if not logged in, or home if logged in */}
            {/* This catches typos or direct access to non-existent protected routes */}
            <Route path="*" element={isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the entire app content with AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
