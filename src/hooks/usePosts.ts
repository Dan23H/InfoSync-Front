import { useEffect, useState } from "react";
import { getPosts, createPost } from "../api";
import type { Post, PostDto } from "../models";
import { slugify } from "../utils/slugify";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

export function usePosts(plan?: string, course?: string) {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const posts = await getPosts();

      let filtered = posts;

      if (plan) {
        filtered = filtered.filter((p) => p.pensumId === plan);
      }

      if (course) {
        filtered = filtered.filter(
          (p) => slugify(p.course) === course
        );
      }

      setData(filtered);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addPost = async (dto: PostDto, pensumId: string) => {
    if (!user?._id) {
      setError("No hay usuario autenticado.");
      return;
    }
    try {
      const newPost = await createPost({
        ...dto,
        pensumId,
        userId: user._id,
      });
      setData((prev) => [newPost, ...prev]);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [plan, course]);

  // Real-time updates via socket
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const onPostCreated = (p: Post) => {
      // Only add if matches current filters
      if (plan && p.pensumId !== plan) return;
      if (course && slugify(p.course) !== course) return;
      setData((prev) => [p, ...prev]);
    };

    const onPostUpdated = (p: Post) => {
      setData((prev) => prev.map((x) => (x._id === p._id ? p : x)));
    };

    const onPostDeleted = (postId: string) => {
      setData((prev) => prev.filter((x) => x._id !== postId));
    };

    const onPostVoted = (payload: { postId: string; likeCount?: number; dislikeCount?: number; commentCount?: number }) => {
      setData((prev) => prev.map((p) => p._id === payload.postId ? { ...p, ...(payload.likeCount !== undefined ? { likeCount: payload.likeCount } : {}), ...(payload.dislikeCount !== undefined ? { dislikeCount: payload.dislikeCount } : {}), ...(payload.commentCount !== undefined ? { commentCount: payload.commentCount } : {}) } : p));
    };

    socket.on("post:created", onPostCreated);
    socket.on("post:updated", onPostUpdated);
    socket.on("post:deleted", onPostDeleted);
    socket.on("post:voted", onPostVoted);

    return () => {
      socket.off("post:created", onPostCreated);
      socket.off("post:updated", onPostUpdated);
      socket.off("post:deleted", onPostDeleted);
      socket.off("post:voted", onPostVoted);
    };
  }, [socket, plan, course]);

  return { data, loading, error, addPost, fetchPosts };
}
