import { request } from "./request";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getReports = () =>
    request<any[]>(`${BASE_URL}/report`, { method: "GET" });

export const createReport = (data: { userId: string; targetType: string; targetId: string; reason: string }) =>
    request<any>(`${BASE_URL}/report`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getReport = (id: string) =>
    request<any>(`${BASE_URL}/report/${id}`, { method: "GET" });

export const resolveReport = (id: string, data: { userId: string, state: string, reviewDescription: string }) =>
    request<any>(`${BASE_URL}/report/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

export const deleteReport = (id: string, userId: string) =>
    request<void>(`${BASE_URL}/report/${id}`, { method: "DELETE", body: JSON.stringify({ userId }) });
