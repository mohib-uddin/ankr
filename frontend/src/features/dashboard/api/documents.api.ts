import { api } from '@/shared/utils/axios';
import type { ApiMessage } from '@/features/auth/types/auth.types';
import type {
  ApiMessageDataPagination,
  BackendDocument,
  BackendFolder,
  CreateDocumentPayload,
  CreateFolderPayload,
  UpdateDocumentPayload,
} from '@/features/dashboard/types/documents.types';
import type { ApiMessageData } from '@/features/auth/types/auth.types';

type GetDocumentsParams = {
  page?: number;
  limit?: number;
  category?: string;
  folderId?: string;
  propertyId?: string;
};

export async function getDocuments(params: GetDocumentsParams = {}) {
  const { page = 1, limit = 200, category, folderId, propertyId } = params;
  const { data } = await api.get<ApiMessageDataPagination<BackendDocument>>('/documents', {
    params: {
      page,
      limit,
      ...(category ? { category } : {}),
      ...(folderId ? { folderId } : {}),
      ...(propertyId ? { propertyId } : {}),
    },
  });
  return data;
}

export async function getFolders() {
  const { data } = await api.get<ApiMessageDataPagination<BackendFolder>>('/documents/folders', {
    params: { page: 1, limit: 200 },
  });
  return data;
}

export async function createDocument(payload: CreateDocumentPayload) {
  const formData = new FormData();
  formData.append('name', payload.name);
  formData.append('category', payload.category);
  formData.append('file', payload.file);
  if (payload.linkedPropertyId) formData.append('linkedPropertyId', payload.linkedPropertyId);
  if (payload.notes) formData.append('notes', payload.notes);
  if (payload.folderId) formData.append('folderId', payload.folderId);

  const { data } = await api.post<ApiMessageData<BackendDocument>>('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

export async function updateDocument(payload: UpdateDocumentPayload) {
  const { id, ...body } = payload;
  const { data } = await api.patch(`/documents/${id}`, body);
  return data;
}

export async function deleteDocument(id: string) {
  const { data } = await api.delete<ApiMessage>(`/documents/${id}`);
  return data;
}

export async function createFolder(payload: CreateFolderPayload) {
  const { data } = await api.post<ApiMessageData<BackendFolder>>('/documents/folders', payload);
  return data;
}

export async function deleteFolder(id: string) {
  const { data } = await api.delete<ApiMessage>(`/documents/folders/${id}`);
  return data;
}
