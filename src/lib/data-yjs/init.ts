import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

let _yjs : Y.Doc;
let _persistence : IndexeddbPersistence;

export const yjs = () => {
    if(!_yjs) {
        _yjs = new Y.Doc();
        //create a persistence adapter for our yjs doc
        _persistence = new IndexeddbPersistence('task-manager', _yjs);
    }
    return _yjs.getMap() as Y.Map<Y.Map<Y.Doc>>;
}

export const yjsTasks = () => {
    return yjs().get('tasks') as Y.Map<Y.Doc>;
}

export const yjsTags = () => {
    return yjs().get('tags') as Y.Map<Y.Doc>;
}

