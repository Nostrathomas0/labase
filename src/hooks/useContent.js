// src/hooks/useContent.js
import { useEffect, useState } from 'react';
import { loadContent } from '../utils/contentLoader';

// Loads a catalogue entry's JSON. Returns { data, error, loading }.
export const useContent = (entry) => {
  const [state, setState] = useState({ data: null, error: null, loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ data: null, error: null, loading: true });
    loadContent(entry)
      .then((data) => { if (!cancelled) setState({ data, error: null, loading: false }); })
      .catch((error) => {
        console.error('Content failed to load:', entry && entry.id, error);
        if (!cancelled) setState({ data: null, error, loading: false });
      });
    return () => { cancelled = true; };
  }, [entry]);

  return state;
};

export default useContent;
