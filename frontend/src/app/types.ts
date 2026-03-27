export interface Account {
  id: string;
  institution: string;
  accountType: string;
  balance: string;
}

export interface Property {
  id: string;
  address: string;
  propertyType: string;
  estimatedValue: string;
  loanBalance: string;
  monthlyRent: string;
  interestRate: string;
  monthlyPayment: string;
  lender: string;
  maturityDate: string;
  ownershipPercent: string;
  showAdvanced: boolean;
}

export interface Entity {
  id: string;
  name: string;
  ownershipPercent: string;
  estimatedValue: string;
}

export interface YesNoAnswer {
  answer: boolean | null;
  detail: string;
}

export interface FormData {
  fullName: string;
  address: string;
  email: string;
  phone: string;
  ssn: string;
  accounts: Account[];
  properties: Property[];
  entities: Entity[];
  investmentsTotal: string;
  privateInvestments: string;
  otherAssets: string;
  creditCardsTotal: string;
  personalLoans: string;
  otherDebt: string;
  primaryIncome: string;
  rentalIncome: string;
  otherIncome: string;
  yesNoAnswers: Record<string, YesNoAnswer>;
}

export type StepId =
  | 'welcome'
  | 'upload-review'
  | 'basic-info'
  | 'liquidity'
  | 'real-estate'
  | 'businesses'
  | 'other-assets'
  | 'liabilities'
  | 'income'
  | 'yes-no'
  | 'snapshot';

export const MANUAL_STEPS: StepId[] = [
  'basic-info',
  'liquidity',
  'real-estate',
  'businesses',
  'other-assets',
  'liabilities',
  'income',
  'yes-no',
  'snapshot',
];

export const UPLOAD_STEPS: StepId[] = ['upload-review', 'yes-no', 'snapshot'];

export const STEP_LABELS: Record<StepId, string> = {
  welcome: 'Welcome',
  'upload-review': 'Upload & Review',
  'basic-info': 'Personal Details',
  liquidity: 'Liquidity',
  'real-estate': 'Real Estate',
  businesses: 'Businesses',
  'other-assets': 'Other Assets',
  liabilities: 'Liabilities',
  income: 'Income',
  'yes-no': 'Disclosures',
  snapshot: 'Review',
};

export const YES_NO_QUESTIONS = [
  { id: 'guarantor', text: 'Are you a guarantor, co-maker, or endorser on any debt not listed above?' },
  { id: 'legal_actions', text: 'Are there any pending legal actions, judgments, or liens against you?' },
  { id: 'bankruptcy', text: 'Have you ever filed for bankruptcy?' },
  { id: 'alimony', text: 'Are you obligated to pay alimony, child support, or separate maintenance?' },
  { id: 'pledged_assets', text: 'Have you pledged any of the above assets as collateral for any debt not listed?' },
  { id: 'foreclosure', text: 'Have you ever had property foreclosed upon or given title or deed in lieu thereof?' },
  { id: 'lawsuits', text: 'Are you a party to any claims or lawsuits?' },
];

export function createEmptyFormData(): FormData {
  return {
    fullName: '',
    address: '',
    email: '',
    phone: '',
    ssn: '',
    accounts: [],
    properties: [],
    entities: [],
    investmentsTotal: '',
    privateInvestments: '',
    otherAssets: '',
    creditCardsTotal: '',
    personalLoans: '',
    otherDebt: '',
    primaryIncome: '',
    rentalIncome: '',
    otherIncome: '',
    yesNoAnswers: {},
  };
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^0-9.-]/g, '')) || 0;
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
