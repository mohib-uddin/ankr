import type { ApiMessageData } from '@/features/auth/types/auth.types';

export type DocumentCategory = 'Identity' | 'Income' | 'Banking' | 'Real Estate' | 'Debt' | 'Tax' | 'Entity';

export interface ApiMessageDataPagination<T> extends ApiMessageData<T[]> {
  page: number;
  lastPage: number;
  total: number;
}

export interface BackendDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  linkedPropertyId?: string | null;
  tags?: string[] | null;
  notes?: string | null;
  filePath: string;
  folderId?: string | null;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BackendFolder {
  id: string;
  name: string;
  parentFolderId?: string | null;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDocumentPayload {
  name: string;
  category: DocumentCategory;
  linkedPropertyId?: string;
  notes?: string;
  folderId?: string;
  file: File;
}

export interface UpdateDocumentPayload {
  id: string;
  tags?: string[];
  notes?: string;
  name?: string;
  category?: DocumentCategory;
  linkedPropertyId?: string;
  folderId?: string;
}

export interface CreateFolderPayload {
  name: string;
  parentFolderId?: string;
}
