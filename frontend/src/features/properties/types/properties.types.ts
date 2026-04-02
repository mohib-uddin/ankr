import type { ApiMessageData } from '@/features/auth/types/auth.types';
import type { DashboardProperty, PropertyType, PropertyStatus } from '@/app/context/AppContext';
import { getFileUrl } from '@/shared/utils/file-url';

export interface ApiMessageDataPagination<T> extends ApiMessageData<T[]> {
  page: number;
  lastPage: number;
  total: number;
}

export type BackendPropertyType = PropertyType;

export interface BackendProperty {
  id: string;
  name: string | null;
  address: string;
  city: string | null;
  state: string | null;
  zipCode: string | null;
  propertyType: BackendPropertyType;
  currentStatus: PropertyStatus | null;
  grossSqFt: number | null;
  unitsDoors: number | null;
  yearBuilt: number | null;
  lotSizeAcres: number | string | null;
  zoning: string | null;
  estimatedValue: number | string;
  loanBalance: number | string;
  monthlyRent: number | string;
  interestRate: number | string | null;
  monthlyPayment: number | string | null;
  lender: string | null;
  maturityDate: string | null;
  ownershipPercentage: number;
  images: string[] | null;
  profileId: string;
  createdAt: string;
  updatedAt: string;
  documents: unknown[];
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export function mapBackendPropertyToDashboardProperty(property: BackendProperty): DashboardProperty {
  return {
    id: property.id,
    name: property.name ?? property.address,
    address: property.address,
    city: property.city ?? '',
    state: property.state ?? '',
    zip: property.zipCode ?? '',
    type: property.propertyType,
    sqft: Number(property.grossSqFt ?? 0),
    units: property.unitsDoors ?? 0,
    yearBuilt: property.yearBuilt ?? undefined,
    lotSize: property.lotSizeAcres != null ? Number(property.lotSizeAcres) : undefined,
    zoning: property.zoning ?? undefined,
    status: (property.currentStatus as PropertyStatus) ?? 'Active',
    coverImage:
      property.images && property.images.length > 0
        ? getFileUrl(property.images[0])
        : FALLBACK_IMAGE,
    createdAt: property.createdAt,
    proforma: {
      exitStrategy: 'Hold & Rent',
      purchasePrice: Number(property.estimatedValue ?? 0),
      rehabCost: 0,
      holdingCosts: 0,
      financingCosts: 0,
      softCosts: 0,
      afterRepairValue: Number(property.estimatedValue ?? 0),
      lenderName: property.lender ?? '',
      lenderEmail: '',
      loanAmount: Number(property.loanBalance ?? 0),
      interestRate: Number(property.interestRate ?? 0),
      loanTermMonths: 0,
    },
    budget: {
      grossSqft: 0,
      netSqft: 0,
      categories: [],
    },
    draws: [],
  };
}

