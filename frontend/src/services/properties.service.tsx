import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function usePropertyQuery(id?: string) {
  return useQuery({
    queryKey: [...propertiesQueryKey, id],
    enabled: Boolean(id),
    queryFn: () => propertiesApi.getProperty(id as string),
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

export function useUpdatePropertyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; payload: propertiesApi.UpdatePropertyPayload }) =>
      propertiesApi.updateProperty(params.id, params.payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: propertiesQueryKey });
    },
  });
}

