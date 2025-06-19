import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to get token

function BookForm({ onFormSubmit, initialData }) { 
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    available: true,
  });

  const navigate = useNavigate();
  const { user } = useAuth(); // Get user (which contains the token)

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        available: initialData.available ?? true, 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.author) {
      console.warn("Title and Author are required!");
      return;
    }

    const method = initialData ? 'PUT' : 'POST';
    // Use VITE_BACKEND_URL from environment variables
    const url = initialData 
      ? `${import.meta.env.VITE_BACKEND_URL}/api/books/${initialData._id}` // Use _id for edit
      : `${import.meta.env.VITE_BACKEND_URL}/api/books`; // No _id for new book

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` // Send token for protected routes
        },
        body: JSON.stringify(form), 
      });

      if (response.ok) { 
        const responseData = await response.json();
        console.log("Book submitted successfully:", responseData);
        
        if (onFormSubmit) {
            onFormSubmit(responseData);
        }
        
        navigate('/home'); // Navigate back to the home page after successful submission
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        console.error("Failed to submit book:", errorData);
        console.warn(`Failed to submit form: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error submitting form:", error);
      console.warn("Network error. Failed to submit form. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e293b] p-8 shadow-2xl rounded-xl max-w-md mx-auto mt-10 text-white"
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        {initialData ? "Edit Book" : "Add New Book"}
      </h2>

      <input
        className="w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="title"
        placeholder="Book Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        name="genre"
        placeholder="Genre"
        value={form.genre}
        onChange={handleChange}
      />
      <input
        className="w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="number"
        name="year"
        placeholder="Published Year"
        value={form.year}
        onChange={handleChange}
      />
      <textarea
        className="w-full p-3 border border-[#334155] rounded-lg mb-4 bg-[#0f172a] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows="3"
      ></textarea>

      <label className="block mb-6 text-gray-300"> 
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
          className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
        />
        Available
      </label>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75 shadow-lg"
      >
        {initialData ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;
