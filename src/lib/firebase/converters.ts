//AI WROTE THIS

import { Task } from '../models/Task';
import { Tag } from '../models/Tag';
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
      updatedAt: data.updatedAt?.toDate() || new Date(),
      tagIds: data.tagIds || [],
      dueDate: data.dueDate ? data.dueDate.toDate() : undefined,
    };
  }
};

export const tagConverter = {
  toFirestore(tag: Partial<Tag>): DocumentData {
    // Omit taskId - it's stored as document ID
    const { tagId, ...data } = tag;
    return data;
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): Tag {
    const data = snapshot.data();
    
    return {
      tagId: snapshot.id,
      content: data.content || '',
      userId: data.userId,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    };
  }
};