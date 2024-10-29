import axios from 'axios';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    return response.data;
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
