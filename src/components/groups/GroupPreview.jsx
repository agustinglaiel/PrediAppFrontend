// src/components/GroupPreview.jsx
import React from "react";

const GroupPreview = ({ name, count }) => (
  <div className="flex justify-between items-center bg-green-100 rounded-lg px-4 py-3 shadow-sm">
    <span className="font-bold text-gray-800">{name}</span>
    <span className="text-gray-800">{count} miembros</span>
  </div>
);

export default GroupPreview;
