import { createContext, useContext, useState } from "react";

interface PostsUpdateContextType {
  updated: number;
  notifyUpdate: () => void;
}

const PostsUpdateContext = createContext<PostsUpdateContextType | undefined>(undefined);

export function PostsUpdateProvider({ children }: { children: React.ReactNode }) {
  const [updated, setUpdated] = useState(0);
  const notifyUpdate = () => setUpdated((u) => u + 1);
  return (
    <PostsUpdateContext.Provider value={{ updated, notifyUpdate }}>
      {children}
    </PostsUpdateContext.Provider>
  );
}

export function usePostsUpdate() {
  const ctx = useContext(PostsUpdateContext);
  if (!ctx) throw new Error("usePostsUpdate debe usarse dentro de PostsUpdateProvider");
  return ctx;
}
