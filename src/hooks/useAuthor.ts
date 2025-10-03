import { useEffect, useState } from "react";
import { getUserById } from "../api/endpoints";

// cache simple en memoria para evitar llamadas repetidas
const userCache: Record<string, any> = {};

export function useAuthor(userId: string | null) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    // bloque para buscar en cache primero
    if (userCache[userId]) {
      setUser(userCache[userId]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    let isMounted = true;

    getUserById(userId)
      .then((data) => {
        if (!isMounted) return;
        userCache[userId] = data; // guardar en cache
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Error al obtener usuario", err);
        setError("No se pudo cargar el usuario");
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { user, loading, error };
}
