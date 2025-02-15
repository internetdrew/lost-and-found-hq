import axios from 'axios';
import useSWR from 'swr';
import { Tables } from '@dbTypes';

type Location = Tables<'locations'>;

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const location: Location = response.data;
    return location;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useLocationInfo = (locationId: string) => {
  const { data, isLoading, mutate } = useSWR(
    `/api/public/locations/${locationId}`,
    fetcher
  );

  return {
    locationInfo: data,
    isLoading,
    mutate,
  };
};
