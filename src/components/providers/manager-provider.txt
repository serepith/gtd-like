//Wrapper component class for collections (Firestore) aka repositories

'use client';

import React, { createContext, useContext } from 'react';
import { auth } from "@/lib/firebase/client/client-firebase";
import { getFirebaseFirestore } from "@/lib/firebase/client/client-firebase";
import { getFirebaseAuth } from "@/lib/firebase/client/client-firebase";
import { TaskManager } from '../../lib/firebase/client/task-manager';
import { TagManager } from '@/lib/firebase/client/tag-manager';

const db = getFirebaseFirestore();
const repositories = {
  tasks: new TaskManager(),
  tags: new TagManager(),
};

export const ManagerContext = createContext(repositories);

export const ManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ManagerContext.Provider value={repositories}>
    {children}
  </ManagerContext.Provider>
);