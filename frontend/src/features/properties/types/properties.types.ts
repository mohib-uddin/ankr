import type { ApiMessageData } from '@/features/auth/types/auth.types';
import type { DashboardProperty, PropertyType } from '@/app/context/AppContext';

export interface ApiMessageDataPagination<T> extends ApiMessageData<T[]> {
  page: number;
  lastPage: number;
  total: number;
}

export type BackendPropertyType = PropertyType;

export interface BackendProperty {
  id: string;
  address: string;
  propertyType: BackendPropertyType;
  estimatedValue: number;
  loanBalance: number;
  monthlyRent: number;
  interestRate: number | null;
  monthlyPayment: number | null;
  lender: string | null;
  maturityDate: string | null;
  ownershipPercentage: number;
  profileId: string;
  createdAt: string;
  updatedAt: string;
}

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080';

export function mapBackendPropertyToDashboardProperty(property: BackendProperty): DashboardProperty {
  const [street = property.address, city = '', state = ''] = property.address.split(',').map(part => part.trim());

  return {
    id: property.id,
    name: street,
    address: street,
    city,
    state,
    zip: '',
    type: property.propertyType,
    sqft: 0,
    units: 0,
    yearBuilt: undefined,
    lotSize: undefined,
    zoning: undefined,
    status: 'Active',
    coverImage: FALLBACK_IMAGE,
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

