import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";

function AddBook() {
  const navigate = useNavigate();

  const handleAdd = (book) => {
    const existing = JSON.parse(localStorage.getItem("books")) || [];
    const updated = [...existing, book];
    localStorage.setItem("books", JSON.stringify(updated));
    navigate("/");
  };

  return (
    <div>
      <BookForm onAdd={handleAdd} />
    </div>
  );
}

export default AddBook;
