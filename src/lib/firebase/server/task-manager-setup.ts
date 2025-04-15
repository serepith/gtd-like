// server/repositories/taskRepository.js
import { getFirebaseAdmin } from './server-firebase';
import { Task } from '../../models/Task';


export async function getTasks(uid: string) : Promise<Task[]>{
  const { getFirestore } = getFirebaseAdmin();

  console.log('Fetching tasks for user:', uid);

  try {
    const userTasks = await getFirestore()
      .collection('tasks')
      .where('userId', '==', uid)
      .get();

    console.log('Fetched tasks for user:', uid);


      //TODO: this is dupe across server and client, extract to converters
    return userTasks.docs.map(doc => {
          const data = doc.data();
          if (data && data.content) {
            return data as Task;
          }
          throw new Error('Invalid task data');
        });

  } catch (error) {
    console.error('Error fetching user tasks:', error);
    // Return nothing or handle the error as needed
    return [];
  }
}
