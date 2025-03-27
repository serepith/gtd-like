//AI WROTE THIS

import { Task } from '../models/Task';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';

export const taskConverter = {
  toFirestore(task: Partial<Task>): DocumentData {
    // Omit taskId - it's stored as document ID
    const { taskId, ...data } = task;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): Task {
    const data = snapshot.data();
    
    return {
      taskId: snapshot.id,
      content: data.content || '',
      notes: data.notes || '',
      userId: data.userId,
      completed: Boolean(data.completed),
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    };
  }
};