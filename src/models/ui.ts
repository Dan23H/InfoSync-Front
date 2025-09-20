import type { CourseDto, Pensum } from "./pensum";

// Para tarjetas de cursos
export interface CourseGroupData {
  name: string;
  semesterNumber: number;
  planName: string;
}

export interface CourseCardData {
  name: string;
  semesterNumber: number;
  type: string;
  planId: string;
  planName: string;
}

export interface CourseCardProps extends CourseCardData {
  onClick?: () => void;
}

// Para formularios y modals
export interface ModalFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  temp: CourseDto | null;
  setTemp: React.Dispatch<React.SetStateAction<CourseDto | null>>;
  title: string;
  subtitle?: string;
}

// CustomTextbox
export interface CustomTextbox {
  planName: string;
  semestre: number;
  asignaturas: CourseDto[];
  onAdd: (newSubject: CourseDto) => void;
  onDelete: (index: number) => void;
  onUpdate: (index: number, updated: CourseDto) => void;
}

// Para cards de pensum
export interface PensumCardProps {
  pensum: Pensum;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

// Selector de semestres
export interface SelectorProps {
  semestre: number;
  setSemestre: (n: number) => void;
  seleccion: number;
  setSeleccion: (n: number) => void;
}
