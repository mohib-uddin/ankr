import axios from 'axios';
import { api } from '@/shared/utils/axios';
import type { ApiMessage, ApiMessageData } from '@/features/auth/types/auth.types';
import type {
  BackendPackageTemplate,
  BackendUserPackage,
  CreateUserPackagePayload,
  DocumentsCountResponse,
  PaginatedData,
  ValidatePackagePayload,
} from '@/features/vault/types/packages.types';

export async function getPackageTemplates(params: { page?: number; limit?: number } = {}) {
  const { page = 1, limit = 200 } = params;
  const { data } = await api.get<PaginatedData<BackendPackageTemplate>>('/package-templates', {
    params: { page, limit },
  });
  return data;
}

export async function getUserPackages() {
  const { data } = await api.get<ApiMessageData<BackendUserPackage[]>>('/user-packages');
  return data;
}

export async function upsertUserPackage(payload: CreateUserPackagePayload) {
  const { data } = await api.post<ApiMessageData<BackendUserPackage>>('/user-packages', payload);
  return data;
}

export async function deleteUserPackage(id: string) {
  const { data } = await api.delete<ApiMessage>(`/user-packages/${id}`);
  return data;
}

export async function validateSharedPackage(payload: ValidatePackagePayload) {
  const publicApi = axios.create({
    baseURL: api.defaults.baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 30_000,
  });

  const { data } = await publicApi.post<ApiMessageData<BackendUserPackage>>('/auth/validate-package', payload);
  return data;
}

export async function getDocumentCounts() {
  const { data } = await api.get<ApiMessageData<DocumentsCountResponse>>('/documents/counts');
  return data;
}
