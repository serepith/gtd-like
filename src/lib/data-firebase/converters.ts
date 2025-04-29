//AI WROTE THIS
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { Task, Tag } from '../types/gtd-items';

// export const taskConverter = {
//   toFirestore(task: Partial<Task>): DocumentData {
//     // Omit taskId - it's stored as document ID
//     const { id, ...data } = task;
//     return data;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot
//   ): Task {
//     const data = snapshot.data();
    
//     return {
//       type: 'Task',
//       id: snapshot.id,
//       title: data.title || '',
//       content: data.content || '',
//       userId: data.userId,
//       completed: Boolean(data.completed),
//       created: data.created,
//       lastUpdate: data.lastUpdate,
//       tagIds: data.tagIds || [],
//       dueDate: data.dueDate ? data.dueDate.toDate() : undefined,
//     };
//   }
// };

// export const tagConverter = {
//   toFirestore(tag: Partial<Tag>): DocumentData {
//     // Omit taskId - it's stored as document ID
//     const { id, ...data } = tag;
//     return data;
//   },
//   fromFirestore(
//     snapshot: QueryDocumentSnapshot
//   ): Tag {
//     const data = snapshot.data();
    
//     return {
//       id: snapshot.id,
//       content: data.content || '',
//       userId: data.userId,
//       created: data.created,
//       lastUpdate: data.lastUpdate,
//     };
//   }
// };