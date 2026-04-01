import { api } from '@/shared/utils/axios';
import type { ApiMessageDataPagination, BackendProperty } from '@/features/properties/types/properties.types';
import type { ApiMessageData } from '@/features/auth/types/auth.types';

export interface GetPropertiesParams {
  page: number;
  limit: number;
}

export interface CreatePropertyPayload {
  name?: string;
  address: string;
  city?: string;
  state?: string;
  zipCode?: string;
  propertyType: string;
  currentStatus?: string;
  grossSqFt?: number;
  unitsDoors?: number;
  yearBuilt?: number;
  lotSizeAcres?: number;
  zoning?: string;
  estimatedValue: number;
  loanBalance: number;
  monthlyRent: number;
  interestRate?: number;
  monthlyPayment?: number;
  lender?: string;
  maturityDate?: string;
  ownershipPercentage?: number;
}

export async function getProperties(params: GetPropertiesParams) {
  const { data } = await api.get<ApiMessageDataPagination<BackendProperty>>('/properties', {
    params,
  });
  return data;
}

export async function createProperty(formData: FormData) {
  const { data } = await api.post<ApiMessageData<BackendProperty>>('/properties', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

