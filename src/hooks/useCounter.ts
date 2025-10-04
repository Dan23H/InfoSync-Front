import { useEffect, useState } from "react";
import { getComments } from "../api";
import type { Comment } from "../models";

// Cuando el backend incluya post.commentsCount, este hook se puede eliminar.
export function useCommentsCount(postId: string, initialCount?: number) {
  const [count, setCount] = useState<number>(initialCount ?? 0);

  useEffect(() => {
    // Reemplazar este bloque cuando el backend devuelva el contador directamente
    async function fetchCount() {
      try {
        const comments: Comment[] = await getComments(postId);

        const total = comments.reduce(
          (acc, c) => acc + 1 + (c.subComments?.length || 0),
          0
        );

        setCount(total);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    }

    fetchCount();
  }, [postId]);

  return count;
}
