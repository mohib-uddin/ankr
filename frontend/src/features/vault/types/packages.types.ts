import type { ApiMessageData } from '@/features/auth/types/auth.types';

export interface PackageTemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  minCount: number;
  maxCount: number;
}

export interface BackendPackageTemplate {
  id: string;
  name: string;
  description?: string | null;
  items: PackageTemplateItem[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPackageDocument {
  templateId: string;
  templateItemId: string;
  documentId: string;
}

export interface BackendUserPackage {
  id: string;
  name: string;
  profileId: string;
  templateId?: string | null;
  template?: BackendPackageTemplate | null;
  documents: UserPackageDocument[];
  securityCode?: string | null;
  sharedLink?: string | null;
  expiresAt?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserPackagePayload {
  name: string;
  templateId: string;
  documents: Array<{
    templateItemId: string;
    documentId: string;
  }>;
  securityCode?: string;
  expiresInDays?: number;
  regenerateLink?: boolean;
  regenerateSecurityCode?: boolean;
}

export interface ValidatePackagePayload {
  sharedLink: string;
  securityCode: string;
}

export interface DocumentsCountResponse {
  categories: Array<{ category: string; count: number }>;
  folders: Array<{ id: string; name: string; fileCount: number; folderCount: number }>;
}

export interface PaginatedData<T> extends ApiMessageData<T[]> {
  page: number;
  lastPage: number;
  total: number;
}
