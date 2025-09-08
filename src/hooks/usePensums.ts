import { useState, useEffect } from "react";
import { getPensums, createPensum, updatePensum, deletePensum, getPensumById } from "../api/pensum";
import type { PensumDto, Pensum } from "../models/types";


export function usePensums() {
  const [data, setData] = useState<Pensum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPensums = async () => {
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
  };

  const fetchPensumById = async (id: string) => {
    try {
      return await getPensumById(id);
    } catch (e: any) {
      setError(e.message);
      return null;
    }
  };

  const addPensum = async (dto: PensumDto) => {
    try {
      const result = await createPensum(dto);
      setData((prev) => [...prev, result]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const editPensum = async (id: string, dto: PensumDto) => {
    try {
      const result = await updatePensum(id, dto);
      setData((prev) => prev.map((p) => (p._id === id ? result : p)));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const removePensum = async (id: string) => {
    try {
      await deletePensum(id);
      setData((prev) => prev.filter((p) => p._id !== id));
    } catch (e: any) {
      setError(e.message);
    }
  };

  useEffect(() => {
    fetchPensums();
  }, []);

  return { data, loading, error, fetchPensums, fetchPensumById, addPensum, editPensum, removePensum };
}
