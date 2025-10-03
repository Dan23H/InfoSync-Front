import { useState, useEffect, useCallback } from "react";
import { getPensums, createPensum, updatePensum, deletePensum, getPensumById } from "../api/endpoints";
import type { PensumDto, Pensum } from "../models";

export function usePensums() {
  const [data, setData] = useState<Pensum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPensums = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPensums();
      setData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPensumById = useCallback(async (id: string) => {
    try {
      return await getPensumById(id);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  }, []);

  const addPensum = useCallback(async (dto: PensumDto) => {
    try {
      const result = await createPensum(dto);
      setData((prev) => [...prev, result]);
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const editPensum = useCallback(async (id: string, dto: PensumDto) => {
    try {
      const result = await updatePensum(id, dto);
      setData((prev) => prev.map((p) => (p._id === id ? result : p)));
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  const removePensum = useCallback(async (id: string) => {
    try {
      await deletePensum(id);
      setData((prev) => prev.filter((p) => p._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    fetchPensums();
  }, [fetchPensums]);

  return {
    data,
    loading,
    error,
    fetchPensums,
    fetchPensumById,
    addPensum,
    editPensum,
    removePensum,
  };
}
