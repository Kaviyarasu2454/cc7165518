import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import BookForm from '../components/BookForm';

function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('books')) || [];
    const found = stored.find(b => b.id === parseInt(id));
    if (!found) return navigate('/');
    setBook(found);
  }, [id, navigate]);

  const handleUpdate = (updatedBook) => {
    const stored = JSON.parse(localStorage.getItem('books')) || [];
    const updatedList = stored.map(b => b.id === parseInt(id) ? updatedBook : b);
    localStorage.setItem('books', JSON.stringify(updatedList));
    navigate('/');
  };

  return (
    <div>
      {book && <BookForm onAdd={handleUpdate} initialData={book} />}
    </div>
  );
}

export default EditBook;
