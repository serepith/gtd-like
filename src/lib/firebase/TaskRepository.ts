import { taskConverter } from './converters';
import { Task } from '../models/Task';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase-functions';

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

  // Push new task TO Firestore
  async addTask(taskData: string, userId: string) {
    return await addDoc(this.collection, {
      content: taskData,
      userId: userId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  // Update task in Firestore
  async updateTask(taskId: string, updates: Partial<Task>) {
    const docRef = doc(this.collection, taskId);
    return await updateDoc(docRef, updates);
  }

  // Delete task from Firestore
  async deleteTask(taskId: string, userId: string): Promise<void> {
    try {
      const taskRef = doc(this.collection, taskId);
      await deleteDoc(taskRef);
      console.log(`Task ${taskId} deleted successfully`);
      return;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }

  // Real-time updates FROM Firestore
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
  
  
}