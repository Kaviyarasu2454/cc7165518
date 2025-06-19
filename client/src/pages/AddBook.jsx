import { useNavigate } from "react-router-dom";
import BookForm from "../components/BookForm";

function AddBook() {
  const navigate = useNavigate();

  // This function would be called by BookForm's internal handleSubmit if onFormSubmit was used
  // However, BookForm now navigates directly, so this 'handleAdd' might not be strictly needed as a prop
  // If you need specific logic here AFTER BookForm's submission, you would use this.
  // For now, it's just a placeholder as BookForm handles everything.
  const handleAdd = (submittedBookData) => {
    console.log("BookForm submitted data:", submittedBookData);
    // You could potentially trigger a re-fetch on the Home page here if you weren't navigating away
  };

  return (
    <div className="container mx-auto p-4">
      {/* BookForm now handles its own fetch and navigation back to '/' */}
      <BookForm onFormSubmit={handleAdd} /> 
    </div>
  );
}

export default AddBook;
