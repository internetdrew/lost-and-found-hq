import axios from 'axios';

export const fetcher = async <T>(url: string) => {
  try {
    const response = await axios.get(url);
    return response.data as T;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }
    throw error;
  }
};
