import React, { useState, useRef, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { AuthContext } from "../contexts/AuthContext";

export default function Scoreboard({ data, loading, error }) {
  const { user } = useContext(AuthContext);
  const username = user?.username;
  const rows = (data || []).slice(0, 100);
  const containerRef = useRef(null);
  const userRowRef = useRef(null);
  const [stickyState, setStickyState] = useState("bottom");
  
  const updateStickyState = useCallback(() => {
    const contEl = containerRef.current;
    const rowEl = userRowRef.current;
    if (!contEl || !rowEl) return;
    
    const scrollTop = contEl.scrollTop;
    const viewportH = contEl.clientHeight;
    const rowOffsetTop = rowEl.offsetTop;
    const rowHeight = rowEl.clientHeight;
    
    // Si la fila del user está más abajo que el viewport
    if (rowOffsetTop + rowHeight > scrollTop + viewportH) {
      setStickyState("bottom");
    }
    // Si la fila está más arriba que el inicio visible
    else if (rowOffsetTop < scrollTop) {
      setStickyState("top");
    }
    else {
      setStickyState("normal");
    }
  }, []);
  
  useEffect(() => {
    const contEl = containerRef.current;
    if (!contEl || !username) return;
    
    // Posicionar inicialmente la fila del user al centro/bottom
    const idx = rows.findIndex(r => r.username === username);
    if (idx >= 0) {
      // Scroll un poco más arriba de su posición para que sticky funcione
      const rowOffsetTop = userRowRef.current.offsetTop;
      const viewportH = contEl.clientHeight;
      contEl.scrollTop = Math.max(0, rowOffsetTop - viewportH + userRowRef.current.clientHeight);
    }
    
    // Listener throttled con rAF
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateStickyState();
          ticking = false;
        });
        ticking = true;
      }
    };
    
    contEl.addEventListener("scroll", onScroll, { passive: true });
    updateStickyState();
    return () => contEl.removeEventListener("scroll", onScroll);
  }, [rows, username, updateStickyState]);
  
  if (loading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col min-h-0">
        <h2 className="text-2xl font-bold mb-4">Tabla de clasificación</h2>
        <p>Cargando clasificación…</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col min-h-0">
        <h2 className="text-2xl font-bold mb-4">Tabla de clasificación</h2>
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }
  
  // Calcular si necesitamos scroll (más de cierta cantidad de filas visibles)
  const needsScroll = rows.length > 10; // Ajusta este número según prefieras
  
  return (
    <div className="bg-white shadow-md rounded-lg flex flex-col overflow-hidden min-h-0 max-h-full">
      <h2 className="text-2xl font-bold p-4 flex-shrink-0 border-b-2 border-gray-300">Tabla de clasificación</h2>
      
      <div 
        ref={containerRef} 
        className={`${needsScroll ? 'flex-1 overflow-y-auto' : 'overflow-y-auto'} min-h-0`}
        style={{ 
          maxHeight: needsScroll ? '100%' : 'fit-content'
        }}
      >
        <table className="w-full border-collapse">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="h-10">
              <th className="text-center font-semibold text-gray-700 border-b border-gray-200">#</th>
              <th className="text-left font-semibold text-gray-700 pl-4 border-b border-gray-200">Usuario</th>
              <th className="text-right font-semibold text-gray-700 pr-4 border-b border-gray-200">Puntos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const isUser = row.username === username;
              const isLast = idx === rows.length - 1;
              let style = {};
              
              if (isUser && needsScroll) {
                if (stickyState === "bottom") style = { position: "sticky", bottom: 0 };
                else if (stickyState === "top") style = { position: "sticky", top: 0 };
              }
              
              return (
                <tr
                  key={row.username}
                  ref={isUser ? userRowRef : null}
                  style={style}
                  className={`
                    ${isUser ? "bg-red-100 font-semibold hover:bg-red-50" : "hover:bg-gray-50"}
                    ${isLast ? "border-b-2 border-gray-300" : "border-b border-gray-200"}
                  `}
                >
                  <td className="h-12 text-center text-gray-600">{idx + 1}</td>
                  <td className="h-12 pl-4 text-gray-800">{row.username}</td>
                  <td className="h-12 text-right pr-4 font-medium text-gray-900">{row.score}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

Scoreboard.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      username: PropTypes.string.isRequired,
      score: PropTypes.number.isRequired,
    })
  ).isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.instanceOf(Error),
};