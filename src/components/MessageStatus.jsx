// src/components/MessageStatus.jsx
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const MessageStatus = ({ text, status, onHide }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onHide, 300); // Espera a que termine la animación
    }, 3000);
    return () => clearTimeout(id);
  }, [onHide]);

  const color =
    status >= 200 && status < 300
      ? "bg-green-600"
      : status >= 400 && status < 500
      ? "bg-red-600"
      : "bg-yellow-600";

  return (
    <div
      className={`fixed bottom-20 left-4 right-4 z-50 ${color} text-white px-4 py-3 rounded-lg shadow-lg text-center transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {text}
    </div>
  );
};

MessageStatus.propTypes = {
  text:   PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
  onHide: PropTypes.func.isRequired,
};

export default MessageStatus;
