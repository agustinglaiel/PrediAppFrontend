import React, { useState } from "react";
import PropTypes from "prop-types";
import MessageStatus from "../MessageStatus";

export default function NewPostModal({ onClose, onSubmit, userId, parentPostId }) {
  const [body, setBody]       = useState("");
  const [status, setStatus]   = useState(null);
  const [errorText, setErrorText] = useState("");

  const handleSend = async () => {
    try {
      await onSubmit({ userId, body, parentPostId });
      onClose();
    } catch (err) {
      setStatus(err.status || 500);
      setErrorText(err.message);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="fixed inset-x-4 bottom-24 bg-white rounded-lg p-4 z-50 shadow-lg">
        <textarea
          rows={4}
          className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
          placeholder="¿Qué quieres compartir?"
          value={body}
          onChange={e => setBody(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            className="px-3 py-1 text-red-400 hover:text-red-600 text-sm font-medium"
            title="Cancelar"
          >
            Cancelar
          </button>
          <button
            onClick={handleSend}
            className="px-3 py-1 text-blue-400 hover:text-blue-600 text-sm font-medium"
            title="Publicar"
          >
            Publicar
          </button>
        </div>
        {status != null && (
          <MessageStatus
            text={errorText}
            status={status}
            onHide={() => setStatus(null)}
          />
        )}
      </div>
    </>
  );
}

NewPostModal.propTypes = {
  onClose:      PropTypes.func.isRequired,
  onSubmit:     PropTypes.func.isRequired,
  userId:       PropTypes.number.isRequired,
  parentPostId: PropTypes.number,
};