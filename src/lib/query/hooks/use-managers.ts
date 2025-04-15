// src/hooks/useRepositories.ts
import { useContext } from 'react';
import { ManagerContext } from '../../../components/providers/manager-provider';

export const useManagers = () => useContext(ManagerContext);