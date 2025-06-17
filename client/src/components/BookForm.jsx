import { useState, useEffect } from 'react';

function BookForm({ onAdd, initialData }) {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    year: "",
    description: "",
    available: true,
    id: Date.now(), // ✅ Add unique ID by default
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        id: initialData.id || Date.now(), // ✅ Make sure ID exists
        available: initialData.available ?? true, // ✅ Default to true if undefined
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author) {
      return alert("Title and Author are required");
    }

    // ✅ Ensure 'id' and 'available' exist
    const finalData = {
      ...form,
      id: form.id || Date.now(),
      available: form.available ?? true,
    };

    onAdd(finalData);

    // 🔁 Reset the form after submission
    setForm({
      title: "",
      author: "",
      genre: "",
      year: "",
      description: "",
      available: true,
      id: Date.now(), // ✅ New ID for new entry
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 p-6 shadow-md rounded-xl max-w-md mx-auto text-white"
    >
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "Edit Book" : "Add New Book"}
      </h2>

      <input
        className="w-full p-2 border mb-3 text-white"
        type="text"
        name="title"
        placeholder="Book Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-2 border mb-3 text-white"
        type="text"
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        required
      />
      <input
        className="w-full p-2 border mb-3 text-white"
        type="text"
        name="genre"
        placeholder="Genre"
        value={form.genre}
        onChange={handleChange}
      />
      <input
        className="w-full p-2 border mb-3 text-white"
        type="number"
        name="year"
        placeholder="Published Year"
        value={form.year}
        onChange={handleChange}
      />
      <textarea
        className="w-full p-2 border mb-3 text-white"
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        rows="3"
      ></textarea>

      <label className="block mb-3">
        <input
          type="checkbox"
          name="available"
          checked={form.available}
          onChange={handleChange}
          className="mr-2"
        />
        Available
      </label>

      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
      >
        {initialData ? "Update Book" : "Add Book"}
      </button>
    </form>
  );
}

export default BookForm;
