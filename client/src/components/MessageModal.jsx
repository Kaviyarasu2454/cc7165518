    // client/src/components/MessageModal.jsx

    import React from 'react';

    function MessageModal({ message, onClose }) {
      if (!message) return null; 

      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-gray-800 animate-scaleIn">
            <p className="text-lg font-semibold mb-6 text-center">{message}</p>
            <div className="flex justify-center">
              <button
                onClick={onClose} 
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      );
    }

    export default MessageModal;
    