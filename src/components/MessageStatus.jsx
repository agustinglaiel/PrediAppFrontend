// src/components/MessageStatus.jsx
import { useEffect } from "react";

const MessageStatus = ({ text, status, onHide }) => {
  /* Auto-desaparecer después de 3 s */
  useEffect(() => {
    const id = setTimeout(onHide, 3000);
    return () => clearTimeout(id);
  }, [onHide]);

  /* Colores por rango */
  const color =
    status >= 200 && status < 300
      ? "bg-green-600"
      : status >= 400 && status < 500
      ? "bg-red-600"
      : "bg-yellow-600"; // 300-, 500-, etc.

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 ${color} text-white px-4 py-3 rounded-lg shadow-lg text-center`}
    >
      {text}
    </div>
  );
};

export default MessageStatus;
