import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as propertiesApi from '@/features/properties/api/properties.api';
import type { BackendProperty } from '@/features/properties/types/properties.types';

const propertiesQueryKey = ['properties'] as const;
const PAGE_SIZE = 12;

export function usePropertiesInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: propertiesQueryKey,
    queryFn: ({ pageParam }) =>
      propertiesApi.getProperties({
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page >= lastPage.lastPage) return undefined;
      return lastPage.page + 1;
    },
  });
}

export function useCreatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => propertiesApi.createProperty(formData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    },
  });
}

