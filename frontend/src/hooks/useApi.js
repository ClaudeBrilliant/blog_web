import { useState, useCallback } from 'react';

export default function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const call = useCallback(async (requestFn) => {
    setLoading(true);
    setError(null);
    try {
      const res = await requestFn();
      setLoading(false);
      return res.data;
    } catch (err) {
      setError(err.response?.data || err.message);
      setLoading(false);
      throw err;
    }
  }, []);

  return { call, loading, error };
}
