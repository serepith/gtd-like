// import { yjs } from "@/lib/data-yjs/init";
// import { getFirestore } from "@/lib/data-firebase/init";
// import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
// import { applyUpdate } from "yjs";
// import { Task } from "../types/gtd-items";



// getFirestore().ref('docA').on('child_added', (a, b) => {
//     applyUpdate(doc, a.val());
//   })
  
//   doc.on('update', (update) => {
//     firebase.database().ref('docA').push(update)
//   });


// function onTasksChanged(userId: string, callback: (tasks: Task[]) => void): () => void {
//       console.log('Listening for task changes for user:', userId);
//       const q = query(collection(getFirestore(), 'tasks'), where('userId', '==', userId));
      
//       const unsubscribe = onSnapshot(q, snapshot => {
//         const tasks = snapshot.docs.map(doc => {
//           const data = doc.data();
//           if (data && data.content) {
//             return data as Task;
//           }
//           throw new Error('Invalid task data');
//         });
//         callback(tasks);
//       });

//       console.log('Listened for task changes for user:', userId);
//       return unsubscribe; // Return function to stop listening
//     }