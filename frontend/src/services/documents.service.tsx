import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import * as documentsApi from '@/features/dashboard/api/documents.api';
import type {
  CreateDocumentPayload,
  CreateFolderPayload,
  UpdateDocumentPayload,
} from '@/features/dashboard/types/documents.types';

const documentsQueryKey = ['documents'] as const;
const foldersQueryKey = ['document-folders'] as const;

export function useDocumentsQuery() {
  return useQuery({
    queryKey: documentsQueryKey,
    queryFn: () => documentsApi.getDocuments(),
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
