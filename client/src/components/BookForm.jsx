import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Renamed onAdd to onFormSubmit for clarity, although the component now directly navigates
function BookForm({ onFormSubmit, initialData }) { 
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    available: true,
    // Removed 'id: Date.now()' as MongoDB will generate '_id'
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      // When editing, populate form with initialData, using _id if available
      setForm({
        ...initialData,
        // Ensure 'available' defaults to true if not explicitly set
        available: initialData.available ?? true, 
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!form.title || !form.author) {
      console.warn("Title and Author are required!");
      // Replace alert with a custom message/toast
      // alert("Title and Author are required");
      return;
    }

    // Determine HTTP method (POST for new, PUT for existing)
    const method = initialData ? 'PUT' : 'POST';
    // Construct the API URL. Use book._id for editing existing books.
    const url = initialData 
      ? `http://localhost:5074/api/books/${initialData._id}` // Use _id for edit
      : 'http://localhost:5074/api/books'; // No _id for new book

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        // Send the entire form state as the request body
        body: JSON.stringify(form),
      });

      if (response.ok) { // Check if the response status is 2xx (successful)
        const responseData = await response.json();
        console.log("Book submitted successfully:", responseData);
        
        // If onFormSubmit is provided, call it. This allows the parent to react (e.g., re-fetch).
        // However, since we're navigating immediately, it might not always be needed for simple forms.
        if (onFormSubmit) {
            onFormSubmit(responseData); // Pass response data back to parent if needed
        }
        
        navigate('/'); // Navigate back to the home page after successful submission
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
        console.error("Failed to submit book:", errorData);
        // Replace alert with a custom message/toast
        // alert(`Failed to submit form: ${errorData.message || response.statusText}`);
        console.warn(`Failed to submit form: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      console.error("Network error submitting form:", error);
      // Replace alert with a custom message/toast
      // alert("Network error. Failed to submit form. Please try again.");
      console.warn("Network error. Failed to submit form. Please try again.");
    }

    // No need to reset form here as we navigate away.
    // If you were staying on the same page, you'd reset the form here.
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#1e293b] p-8 shadow-2xl rounded-xl max-w-md mx-auto mt-10 text-white" // Adjusted background and text color
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        {initialData ? "Edit Book" : "Add New Book"}
      </h2>

      {/* Input Fields with updated styling for visibility */}
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

      {/* Checkbox for availability */}
      <label className="block mb-6 text-gray-300"> {/* Adjusted text color for contrast */}
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
          className="mr-2 h-4 w-4 text-blue-600 rounded focus:ring-blue-500" // Added classes for checkbox
        />
        Available
      </label>

      {/* Submit Button */}
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
