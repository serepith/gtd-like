'use client';

import React, { createContext, useContext } from 'react';
import { auth, getFirebaseApp, getFirebaseAuth, getFirebaseFirestore } from '../../lib/firebase/firebase-functions';
import { TaskRepository } from '../../lib/firebase/TaskRepository';

const db = getFirebaseFirestore();
const repositories = {
  tasks: new TaskRepository()
};

const RepositoryContext = createContext(repositories);

export const RepositoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RepositoryContext.Provider value={repositories}>
    {children}
  </RepositoryContext.Provider>
);

export const useRepositories = () => useContext(RepositoryContext);