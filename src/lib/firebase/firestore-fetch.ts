//AI WROTE THIS
// firestore.ts - Utility functions
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { getFirebaseFirestore } from './firebase-functions';
import { getFirebaseAuth } from './firebase-functions';
import { Task } from '../models/Task';
import { QueryFunctionContext } from '@tanstack/react-query';

// Adding a task
export async function addTask(taskData: String) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");

  const db = getFirebaseFirestore();

  return await addDoc(collection(db, 'tasks'), {
    content: taskData,
    userId: userId,
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });
};

// Get current user ID (safely)
export function getCurrentUserId(): string | null {
  const auth = getFirebaseAuth();
  return auth.currentUser?.uid || null;
}

// Add a document with user ID
/* export async function addUserDocument(collectionName: string, data: any) {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");
  
  const db = getFirebaseFirestore();
  
  return await addDoc(collection(db, collectionName), {
    ...data,
    userId,
    createdAt: new Date()
  });
} */


// Type definitions with overloads
export async function fetchTasks(): Promise<Task[]>;
export async function fetchTasks(context: QueryFunctionContext): Promise<Task[]>;

export async function fetchTasks(context?: QueryFunctionContext): Promise<Task[]> {
   return getUserDocuments('tasks');
}

/* export function fetchTasks(context?: QueryFunctionContext): Promise<Task[]> {
  // Implementation that handles both cases
  const userId = context ? context.queryKey[1] as string | undefined : undefined;
  
  const constraints = [orderBy('createdAt', 'desc')];
  
  // Optional filtering by user
  if (userId) {
    constraints.unshift(where('userId', '==', userId));
  }
  
  const tasksCollection = collection(db, 'tasks');
  const tasksQuery = query(tasksCollection, ...constraints);
  
  return getDocs(tasksQuery).then(snapshot => 
    snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date()
    } as Task))
  );
} */


// Get user's documents
async function getUserDocuments(
  collectionName: string, 
  orderByField = 'createdAt', 
  orderDirection: 'asc' | 'desc' = 'desc',
  limitCount = 100
): Promise<Task[]> {
  const userId = getCurrentUserId();
  if (!userId) throw new Error("User not authenticated");
  
  const db = getFirebaseFirestore();
  
  const q = query(
    collection(db, collectionName),
    where('userId', '==', userId),
    orderBy(orderByField, orderDirection),
    limit(limitCount)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => {
    const data = doc.data();
    
    // Transform any Firestore Timestamps to JavaScript Date objects
    const createdAt = data.createdAt?.toDate() || new Date();
    const updatedAt = data.updatedAt?.toDate() || new Date();
    
    // Cast the document to your interface with proper type safety
    return {
      taskId: doc.id,
      content: data.content,
      userId: data.userId,
      completed: data.completed,
      updatedAt,
      createdAt // Override with transformed Date
    } as Task;
  });
}