export interface SubComment {
  _id: string;
  userId: string;
  commentary: string;
  createdAt: string;
}

export interface Comment {
  _id: string;
  userId: string;
  postId: string;
  commentary: string;
  createdAt: string;
  subcomments?: SubComment[];
  updatedAt?: string;
}
