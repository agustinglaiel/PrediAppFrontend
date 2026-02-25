import React from "react";

const SubmitButton = ({
  isDisabled,
  label = "Enviar pronóstico",
  className,
}) => {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className={`w-full py-3.5 rounded-xl text-base font-bold tracking-wide transition-all duration-200 ${
        isDisabled
          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
          : "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] shadow-lg shadow-red-600/30"
      } ${className || ""}`}
    >
      {label}
    </button>
  );
};

export default SubmitButton;
