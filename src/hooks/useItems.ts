import axios from 'axios';
import useSWR from 'swr';
import { Tables } from '@dbTypes';

type Item = Tables<'items'>;

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const data: Item[] = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useItems = () => {
  const { data, isLoading, mutate } = useSWR('api/v1/items', fetcher);

  return {
    data,
    isLoading,
    mutate,
  };
};
