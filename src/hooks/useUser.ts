import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export const useUser = () => {
  const { data, isLoading, mutate } = useSWR('/auth/user', fetcher);
  return { data, isLoading, mutate };
};
