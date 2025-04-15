import { taskConverter } from '../converters';
import { Task } from '../../models/Task';
import { addDoc, collection, getDocs, getFirestore, onSnapshot, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { getFirebaseFirestore } from "./client-firebase";
import { Tag } from '../../models/Tag';

export class TaskManager {
  private collection = collection(getFirebaseFirestore(), 'tasks').withConverter(taskConverter);

  async addTagToTask(taskId: string, tagId: string, uid: string): Promise<void> {
    //TODO
    throw new Error('Method not implemented.');
  }
  removeTagFromTask(taskId: string, tagId: string, uid: string): any {
    throw new Error('Method not implemented.');
  }
  async getTaskTags(taskId: string, uid: string): Promise<Tag[]> {
    //TODO
    throw new Error('Method not implemented.');
  }

  // Initial fetch
  async getTasks(userId: string): Promise<Task[]> {

  console.log('Fetching tasks client side for user:', userId);
    
    const q = query(this.collection, where('userId', '==', userId));
    const snapshot = await getDocs(q);

  console.log('Fetched tasks client side for user:', userId);

      
    return snapshot.docs.map(doc => {
      const data = doc.data();
      if (data && data.content) {
        return data as Task;
      }
      throw new Error('Invalid task data');
    });
  }

  // Push new task TO Firestore
  async addTask(taskData: string, userId: string, taskTags?: string[]) {
    return await addDoc(this.collection, {
      content: taskData,
      userId: userId,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      //LOOKUP TAG IDS TIME
      tagIds: taskTags,
      dueDate: undefined
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
    console.log('Listening for task changes for user:', userId);
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
    console.log('Listened for task changes for user:', userId);
    return unsubscribe; // Return function to stop listening
  }
  
  
}