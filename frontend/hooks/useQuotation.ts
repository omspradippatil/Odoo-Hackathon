import { useState } from 'react';
import { Quotation } from '../types';
import api from '../lib/api';

export const useQuotation = () => {
  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchQuotation = async (id: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/quotations/${id}`);
      setQuotation(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { quotation, fetchQuotation, loading };
};
