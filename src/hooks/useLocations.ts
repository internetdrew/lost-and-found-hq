import axios from 'axios';
import useSWR from 'swr';
import { Tables } from '@dbTypes';

type Location = Tables<'locations'>;

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const locations: Location[] = response.data;
    return locations;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useLocations = () => {
  const { data, isLoading, mutate } = useSWR('api/v1/locations', fetcher);

  return {
    data,
    isLoading,
    mutate,
  };
};
