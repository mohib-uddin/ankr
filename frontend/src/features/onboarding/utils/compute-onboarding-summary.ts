import type { OnboardingDraftState } from '@/store/onboarding.store';
import { parseMoneyInput } from './money-parse';

export type OnboardingSummaryInput = Pick<
  OnboardingDraftState,
  'liquidityAccounts' | 'properties' | 'businesses' | 'otherAssets' | 'liabilities' | 'income'
>;

export type OnboardingSummaryFigures = {
  liquidAssets: number;
  realEstateValue: number;
  businessValue: number;
  otherAssetsTotal: number;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  annualIncome: number;
};

function sumLiquidity(accounts: OnboardingSummaryInput['liquidityAccounts']): number {
  return accounts.reduce((acc, row) => {
    const v = parseMoneyInput(row.currentBalance);
    return acc + (v ?? 0);
  }, 0);
}

function sumPropertyValues(properties: OnboardingSummaryInput['properties']): number {
  return properties.reduce((acc, row) => {
    const v = parseMoneyInput(row.estimatedValue);
    return acc + (v ?? 0);
  }, 0);
}

function sumBusinessValues(businesses: OnboardingSummaryInput['businesses']): number {
  return businesses.reduce((acc, row) => {
    const v = parseMoneyInput(row.estimatedValue);
    return acc + (v ?? 0);
  }, 0);
}

export function computeOnboardingSummary(state: OnboardingSummaryInput): OnboardingSummaryFigures {
  const liquidAssets = sumLiquidity(state.liquidityAccounts);
  const realEstateValue = sumPropertyValues(state.properties);
  const businessValue = sumBusinessValues(state.businesses);

  const pub = parseMoneyInput(state.otherAssets.publicInvestments) ?? 0;
  const priv = parseMoneyInput(state.otherAssets.privateInvestments) ?? 0;
  const other = parseMoneyInput(state.otherAssets.otherAssets) ?? 0;
  const otherAssetsTotal = pub + priv + other;

  const cc = parseMoneyInput(state.liabilities.creditCards) ?? 0;
  const pl = parseMoneyInput(state.liabilities.personalLoans) ?? 0;
  const od = parseMoneyInput(state.liabilities.otherDebt) ?? 0;
  const totalLiabilities = cc + pl + od;

  const totalAssets = liquidAssets + realEstateValue + businessValue + otherAssetsTotal;
  const netWorth = totalAssets - totalLiabilities;

  const primary = parseMoneyInput(state.income.primaryIncome) ?? 0;
  const rental = parseMoneyInput(state.income.rentalIncome) ?? 0;
  const otherInc = parseMoneyInput(state.income.otherIncome) ?? 0;
  const annualIncome = primary + rental + otherInc;

  return {
    liquidAssets,
    realEstateValue,
    businessValue,
    otherAssetsTotal,
    totalAssets,
    totalLiabilities,
    netWorth,
    annualIncome,
  };
}

export function formatUsdCompact(value: number): string {
  if (!Number.isFinite(value)) return '$0';
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(abs >= 10_000_000_000 ? 0 : 1)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(abs >= 10_000_000 ? 0 : 1)}M`;
  if (abs >= 10_000) return `${sign}$${Math.round(abs / 1_000)}k`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(1)}k`;
  return `${sign}$${Math.round(abs).toLocaleString('en-US')}`;
}
