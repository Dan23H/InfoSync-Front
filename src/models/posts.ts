export interface Post {
  _id: string;
  userId: string;
  pensumId: string;
  type: "Q" | "S";
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
  type: "Q" | "S";
  title: string;
  subject: string;
  description: string;
  course: string;
  images?: string[];
  files?: string[];
}
