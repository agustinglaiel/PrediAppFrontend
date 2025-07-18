// src/hooks/useSearchPost.js
import { useState, useEffect } from "react";
import useDebounce from "./useDebounce";
import { searchPosts } from "../api/posts";

/**
 * Hook para buscar posts con debounce.
 *
 * @param {string} initialQuery Valor inicial del campo de búsqueda
 * @param {number} offset
 * @param {number} limit
 */
export default function useSearchPost(initialQuery = "", offset = 0, limit = 10) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // solo lanza la búsqueda 500ms tras el último cambio
  const debounced = useDebounce(query, 500);

  useEffect(() => {
    // si campo vacío, limpiamos
    if (!debounced) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    searchPosts(debounced, offset, limit)
      .then(data => {
        if (!cancelled) {
          setResults(data);
          setError(null);
        }
      })
      .catch(err => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debounced, offset, limit]);

  return { query, setQuery, results, loading, error };
}
