export interface Task {
  content: string;
  notes: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  taskId: string;
  userId: string;
  tagIds: string[]; // Array of tag IDs
  dueDate?: Date; // Optional due date
}