import { collection, query, where, getDocs, DocumentReference, DocumentData, addDoc, doc, updateDoc, deleteDoc, onSnapshot, limit } from "firebase/firestore";
import { newItem } from "../sync";
import { Tag, Task } from "../types/gtd-items";
import { getFirestore } from "./init";


class TaskManager {
    private collection = collection(getFirestore(), 'tasks');
  
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
    // async getTasks(userId: string): Promise<Task[]> {
  
    // console.log('Fetching tasks client side for user:', userId);
      
    //   const q = query(this.collection, where('userId', '==', userId));
    //   const snapshot = await getDocs(q);
  
    // console.log('Fetched tasks client side for user:', userId);
  
        
    //   return snapshot.docs.map(doc => {
    //     const data = doc.data();
    //     if (data && data.content) {
    //       return data as Task;
    //     }
    //     throw new Error('Invalid task data');
    //   });
    // }
  
    // create new task
    //TODO: handle tags lolll
    async addTask(taskData: string, userId: string, taskTags?: string[]) {
      return await newItem(new Task(taskData, userId), "tasks");
    }
  
    // Update task in Firestore
    // async updateTask(taskId: string, updates: Partial<Task>) {
    //   const docRef = doc(this.collection, taskId);
    //   return await updateDoc(docRef, updates);
    // }
  
    // Delete task from Firestore
    // async deleteTask(taskId: string, userId: string): Promise<void> {
    //   try {
    //     const taskRef = doc(this.collection, taskId);
    //     await deleteDoc(taskRef);
    //     console.log(`Task ${taskId} deleted successfully`);
    //     return;
    //   } catch (error) {
    //     console.error('Error deleting task:', error);
    //     throw error;
    //   }
    // }
  
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

class TagManager {
    private collection = collection(getFirestore(), 'tags');
    
    // Initial fetch
    async getTags(userId: string): Promise<Tag[]> {
    console.log('Fetching tags client side for user:', userId);
  
      const q = query(this.collection, where('userId', '==', userId));
      const snapshot = await getDocs(q);
    console.log('Fetched tags client side for user:', userId);
        
      return snapshot.docs.map(doc => {
        const data = doc.data();
        if (data && data.content) {
          return data as Tag;
        }
        throw new Error('Invalid Tag data');
      });
    }
  
    // Push new Tag TO Firestore
    async addTag(TagData: string, userId: string): 
      Promise<DocumentReference<Partial<Tag>, DocumentData>> {
      return await addDoc(this.collection, {
        content: TagData,
        userId: userId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
  
    // Update Tag in Firestore
    async updateTag(TagId: string, updates: Partial<Tag>) {
      const docRef = doc(this.collection, TagId);
      return await updateDoc(docRef, updates);
    }
  
    // Delete Tag from Firestore
    async deleteTag(TagId: string, userId: string): Promise<void> {
      try {
        const TagRef = doc(this.collection, TagId);
        await deleteDoc(TagRef);
        console.log(`Tag ${TagId} deleted successfully`);
        return;
      } catch (error) {
        console.error('Error deleting Tag:', error);
        throw error;
      }
    }
  
    // Real-time updates FROM Firestore
    onTagsChanged(userId: string, callback: (Tags: Tag[]) => void): () => void {
      const q = query(this.collection, where('userId', '==', userId));
      const unsubscribe = onSnapshot(q, snapshot => {
        const Tags = snapshot.docs.map(doc => {
          const data = doc.data();
          if (data && data.content) {
            return data as Tag;
          }
          throw new Error('Invalid Tag data');
        });
        callback(Tags);
      });
      return unsubscribe; // Return function to stop listening
    }
  
    // Autocomplete functionality
    async searchTagsByPrefix(userId: string, prefix: string): Promise<Tag[]> {
      const q = query(
        this.collection,
        where("userId", "==", userId),
        where("name", ">=", prefix),
        where("name", "<=", prefix + "\uf8ff"), // Firebase trick for prefix search
        limit(10)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        ...(doc.data() as Omit<Tag, "tagId">),
        tagId: doc.id
      }));
    }
    
    
  }
  
let _tags : TagManager;
let _tasks : TaskManager;

export const getTags = () => {
  if (!_tags) {
    _tags = new TagManager();
  }
  return _tags;
} 
export const getTasks = () => {
  if (!_tasks) {
    _tasks = new TaskManager();
  }
  return _tasks;
}