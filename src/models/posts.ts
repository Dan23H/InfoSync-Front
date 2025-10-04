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
  likeCount?: number;
  dislikeCount?: number;
  commentCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PostDto {
  userId: string;
  pensumId: string;
  type: "Q" | "S";
  title: string;
  subject: string;
  description: string;
  course: string;
  images?: (string | File)[];
  files?: (string | File)[];
}
