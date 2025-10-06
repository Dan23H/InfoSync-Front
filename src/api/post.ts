import { request } from "./request";
import type { Post, PostDto } from "../models";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getPosts = () =>
  request<Post[]>(`${BASE_URL}/post`, { method: "GET" });

export const getPostById = (id: string) =>
  request<Post>(`${BASE_URL}/post/${id}`, { method: "GET" });

export const createPost = (data: PostDto & { pensumId: string }) => {
  const url = `${BASE_URL}/post`;
  const fd = new FormData();
  fd.append("userId", String(data.userId));
  fd.append("pensumId", String(data.pensumId));
  fd.append("type", String(data.type));
  fd.append("title", String(data.title));
  fd.append("subject", String(data.subject));
  fd.append("description", String(data.description));
  fd.append("course", String(data.course));
  (data.images ?? []).forEach((f: any) => {
    if (f instanceof File) fd.append("images", f);
  });
  (data.files ?? []).forEach((f: any) => {
    if (f instanceof File) fd.append("files", f);
  });
  return request<Post>(url, { method: "POST", body: fd });
};

export const updatePost = (id: string, data: Partial<PostDto>) => {
  const url = `${BASE_URL}/post/${id}`;
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v instanceof File) fd.append(key, v);
        else fd.append(key, v);
      });
    } else if (value !== undefined && value !== null) {
      fd.append(key, value as string);
    }
  });
  return request<Post>(url, { method: "PATCH", body: fd });
};

export const deletePost = (postId: string, userId: string) =>
  request<void>(`${BASE_URL}/post/${postId}`, {
    method: "DELETE",
    body: JSON.stringify({ userId }),
  });
