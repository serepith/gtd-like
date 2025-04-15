import { getFirebaseAdmin } from "../firebase/server/server-firebase";

// Firestore access with user context
export async function fetchUserTasks(userId: string, limit = 10) {
    const admin = getFirebaseAdmin();
    const db = admin.getFirestore();
    
    const tasksSnapshot = await db.collection('tasks')
      .where('userId', '==', userId)
      .limit(limit)
      .get();
    
    return tasksSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data() 
    }));
  }