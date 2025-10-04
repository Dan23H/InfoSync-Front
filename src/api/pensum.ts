import { request } from "./request";
import type { Pensum, PensumDto, CourseDto, CourseType } from "../models";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

export const getPensums = () =>
    request<Pensum[]>(`${BASE_URL}/pensum`, { method: "GET" });

export const getPensumById = (id: string) =>
    request<Pensum>(`${BASE_URL}/pensum/${id}`, { method: "GET" });

export const createPensum = (data: PensumDto) =>
    request<Pensum>(`${BASE_URL}/pensum`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const updatePensum = (id: string, data: PensumDto) =>
    request<Pensum>(`${BASE_URL}/pensum/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

export const deletePensum = (id: string) =>
    request<void>(`${BASE_URL}/pensum/${id}`, { method: "DELETE" });

export const addCourse = (id: string, data: { semesterNumber: number; courseName: string; courseType: CourseType }) =>
    request<Pensum>(`${BASE_URL}/pensum/${id}/course`, {
        method: "POST",
        body: JSON.stringify(data)
    });

export const getSemesterCourses = (id: string, semesterNumber: number) =>
    request<CourseDto[]>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course`, {
        method: "GET"
    });

export const getCourse = (id: string, semesterNumber: number, courseName: string) =>
    request<CourseDto>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
        method: "GET"
    });

export const updateCourse = (id: string, semesterNumber: number, courseName: string, data: CourseDto) =>
    request<CourseDto>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
        method: "PATCH",
        body: JSON.stringify(data)
    });

export const deleteCourse = (id: string, semesterNumber: number, courseName: string) =>
    request<void>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
        method: "DELETE"
    });
