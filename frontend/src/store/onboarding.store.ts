import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type {
  LiquidityAccount,
  OnboardingBasicInfo,
  OnboardingBusiness,
  OnboardingDisclosures,
  OnboardingIncome,
  OnboardingLiabilities,
  OnboardingOtherAssets,
  OnboardingProperty,
  OnboardingRoutePrefill,
} from '@/features/onboarding/types/wizard.types';

const STORAGE_KEY = 'ankr-onboarding-draft';

export function createDefaultLiquidityAccounts(): LiquidityAccount[] {
  return [{ id: '1', institution: '', accountType: 'Saving Account', currentBalance: '' }];
}

export function createDefaultProperties(): OnboardingProperty[] {
  return [
    {
      id: '1',
      address: '',
      propertyType: 'Single Family',
      estimatedValue: '',
      loanBalance: '',
      monthlyRent: '',
      showAdvanced: false,
      interestRate: '',
      monthlyPayment: '',
      lender: '',
      maturityDate: '',
      ownershipPercent: '',
    },
  ];
}

export function createDefaultBusinesses(): OnboardingBusiness[] {
  return [{ id: '1', entityName: '', ownershipPercent: '', estimatedValue: '' }];
}

function defaultBasicInfo(): OnboardingBasicInfo {
  return { fullName: '', primaryAddress: '', email: '', phone: '', ssn: '' };
}

function defaultOtherAssets(): OnboardingOtherAssets {
  return { publicInvestments: '', privateInvestments: '', otherAssets: '' };
}

function defaultLiabilities(): OnboardingLiabilities {
  return { creditCards: '', personalLoans: '', otherDebt: '', linkedDebt: 'None' };
}

function defaultIncome(): OnboardingIncome {
  return { primaryIncome: '', rentalIncome: '', otherIncome: '' };
}

function defaultDisclosures(): OnboardingDisclosures {
  return {
    guarantor: null,
    guarantorDetails: '',
    legalActions: null,
    bankruptcy: null,
    alimony: null,
    pledgedAssets: null,
    foreclosure: null,
    lawsuits: null,
  };
}

export type OnboardingDraftState = {
  ownerUserId: string | null;
  currentStep: number;
  direction: number;
  basicInfo: OnboardingBasicInfo;
  liquidityAccounts: LiquidityAccount[];
  properties: OnboardingProperty[];
  businesses: OnboardingBusiness[];
  otherAssets: OnboardingOtherAssets;
  liabilities: OnboardingLiabilities;
  income: OnboardingIncome;
  disclosures: OnboardingDisclosures;
};

type OnboardingStore = OnboardingDraftState & {
  setOwnerUserId: (userId: string | null) => void;
  setCurrentStep: (step: number) => void;
  setDirection: (dir: number) => void;
  setBasicInfo: (patch: Partial<OnboardingBasicInfo>) => void;
  setLiquidityAccounts: (accounts: LiquidityAccount[]) => void;
  setProperties: (properties: OnboardingProperty[]) => void;
  setBusinesses: (businesses: OnboardingBusiness[]) => void;
  setOtherAssets: (patch: Partial<OnboardingOtherAssets>) => void;
  setLiabilities: (patch: Partial<OnboardingLiabilities>) => void;
  setIncome: (patch: Partial<OnboardingIncome>) => void;
  setDisclosures: (patch: Partial<OnboardingDisclosures>) => void;
  resetDraftForUser: (userId: string) => void;
  applyRoutePrefill: (prefill: OnboardingRoutePrefill | undefined, startStep: number) => void;
};

export function createFreshDraftState(): OnboardingDraftState {
  return {
    ownerUserId: null,
    currentStep: 1,
    direction: 1,
    basicInfo: defaultBasicInfo(),
    liquidityAccounts: createDefaultLiquidityAccounts(),
    properties: createDefaultProperties(),
    businesses: createDefaultBusinesses(),
    otherAssets: defaultOtherAssets(),
    liabilities: defaultLiabilities(),
    income: defaultIncome(),
    disclosures: defaultDisclosures(),
  };
}

