//Wrapper component class for collections (Firestore) aka repositories

'use client';

import React, { createContext, useContext } from 'react';
import { auth } from "@/lib/firebase/client";
import { getFirebaseFirestore } from "@/lib/firebase/client";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { TaskRepository } from '../../lib/firebase/TaskRepository';
import { TagRepository } from '@/lib/firebase/TagRepository';

const db = getFirebaseFirestore();
const repositories = {
  tasks: new TaskRepository(),
  tags: new TagRepository(),
};

export const RepositoryContext = createContext(repositories);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RepositoryContext.Provider value={repositories}>
    {children}
  </RepositoryContext.Provider>
);