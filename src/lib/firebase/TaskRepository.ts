import { taskConverter } from './converters';
import { Task } from '../models/Task';
import { collection, getDocs, getFirestore, onSnapshot, query, where } from 'firebase/firestore';

export class TaskRepository {
  private collection = collection(getFirestore(), 'tasks').withConverter(taskConverter);
  
  // Initial fetch
  async getTasks(userId: string): Promise<Task[]> {
    const q = query(this.collection, where('userId', '==', userId));
    const snapshot = await getDocs(q);
      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (data && data.content) {
        return data as Task;
      }
      throw new Error('Invalid task data');
    });
  }
  
  // Real-time updates
  onTasksChanged(userId: string, callback: (tasks: Task[]) => void): () => void {
    const q = query(this.collection, where('userId', '==', userId));
    const unsubscribe = onSnapshot(q, snapshot => {
      const tasks = snapshot.docs.map(doc => {
        const data = doc.data();
        if (data && data.content) {
          return data as Task;
        }
        throw new Error('Invalid task data');
      });
      callback(tasks);
    });
    return unsubscribe; // Return function to stop listening
  }
  
  // Other CRUD operations...
}