function prefillToState(prefill: OnboardingRoutePrefill | undefined): Omit<OnboardingDraftState, 'ownerUserId' | 'currentStep' | 'direction'> {
  if (!prefill) {
    return {
      basicInfo: defaultBasicInfo(),
      liquidityAccounts: createDefaultLiquidityAccounts(),
      properties: createDefaultProperties(),
      businesses: createDefaultBusinesses(),
      otherAssets: defaultOtherAssets(),
      liabilities: defaultLiabilities(),
      income: defaultIncome(),
      disclosures: defaultDisclosures(),
    };
  }

  return {
    basicInfo: {
      fullName: prefill.fullName ?? '',
      primaryAddress: prefill.primaryAddress ?? '',
      email: prefill.email ?? '',
      phone: prefill.phone ?? '',
      ssn: prefill.ssn ?? '',
    },
    liquidityAccounts:
      prefill.accounts?.length ?
        prefill.accounts.map((account, idx) => ({
          id: String(idx + 1),
          institution: account.institution ?? '',
          accountType: account.accountType ?? 'Saving Account',
          currentBalance: account.currentBalance ?? '',
        }))
      : createDefaultLiquidityAccounts(),
    properties:
      prefill.properties?.length ?
        prefill.properties.map((property, idx) => ({
          id: String(idx + 1),
          address: property.address ?? '',
          propertyType: property.propertyType ?? 'Single Family',
          estimatedValue: property.estimatedValue ?? '',
          loanBalance: property.loanBalance ?? '',
          monthlyRent: property.monthlyRent ?? '',
          showAdvanced: property.showAdvanced ?? false,
          interestRate: property.interestRate ?? '',
          monthlyPayment: property.monthlyPayment ?? '',
          lender: property.lender ?? '',
          maturityDate: property.maturityDate ?? '',
          ownershipPercent: property.ownershipPercent ?? '',
        }))
      : createDefaultProperties(),
    businesses:
      prefill.entities?.length ?
        prefill.entities.map((entity, idx) => ({
          id: String(idx + 1),
          entityName: entity.entityName ?? '',
          ownershipPercent: entity.ownershipPercent ?? '',
          estimatedValue: entity.estimatedValue ?? '',
        }))
      : createDefaultBusinesses(),
    otherAssets: {
      publicInvestments: prefill.publicInvestments ?? '',
      privateInvestments: prefill.privateInvestments ?? '',
      otherAssets: prefill.otherAssets ?? '',
    },
    liabilities: {
      creditCards: prefill.creditCards ?? '',
      personalLoans: prefill.personalLoans ?? '',
      otherDebt: prefill.otherDebt ?? '',
      linkedDebt: prefill.linkedDebt ?? 'None',
    },
    income: {
      primaryIncome: prefill.primaryIncome ?? '',
      rentalIncome: prefill.rentalIncome ?? '',
      otherIncome: prefill.otherIncome ?? '',
    },
    disclosures: defaultDisclosures(),
  };
}

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set, _get) => ({
      ...createFreshDraftState(),
      setOwnerUserId: (userId) => set({ ownerUserId: userId }),
      setCurrentStep: (step) => set({ currentStep: step }),
      setDirection: (dir) => set({ direction: dir }),
      setBasicInfo: (patch) => set((s) => ({ basicInfo: { ...s.basicInfo, ...patch } })),
      setLiquidityAccounts: (liquidityAccounts) => set({ liquidityAccounts }),
      setProperties: (properties) => set({ properties }),
      setBusinesses: (businesses) => set({ businesses }),
      setOtherAssets: (patch) => set((s) => ({ otherAssets: { ...s.otherAssets, ...patch } })),
      setLiabilities: (patch) => set((s) => ({ liabilities: { ...s.liabilities, ...patch } })),
      setIncome: (patch) => set((s) => ({ income: { ...s.income, ...patch } })),
      setDisclosures: (patch) => set((s) => ({ disclosures: { ...s.disclosures, ...patch } })),
      resetDraftForUser: (userId) =>
        set(() => ({
          ...createFreshDraftState(),
          ownerUserId: userId,
        })),
      applyRoutePrefill: (prefill, startStep) =>
        set((s) => ({
          ownerUserId: s.ownerUserId,
          ...prefillToState(prefill),
          currentStep: startStep,
          direction: 1,
        })),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        ownerUserId: state.ownerUserId,
        currentStep: state.currentStep,
        direction: state.direction,
        basicInfo: state.basicInfo,
        liquidityAccounts: state.liquidityAccounts,
        properties: state.properties,
        businesses: state.businesses,
        otherAssets: state.otherAssets,
        liabilities: state.liabilities,
        income: state.income,
        disclosures: state.disclosures,
      }),
      version: 1,
    },
  ),
);

/** Clears persisted draft and resets in-memory state. Call on logout or after successful onboarding. */
export function clearOnboardingDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
  useOnboardingStore.setState(createFreshDraftState());
}
