// import { collection } from "firebase/firestore";

// export async function resolveConflict(
//     serverData: SyncMetadata,
//     localData: SyncMetadata
// ): Promise<SyncMetadata> {
//     return resolveFieldLevelConflict(serverData, localData);
// }

// // Timestamp-based resolution: temporal narcissism
// // History is written by those who modified last
// async function resolveConflictByTimestamp(serverData: SyncMetadata, localData: SyncMetadata) {
//     // Default to 0 if timestamps are undefined
//     const localTimestamp = localData._timestamp ?? 0;
//     const serverTimestamp = serverData._timestamp ?? 0;

//     if (localTimestamp > serverTimestamp) {
//       // Local is newer
//       return localData;
//     } else {
//       return serverData;
//     }
// }

//   /**
//    * Resolves conflicts at the field level based on field timestamps
//    */
//   function resolveFieldLevelConflict<T extends SyncMetadata>(
//     serverData: T, 
//     localData: T
//   ): T {
//     // Start with server data as base
//     const result = { ...serverData };
    
//     // For each field in local data, use whichever is newer
//     Object.entries(localData).forEach(([key, value]) => {
//       // Skip metadata fields
//       if (key.startsWith('_')) return;
      
//       const localFieldTime = localData._fieldTimestamps?.[key] || 0;
//       const serverFieldTime = serverData._fieldTimestamps?.[key] || 0;
      
//       // If local field is newer, use it
//       if (localFieldTime > serverFieldTime) {
//         //silly typecasting workaround
//         (result as Record<string, any>)[key] = value;
        
//         // Update the field timestamp
//         if (!result._fieldTimestamps) result._fieldTimestamps = {};
//         result._fieldTimestamps[key] = localFieldTime;
//       }
//     });
    
//     // Update global timestamp to max of all field timestamps
//     result._timestamp = Math.max(
//       ...Object.values(result._fieldTimestamps || {})
//     );
    
//     return result as T;
//   }