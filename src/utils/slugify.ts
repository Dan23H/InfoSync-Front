export function slugify(text: string): string {
  return text
    .normalize("NFD") // quita acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina tildes
    .replace(/[^a-zA-Z0-9\s-]/g, "") // quita caracteres especiales
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-"); // reemplaza espacios por guiones
}