/** Mirrors backend `CompleteInvestorProfileDto` (nested bodies omit profileId). */

export type AccountTypeEnum = 'Saving Account' | 'Money Market' | 'Checking Account';

export type PropertyTypeEnum = 'Single Family' | 'Multi-Family' | 'Commercial';

export type CreateAccountWithoutProfileDto = {
  institution: string;
  accountType: AccountTypeEnum;
  currentBalance: number;
};

export type CreatePropertyWithoutProfileDto = {
  address: string;
  propertyType: PropertyTypeEnum;
  estimatedValue: number;
  loanBalance: number;
  monthlyRent: number;
  interestRate?: number;
  monthlyPayment?: number;
  lender?: string;
  maturityDate?: string;
  ownershipPercentage?: number;
};

export type CreateBusinessesEntityWithoutProfileDto = {
  entityName: string;
  ownershipPercentage: number;
  estimatedValue: number;
};

export type CreateAssetWithoutProfileDto = {
  publicInvestmentsTotal?: number;
  privateInvestments?: number;
  otherAssets?: number;
};

export type CreateLiabilityWithoutProfileDto = {
  creditCardsTotal?: number;
  personalLoans?: number;
  otherDebt?: number;
  linkedAsset?: string;
};

export type CreateIncomeWithoutProfileDto = {
  primaryIncome?: number;
  rentalIncome?: number;
  otherIncome?: number;
};

export type CompleteInvestorOnboardRequest = {
  userId: string;
  fullLegalName: string;
  primaryAddress: string;
  phone: string;
  ssn: string;
  isGuarantor?: boolean;
  hasLegalActions?: boolean;
  hasFiledBankruptcy?: boolean;
  isObligatedForSupport?: boolean;
  hasPledgedAssets?: boolean;
  hasForeclosures?: boolean;
  isPartyToLawsuit?: boolean;
  accounts?: CreateAccountWithoutProfileDto[];
  properties?: CreatePropertyWithoutProfileDto[];
  businessEntities?: CreateBusinessesEntityWithoutProfileDto[];
  asset?: CreateAssetWithoutProfileDto;
  liability?: CreateLiabilityWithoutProfileDto;
  income?: CreateIncomeWithoutProfileDto;
};
