import axios from 'axios';
import useSWR from 'swr';
import { Tables } from '@dbTypes';

type Item = Tables<'items'>;

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const items: Item[] = response.data;
    return items;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useItemsAtLocation = (locationId: string) => {
  const { data, isLoading, mutate } = useSWR(
    `api/v1/locations/${locationId}/items`,
    fetcher
  );

  return {
    data,
    isLoading,
    mutate,
  };
};
