import type { CourseDto, CourseType, CreatePensumDto, Pensum, UpdatePensumDto } from "../models/types";

const BASE_URL = "/api"; // TEMPORAL BORRAR EN CUANTO FUNCIONE Y REEMPLAZARLO POR VARIABLE DE ENTORNO

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

// Planes académicos CRUD
export const getPensums = () =>
  request<Pensum[]>(`${BASE_URL}/pensum`, {
    method: "GET",
  });

export const getPensumById = (id: string) =>
  request<Pensum>(`${BASE_URL}/pensum/${id}`, {
    method: "GET",
  });

export const createPensum = (data: CreatePensumDto) => request<Pensum>(`${BASE_URL}/pensum`, {
  method: "POST",
  body: JSON.stringify(data),
});

export const updatePensum = (id: string, data: UpdatePensumDto) =>
  request<Pensum>(`${BASE_URL}/pensum/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePensum = (id: string) =>
  request<void>(`${BASE_URL}/pensum/${id}`, {
    method: "DELETE",
  });

// Cursos dentro de semestres CRUD
export const addCourse = (id: string, data: { semesterNumber: number; courseName: string; courseType: CourseType }) =>
  request<Pensum>(`${BASE_URL}/pensum/${id}/course`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSemesterCourses = (id: string, semesterNumber: number) =>
  request<CourseDto[]>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course`, {
    method: "GET",
  });

export const getCourse = (id: string, semesterNumber: number, courseName: string) =>
  request<CourseDto>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
    method: "GET",
  });

export const updateCourse = (id: string, semesterNumber: number, courseName: string, data: CourseDto) =>
  request<CourseDto>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteCourse = (id: string, semesterNumber: number, courseName: string) =>
  request<void>(`${BASE_URL}/pensum/${id}/semester/${semesterNumber}/course/${courseName}`, {
    method: "DELETE",
  });
