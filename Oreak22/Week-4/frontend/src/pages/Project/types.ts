// types.ts
export interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: string; // ISO
  projectId: string;
}
