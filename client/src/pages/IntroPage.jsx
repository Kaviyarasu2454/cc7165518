// client/src/pages/IntroPage.jsx

import React from 'react';
// Link is not needed if no internal links are left, but keeping for reference if you add other links later
// import { Link } from 'react-router-dom'; 

function IntroPage() {
  return (
    <div
      className="relative min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: `url('/library-background.jpg')`, // Path relative to the public folder
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay to darken the background image for better text readability */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-3xl text-center bg-gray-900 bg-opacity-80 p-10 rounded-xl shadow-2xl border border-gray-700">
        <h1 className="text-5xl font-extrabold mb-6 text-blue-400">Welcome to MyBook Store!</h1>
        <p className="text-lg mb-8 text-gray-200 leading-relaxed">
          Your personal library management system. Keep track of all your books, their authors, genres, and availability. Manage borrowing and returning with ease, and never lose track of a single title.
        </p>
        <p className="text-md mb-10 text-gray-300">
          Sign in or register using the navigation bar above to unlock the full features and manage your book collection!
        </p>
        {/*
          Removed the redundant Login/Register buttons from here.
          The Navbar now consistently handles these links when the user is not authenticated.
        */}
      </div>
    </div>
  );
}

export default IntroPage;
