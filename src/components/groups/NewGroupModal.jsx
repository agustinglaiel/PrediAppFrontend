import { useState } from "react";
import { createGroup } from "../../api/groups";

const NewGroupModal = ({ userId, onSuccess, onClose }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    try {
      setLoading(true);
      const newGroup = await createGroup({
        groupName: groupName.trim(),
        description: description.trim(),
        userId,
      });
      setMsg({ type: "success", text: "Grupo creado con éxito." });
      onSuccess(newGroup); // informa a la página
    } catch (err) {
      setMsg({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* 🠗 mx-4 agrega separación lateral en pantallas pequeñas */}
      <div className="bg-white rounded-lg w-full max-w-md mx-4 p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Crear nuevo grupo</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Nombre del grupo
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Descripción <span className="text-gray-400">(opcional)</span>
            </label>
            <textarea
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe brevemente tu grupo…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {msg && (
            <p
              className={`text-sm ${
                msg.type === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {msg.text}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Creando…" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewGroupModal;
