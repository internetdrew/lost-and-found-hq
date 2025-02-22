import { Tables } from '@dbTypes';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function useLocations() {
  const { data, isLoading, mutate } = useSWR<Tables<'locations'>[]>(
    '/api/v1/locations',
    fetcher
  );

  return {
    locations: data,
    isLoading,
    mutate,
  };
}

export function useItems(locationId: string | null | undefined) {
  const { data, isLoading, mutate } = useSWR<Tables<'items'>[]>(
    locationId ? `/api/v1/locations/${locationId}/items` : null,
    fetcher
  );

  return {
    items: data,
    isLoading,
    mutate,
  };
}

export function usePublicItems(locationId: string | null | undefined) {
  const { data, isLoading } = useSWR<Tables<'items'>[]>(
    locationId ? `/api/public/locations/${locationId}/items` : null,
    fetcher
  );

  return {
    items: data,
    isLoading,
  };
}
