import * as Y from 'yjs';
import { IndexeddbPersistence } from 'y-indexeddb';

// Create your document
const ydoc = new Y.Doc();

// This will persist the document to IndexedDB
// under the key 'task-manager-task-123'
const indexeddbProvider = new IndexeddbPersistence('task-manager-task-123', ydoc);

// You can listen for sync status
indexeddbProvider.on('synced', () => {
  console.log('Content loaded from IndexedDB')
});



const addNode = (node : Node) => {
    const nodeDoc = new Y.Doc();
    return new Node();
}

