import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as documentsApi from '@/features/dashboard/api/documents.api';
import type {
  CreateDocumentPayload,
  CreateFolderPayload,
  UpdateDocumentPayload,
} from '@/features/dashboard/types/documents.types';

const documentsQueryKey = ['documents'] as const;
const foldersQueryKey = ['document-folders'] as const;

type DocumentsFilterParams = {
  category?: string;
  folderId?: string;
  propertyId?: string;
};

export function useDocumentsQuery(filters?: DocumentsFilterParams) {
  const hasFilters = Boolean(filters?.category || filters?.folderId || filters?.propertyId);
  return useQuery({
    queryKey: hasFilters ? [...documentsQueryKey, filters] : documentsQueryKey,
    queryFn: () =>
      documentsApi.getDocuments({
        page: 1,
        limit: 200,
        category: filters?.category,
        folderId: filters?.folderId,
        propertyId: filters?.propertyId,
      }),
  });
}

export function useInfiniteDocumentsQuery(filters?: DocumentsFilterParams) {
  const hasFilters = Boolean(filters?.category || filters?.folderId || filters?.propertyId);
  return useInfiniteQuery({
    queryKey: hasFilters ? [...documentsQueryKey, 'infinite', filters] : [...documentsQueryKey, 'infinite'],
    queryFn: ({ pageParam = 1 }) =>
      documentsApi.getDocuments({
        page: pageParam,
        limit: 50,
        category: filters?.category,
        folderId: filters?.folderId,
        propertyId: filters?.propertyId,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      if (lastPage.page < lastPage.lastPage) return lastPage.page + 1;
      return undefined;
    },
  });
}

export function useFoldersQuery() {
  return useQuery({
    queryKey: foldersQueryKey,
    queryFn: () => documentsApi.getFolders(),
  });
}

export function useCreateDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateDocumentPayload) => documentsApi.createDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}

export function useUpdateDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateDocumentPayload) => documentsApi.updateDocument(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}

export function useDeleteDocumentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}

export function useCreateFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateFolderPayload) => documentsApi.createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersQueryKey });
    },
  });
}

export function useDeleteFolderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => documentsApi.deleteFolder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: foldersQueryKey });
      queryClient.invalidateQueries({ queryKey: documentsQueryKey });
    },
  });
}
