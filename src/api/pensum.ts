import type { CourseDto, CourseType, PostDto, Pensum, Post, PensumDto } from "../models/types";

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

export const createPensum = (data: PensumDto) => request<Pensum>(`${BASE_URL}/pensum`, {
  method: "POST",
  body: JSON.stringify(data),
});

export const updatePensum = (id: string, data: PensumDto) =>
  request<Pensum>(`${BASE_URL}/pensum/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePensum = (id: string) =>
  request<void>(`${BASE_URL}/pensum/${id}`, {
    method: "DELETE",
  });

// Asignaturas CRUD
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

  // Publicaciones CRUD
export const getPosts = () =>
  request<Post[]>(`${BASE_URL}/post`, {
    method: "GET",
  });

export const getPostById = (id: string) =>
  request<Post>(`${BASE_URL}/post/${id}`, {
    method: "GET",
  });

export const createPost = (data: PostDto) =>{
  const url = `${BASE_URL}/post`;
  console.log("createPost URL:", url);
  console.log("Payload:", data);

  return request<Post>(url, {
    method: "POST",
    body: JSON.stringify(data),
  })} 

export const updatePost = (id: string, data: Partial<PostDto>) =>
  request<Post>(`${BASE_URL}/post/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deletePost = (id: string) =>
  request<void>(`${BASE_URL}/post/${id}`, {
    method: "DELETE",
  });
