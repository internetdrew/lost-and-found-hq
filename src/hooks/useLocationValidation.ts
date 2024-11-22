import axios from 'axios';
import useSWR from 'swr';

const fetcher = async (url: string) => {
  try {
    const response = await axios.get(url);
    const isValid: boolean = response.data;
    return isValid;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};

export const useLocationValidation = (locationId: string) => {
  const { data, isLoading, mutate } = useSWR(
    `/api/v1/locations/${locationId}/validate`,
    fetcher
  );

  return {
    isValid: data,
    isLoading,
    mutate,
  };
};
