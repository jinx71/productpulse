import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Thin accessor that fails loudly if used outside the provider.
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};

export default useAuth;
