import { addDoc, collection, doc, DocumentReference, getDoc, setDoc } from "firebase/firestore";
import { getFirestore } from "./data-firebase/init";
import { DatabaseItem, GTDItem, Tag, Task } from "./types/gtd-items";
import * as Y from 'yjs';
import { IndexeddbPersistence } from "y-indexeddb";
import { yjs } from "@/lib/data-yjs/init";


//add a new item, create our CRDT type, and propagate it to both databases
export const newItem = async (item: GTDItem, collectionName: string) : Promise<DatabaseItem> => {
  //get the reference to our new firestore entry
  const docRef = doc(getFirestore(), collectionName);
  
  //make sure our item knows its own id!
  item.id = docRef.id;

  //instantiate our yjs doc
  const ydoc = new Y.Doc();
  //yes, this is a ydoc with a single map, which contains one item.
  ydoc.getMap().set('content', item);

  //Firestore and yjs use different ID generation strategies
  //but for consistency across the two, we'll key by the Firestore ID
  yjs().get(collectionName)?.set(docRef.id, ydoc);

  //get the appropriate Firestore collection (tasks, tags, etc)
  const coll = collection(getFirestore(), collectionName);

  //we need to push two things to Firestore: the current item state, and the yjs doc
  setDoc(docRef, { state: item, history: ydoc } as DatabaseItem);

  //and we should be gucci!
  return {
    state: item,
    history: ydoc,
  }
}


//TODO: is this justifiable templating?
//unpack the ymap and instantiate the correct class based on discriminator
// function mapToObject(ymap : Y.Map<any>) {
//   const type = ymap.get('type') as GTDItem['type'];
//   let mappedItem : GTDItem;
  
//   if(type === 'Task') {
//     mappedItem = Object.assign(new Task(), ymap.toJSON());
//   }
//   else if(type === 'Tag') {
//     mappedItem = Object.assign(new Tag(), ymap.toJSON());
//   }
//   //TODO: this is questionable
//   else {
//     mappedItem = ymap.toJSON() as GTDItem;
//   }

//   return mappedItem;
// }

// function objectToYMap(obj : GTDItem, ymap : Y.Map<any>) {
//   // Set the type discriminator
//   ymap.set('type', obj.type);
//   // Populate the Y.Map with the object's properties
//   for (const [key, value] of Object.entries(obj)) {
//     if (value instanceof Y.Map) {
//       // If the value is a Y.Map, recursively populate it
//       const nestedYMap = new Y.Map(); 
//     }
//   }
// }


/**
 * Updates a Firebase document with local changes, handling potential conflicts
 * @param collection - The Firestore collection
 * @param id - Document ID
 * @param data - The local data to write
 * @returns Promise resolving to success status
 */
// export async function updateFirebaseDoc<T extends SyncMetadata>(
//     collection: string,
//     id: string,
//     data: T
//   ): Promise<{ success: boolean; conflict?: boolean }> {
//     try {
//       const docRef = doc(db, collection, id);
      
//       // First, get the current server state
//       const snapshot = await getDoc(docRef);
//       const serverData = snapshot.exists() ? snapshot.data() as T : null;
      
//       // If there's no server document, simple write
//       if (!serverData) {
//         // Strip internal sync fields before writing to Firebase
//         const cleanData = Object.entries(data)
//           .filter(([key]) => !key.startsWith('_'))
//           .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
          
//         await setDoc(docRef, cleanData);
//         return { success: true };
//       }
      
//       // Check for potential conflicts
//       if (serverData._timestamp && data._timestamp && 
//           serverData._timestamp != data._timestamp) {
//         // The server has a newer version - conflict detected
        
//         // Resolve using our chosen strategy (here using field-level merging)
//         const resolvedData = resolveConflict(
//           serverData as T, 
//           data
//         );
        
//         // Write the resolved version
//         const cleanData = Object.entries(resolvedData)
//           .filter(([key]) => !key.startsWith('_'))
//           .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
          
//         await setDoc(docRef, cleanData);
        
//         // Return conflict status so calling code can update local cache
//         return { success: true, conflict: true };
//       }
      
//       // No conflict, simple update
//       const cleanData = Object.entries(data)
//         .filter(([key]) => !key.startsWith('_'))
//         .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
        
//       await setDoc(docRef, cleanData);
//       return { success: true };
//     } catch (error) {
//       console.error('Error updating Firebase document:', error);
//       return { success: false };
//     }
//   }
  