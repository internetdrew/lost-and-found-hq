import { useContext } from 'react';
import { LocationIdContext } from '@/context/LocationIdContext';

export const useLocationId = () => {
  const context = useContext(LocationIdContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationIdProvider');
  }
  return context;
};
