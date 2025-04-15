import { deepEqual } from "assert/strict";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

// 1. The core Firebase data adapter - your central reconciliation point
function createFirebaseAdapter(collection) {
    return {
      // Reading with offline support
      async read(id) {
        const cacheKey = `${collection}/${id}`;
        
        try {
          if (navigator.onLine) {
            // Online path: first try Firebase
            const snapshot = await getDoc(doc(db, collection, id));
            const serverData = snapshot.exists() ? snapshot.data() : null;
            
            // This is where offline and online worlds collide
            const localData = await getFromIndexedDB(cacheKey);
            
            if (localData && serverData) {
              // The conflict resolution moment of truth
              const resolvedData = await resolveConflict(serverData, localData, cacheKey);
              
              // Persist the resolution
              await saveToIndexedDB(cacheKey, resolvedData);
              
              // Update server if needed
              if (!deepEqual(resolvedData, serverData)) {
                await updateDoc(doc(db, collection, id), resolvedData);
              }
              
              return resolvedData;
            }
            
            // No conflict, just cache the data
            if (serverData) {
              await saveToIndexedDB(cacheKey, serverData);
            }
            return serverData;
          }
        } catch (error) {
          console.error("Firebase operation failed, falling back to local", error);
        }
        
        // Offline path: return from cache
        return getFromIndexedDB(cacheKey);
      },
      
      // Writing with offline queue support
      async write(id, data) {
        const cacheKey = `${collection}/${id}`;
        
        // Timestamp and prepare the data
        const timestampedData = {
          ...data,
          _timestamp: Date.now(),
          _fieldTimestamps: Object.keys(data).reduce((acc, key) => {
            if (!key.startsWith('_')) acc[key] = Date.now();
            return acc;
          }, {}),
        };
        
        // Always update local immediately for optimistic UI
        await saveToIndexedDB(cacheKey, timestampedData);
        
        // If online, update Firebase too
        if (navigator.onLine) {
          try {
            await setDoc(doc(db, collection, id), 
              // Strip internal fields before sending to Firebase
              Object.entries(timestampedData)
                .filter(([k]) => !k.startsWith('_'))
                .reduce((obj, [k, v]) => ({...obj, [k]: v}), {})
            );
            return { success: true };
          } catch (error) {
            console.error("Firebase write failed, queued for later", error);
            // Add to offline mutation queue
            await addToMutationQueue({
              collection,
              id,
              data: timestampedData,
              operation: 'write'
            });
            return { success: false, queued: true };
          }
        } else {
          // Add to offline mutation queue
          await addToMutationQueue({
            collection,
            id,
            data: timestampedData,
            operation: 'write'
          });
          return { success: false, queued: true };
        }
      },
      
      // Delete with offline queue support
      async delete(id) {
        const cacheKey = `${collection}/${id}`;
        
        // Mark as deleted in IndexedDB instead of actually deleting
        // This is crucial for conflict resolution with deletes
        await saveToIndexedDB(cacheKey, { 
          _deleted: true, 
          _timestamp: Date.now() 
        });
        
        if (navigator.onLine) {
          try {
            await deleteDoc(doc(db, collection, id));
            return { success: true };
          } catch (error) {
            console.error("Firebase delete failed, queued for later", error);
            await addToMutationQueue({
              collection,
              id,
              operation: 'delete'
            });
            return { success: false, queued: true };
          }
        } else {
          await addToMutationQueue({
            collection,
            id,
            operation: 'delete'
          });
          return { success: false, queued: true };
        }
      }
    };
  }