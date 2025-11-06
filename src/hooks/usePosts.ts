import { useEffect, useState } from "react";
import { getPosts, createPost } from "../api";
import type { Post, PostDto } from "../models";
import { slugify } from "../utils/slugify";
import { useAuth } from "../context/AuthContext";

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

  return { data, loading, error, addPost, fetchPosts };
}
