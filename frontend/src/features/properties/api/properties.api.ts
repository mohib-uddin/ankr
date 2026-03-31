import { api } from '@/shared/utils/axios';
import type { ApiMessageDataPagination, BackendProperty } from '@/features/properties/types/properties.types';

export interface GetPropertiesParams {
  page: number;
  limit: number;
}

export async function getProperties(params: GetPropertiesParams) {
  const { data } = await api.get<ApiMessageDataPagination<BackendProperty>>('/properties', {
    params,
  });
  return data;
}


