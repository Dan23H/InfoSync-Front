import { useEffect, useState } from "react";
import { getPosts } from "../api/pensum";
import type { Post } from "../models/types";
import { slugify } from "../utils/slugify";

export function usePosts(plan?: string, course?: string) {
  const [data, setData] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPosts() {
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
    }
    fetchPosts();
  }, [plan, course]);

  return { data, loading, error };
}
