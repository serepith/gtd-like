// src/hooks/useRepositories.ts
import { useContext } from 'react';
import { RepositoryContext } from '../../components/providers/repository-provider';

export const useRepositories = () => useContext(RepositoryContext);