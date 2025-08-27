export type CourseType = "B" | "E"

export interface CourseDto {
  name: string;
  type: CourseType;
}

export interface SemesterDto {
  semesterNumber: number;
  courses: CourseDto[];
}

export interface Pensum {
  _id: string;
  name: string;
  totalSemesters: number;
  semesters: SemesterDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdatePensumDto {
  name: string;
  totalSemesters: number;
  semesters: SemesterDto[];
}

export interface CreatePensumDto {
  name: string;
  totalSemesters: number;
  semesters: SemesterDto[];
}
