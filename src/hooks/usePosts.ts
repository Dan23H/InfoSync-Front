import { useEffect, useState } from "react";
import { getPosts, createPost } from "../api/pensum";
import type { Post, PostDto } from "../models";
import { slugify } from "../utils/slugify";

export function usePosts(plan?: string, course?: string) {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  try {
    const newPost = await createPost({
      ...dto,
      pensumId,
      userId: "64f8a1234567890abcdef123", // temporal
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
