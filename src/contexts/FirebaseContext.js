//AI WROTE THIS 

import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const FirebaseContext = createContext(null);

export function FirebaseProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
    auth,
    db
  };

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}

export const useFirebase = () => useContext(FirebaseContext);