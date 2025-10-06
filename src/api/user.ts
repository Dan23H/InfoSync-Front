import { request } from "./request";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const createUser = (data: { userName: string; userEmail: string; password: string; role: string }) =>
    request<any>(`${BASE_URL}/user`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getUsers = () =>
    request<any[]>(`${BASE_URL}/user`, { method: "GET" });

export const getUserById = (id: string) =>
    request<any>(`${BASE_URL}/user/${id}`, { method: "GET" });

export const updateUser = (id: string, data: { userName?: string; userEmail?: string; role?: string }) =>
    request<any>(`${BASE_URL}/user/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

export const updateUserStatus = (id: string, status: string) =>
    request<any>(`${BASE_URL}/user/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
    });

export const deleteUser = (id: string) =>
    request<void>(`${BASE_URL}/user/${id}`, { method: "DELETE" });

export const login = (data: { userEmail: string; password: string }) =>
    request<{ access_token: string; user: any }>(`${BASE_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify(data)
    });
