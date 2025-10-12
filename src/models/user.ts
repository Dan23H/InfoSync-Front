export interface User {
  userId: string;
  userEmail: string;
  userName: string;
  password: string;
  role: "student" | "admin";
  status: "active" | "banned";
}