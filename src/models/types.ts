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

export interface PensumDto {
  name: string;
  totalSemesters: number;
  semesters: SemesterDto[];
}

export interface CourseGroupData {
  name: string;
  semesterNumber: number;
  planName: string;
}

export interface CourseCardData {
  name: string;
  semesterNumber: number;
  type: string
  planId: string;
  planName: string;
}

export interface CourseCardProps extends CourseCardData {
  onClick?: () => void;
}

export interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  temp: CourseDto | null;
  setTemp: React.Dispatch<React.SetStateAction<CourseDto | null>>;
  title: string;
  subtitle?: string;
}

export interface CustomTextbox {
  planName: string;
  semestre: number;
  asignaturas: CourseDto[];
  onAdd: (newSubject: CourseDto) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updated: CourseDto) => void;
}

export interface PensumCardProps {
  pensum: Pensum;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface SelectorProps {
  semestre: number; // cantidad de botones de semestre a mostrar
  setSemestre: (n: number) => void;
  seleccion: number; // cuál botón está seleccionado
  setSeleccion: (n: number) => void;
}

export interface Post {
  _id: string;
  userId: string;
  pensumId: string;
  type: string;
  title: string;
  subject: string;
  description: string;
  course: string;
  images: string[];
  files: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PostDto {
  userId: string;
  type: string;
  title: string;
  subject: string;
  course: string;
  description: string;
  images?: string[];
  files?: string[];
}