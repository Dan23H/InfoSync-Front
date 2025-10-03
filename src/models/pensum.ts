export type CourseType = "B" | "E";

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
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  userId: string;
}

export interface PensumDto {
  name: string;
  totalSemesters: number;
  semesters: SemesterDto[];
}
