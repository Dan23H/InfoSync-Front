import { request } from "./request";
import type { Comment } from "../models";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getComments = (postId: string) =>
    request<Comment[]>(`${BASE_URL}/comment/post/${postId}`, { method: "GET" });

export const createComment = (data: { userId: string; postId: string; commentary: string }) =>
    request<Comment>(`${BASE_URL}/comment`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updateComment = (id: string, data: { commentary: string }) =>
    request<Comment>(`${BASE_URL}/comment/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

export const deleteComment = (id: string) =>
    request<void>(`${BASE_URL}/comment/${id}`, { method: "DELETE" });

export const createSubComment = (commentId: string, data: { userId: string; commentary: string }) =>
    request<Comment>(`${BASE_URL}/comment/${commentId}/subcomment`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const deleteSubComment = (commentId: string, subCommentId: string) =>
    request<void>(`${BASE_URL}/comment/${commentId}/subcomment/${subCommentId}`, {
        method: "DELETE"
    });

export const getCommentById = (id: string) =>
    request<Comment>(`${BASE_URL}/comment/${id}`, { method: "GET" });

