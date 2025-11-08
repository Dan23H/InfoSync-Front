import { useEffect, useState, useRef, useContext } from "react";
import { getComments } from "../api";
import type { Comment } from "../models";
import SocketContext from "../context/SocketContext";

// Cuando el backend incluya post.commentsCount, este hook se puede eliminar.
export function useCommentsCount(postId: string, initialCount?: number) {
  const [count, setCount] = useState<number>(initialCount ?? 0);
  const subCountsRef = useRef<Record<string, number>>({});
  const { SocketState, SocketDispatch } = useContext(SocketContext);

  useEffect(() => {
    // Reemplazar este bloque cuando el backend devuelva el contador directamente
    async function fetchCount() {
      try {
        const comments: Comment[] = await getComments(postId);

        const total = comments.reduce(
          (acc, c) => acc + 1 + (c.subComments?.length || 0),
          0
        );

        // initialize subCounts map for later delta calculations
        const map: Record<string, number> = {};
        comments.forEach((c) => {
          map[c._id] = c.subComments?.length ?? 0;
        });
        subCountsRef.current = map;

        setCount(total);
      } catch (err) {
        console.error("Error al cargar comentarios:", err);
      }
    }

    fetchCount();

    // register socket listeners for live updates
    const socket = SocketState.socket;
    if (socket) {
      try {
        SocketDispatch && SocketDispatch({ type: 'join_post_room', payload: { postId } } as any);
      } catch (err) {
        console.warn('Error joining post room:', err);
      }

      const handleCommentAdded = ({ postId: pId, comment }: { postId: string; comment: Comment }) => {
        if (pId !== postId) return;
        // a new top-level comment increases total by 1
        setCount((prev) => prev + 1);
        // record subcomments count for this comment
        subCountsRef.current[comment._id] = comment.subComments?.length ?? 0;
      };

      const handleCommentUpdated = ({ postId: pId, comment }: { postId: string; comment: Comment }) => {
        if (pId !== postId) return;
        const prevSub = subCountsRef.current[comment._id] ?? 0;
        const newSub = comment.subComments?.length ?? 0;
        const delta = newSub - prevSub;
        if (delta !== 0) {
          setCount((prev) => prev + delta);
          subCountsRef.current[comment._id] = newSub;
        }
      };

      socket.on('comment_added', handleCommentAdded);
      socket.on('comment_updated', handleCommentUpdated);

      return () => {
        socket.off('comment_added', handleCommentAdded);
        socket.off('comment_updated', handleCommentUpdated);
      };
    }
  }, [postId, SocketState.socket, SocketDispatch]);

  return count;
}
