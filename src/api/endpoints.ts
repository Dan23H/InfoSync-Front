import type { CourseDto, CourseType, PostDto, Pensum, Post, PensumDto, Comment } from "../models";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const headers: HeadersInit = {};

  const token = localStorage.getItem("jwt");
  const isRegister = url.endsWith("/user") && options?.method === "POST";
  if (token && !isRegister) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  if (options?.body && !(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...options,
    headers: {
      ...headers,
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(`${res.status} ${res.statusText} ${msg}`.trim());
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

  // for (let pair of fd.entries()) {
  //   console.log(pair[0], pair[1]); // Depuración comentada
  // }

  const token = localStorage.getItem("jwt");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return request<Post>(url, { method: "POST", body: fd, headers });
};

export const updatePost = (postId: string, post: PostDto) => {
  const token = localStorage.getItem("jwt");
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    headers["Content-Type"] = "application/json";
  }
  return request<Post>(`${BASE_URL}/post/${postId}`, {
    method: "PATCH",
    body: JSON.stringify(post),
    headers,
  });
};

export const deletePost = (id: string) =>
  request<void>(`${BASE_URL}/post/${id}`, {
    method: "DELETE",
  });

// Comentarios
export const getComments = (postId: string) =>
  request<Comment[]>(`${BASE_URL}/comment/post/${postId}`, { method: "GET" });

export const createComment = (data: { userId: string; postId: string; commentary: string }) =>
  request<Comment>(`${BASE_URL}/comment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateComment = (id: string, data: { commentary: string }) =>
  request<Comment>(`${BASE_URL}/comment/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteComment = (id: string) =>
  request<void>(`${BASE_URL}/comment/${id}`, { method: "DELETE" });

// Subcomentarios
export const createSubComment = (commentId: string, data: { userId: string; commentary: string }) =>
  request<Comment>(`${BASE_URL}/comment/${commentId}/subcomment`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteSubComment = (commentId: string, subCommentId: string) =>
  request<void>(`${BASE_URL}/comment/${commentId}/subcomment/${subCommentId}`, {
    method: "DELETE",
  });

// Reportes
export const getReports = () =>
  request<any[]>(`${BASE_URL}/report`, { method: "GET" });

export const createReport = (data: { userId: string; targetType: string; targetId: string; reason: string }) =>
  request<any>(`${BASE_URL}/report`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getReport = (id: string) =>
  request<any>(`${BASE_URL}/report/${id}`, { method: "GET" });

export const editReport = (id: string, data: { reason: string, state: string, reviewedBy: string, reviewDescription: string, resolveAt: string }) =>
  request<any>(`${BASE_URL}/report/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteReport = (id: string) =>
  request<void>(`${BASE_URL}/report/${id}`, { method: "DELETE" });

// Usuarios
export const createUser = (data: { userName: string; userEmail: string; password: string; role: string }) =>
  request<any>(`${BASE_URL}/user`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getUsers = () =>
  request<any[]>(`${BASE_URL}/user`, { method: "GET" });

export const getUserById = (id: string) =>
  request<any>(`${BASE_URL}/user/${id}`, { method: "GET" });

export const updateUser = (id: string, data: { userName?: string; userEmail?: string; role?: string }) =>
  request<any>(`${BASE_URL}/user/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

export const deleteUser = (id: string) =>
  request<void>(`${BASE_URL}/user/${id}`, { method: "DELETE" });

export const login = (data: { userEmail: string; password: string }) =>
  request<{ access_token: string; user: any }>(`${BASE_URL}/user/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
