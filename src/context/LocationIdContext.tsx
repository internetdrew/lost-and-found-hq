import { createContext, ReactNode } from 'react';

type LocationIdContextType = {
  locationId: number;
};

export const LocationIdContext = createContext<
  LocationIdContextType | undefined
>(undefined);

export function LocationIdProvider({
  children,
  locationId,
}: LocationIdContextType & { children: ReactNode }) {
  return (
    <LocationIdContext.Provider value={{ locationId }}>
      {children}
    </LocationIdContext.Provider>
  );
}
