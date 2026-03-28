export type OnboardingRoutePrefill = {
  fullName?: string;
  primaryAddress?: string;
  email?: string;
  phone?: string;
  ssn?: string;
  accounts?: Array<{ institution: string; accountType: string; currentBalance: string }>;
  properties?: Array<{
    address: string;
    propertyType: string;
    estimatedValue: string;
    loanBalance: string;
    monthlyRent: string;
    showAdvanced?: boolean;
    interestRate?: string;
    monthlyPayment?: string;
    lender?: string;
    maturityDate?: string;
    ownershipPercent?: string;
  }>;
  entities?: Array<{ entityName: string; ownershipPercent: string; estimatedValue: string }>;
  publicInvestments?: string;
  privateInvestments?: string;
  otherAssets?: string;
  creditCards?: string;
  personalLoans?: string;
  otherDebt?: string;
  linkedDebt?: string;
  primaryIncome?: string;
  rentalIncome?: string;
  otherIncome?: string;
};

export type OnboardingLocationState = {
  startStep?: number;
  prefillData?: OnboardingRoutePrefill;
} | null;

export type LiquidityAccount = {
  id: string;
  institution: string;
  accountType: string;
  currentBalance: string;
};

export type OnboardingProperty = {
  id: string;
  address: string;
  propertyType: string;
  estimatedValue: string;
  loanBalance: string;
  monthlyRent: string;
  showAdvanced: boolean;
  interestRate: string;
  monthlyPayment: string;
  lender: string;
  maturityDate: string;
  ownershipPercent: string;
};

export type OnboardingBusiness = {
  id: string;
  entityName: string;
  ownershipPercent: string;
  estimatedValue: string;
};

export type OnboardingBasicInfo = {
  fullName: string;
  primaryAddress: string;
  email: string;
  phone: string;
  ssn: string;
};

export type OnboardingOtherAssets = {
  publicInvestments: string;
  privateInvestments: string;
  otherAssets: string;
};

export type OnboardingLiabilities = {
  creditCards: string;
  personalLoans: string;
  otherDebt: string;
  linkedDebt: string;
};

export type OnboardingIncome = {
  primaryIncome: string;
  rentalIncome: string;
  otherIncome: string;
};

export type OnboardingDisclosures = {
  guarantor: boolean | null;
  guarantorDetails: string;
  legalActions: boolean | null;
  bankruptcy: boolean | null;
  alimony: boolean | null;
  pledgedAssets: boolean | null;
  foreclosure: boolean | null;
  lawsuits: boolean | null;
};
