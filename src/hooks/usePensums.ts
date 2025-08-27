import { useState, useEffect } from "react";
import { getPensums, createPensum, updatePensum, deletePensum } from "../api/pensum";
import type { CreatePensumDto, Pensum, UpdatePensumDto } from "../models/types";


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

  const addPensum = async (dto: CreatePensumDto) => {
    try {
      const result = await createPensum(dto);
      setData((prev) => [...prev, result]);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const editPensum = async (id: string, dto: UpdatePensumDto) => {
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

  return { data, loading, error, fetchPensums, addPensum, editPensum, removePensum };
}
