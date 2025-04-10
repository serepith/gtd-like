// components/user-provider.tsx
'use client';

import { createContext, JSX, useContext } from 'react';

const UserContext = createContext(null);

interface UserProviderProps {
  children: React.ReactNode;
  value: any; // Replace 'any' with the appropriate type for your context value
}

export const UserProvider = ({ children, value }: UserProviderProps) => {
  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
}