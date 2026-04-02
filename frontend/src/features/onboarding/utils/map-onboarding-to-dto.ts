import type { OnboardingDraftState } from '@/store/onboarding.store';
import type {
  AccountTypeEnum,
  CompleteInvestorOnboardRequest,
  CreateAccountWithoutProfileDto,
  CreateBusinessesEntityWithoutProfileDto,
  CreateIncomeWithoutProfileDto,
  CreateLiabilityWithoutProfileDto,
  CreatePropertyWithoutProfileDto,
  PropertyTypeEnum,
} from '@/features/onboarding/types/onboarding-api.types';
import { normalizePhoneForApi } from './phone-normalize';
import { parseMoneyInput, parsePercentInput } from './money-parse';
import { ymdToIso8601UtcMidnight } from './date-iso';

const ACCOUNT_TYPES: readonly AccountTypeEnum[] = ['Saving Account', 'Money Market', 'Checking Account'] as const;

const PROPERTY_TYPES: readonly PropertyTypeEnum[] = ['Single Family', 'Multi-Family', 'Commercial'] as const;

function isAccountType(v: string): v is AccountTypeEnum {
  return (ACCOUNT_TYPES as readonly string[]).includes(v);
}

function isPropertyType(v: string): v is PropertyTypeEnum {
  return (PROPERTY_TYPES as readonly string[]).includes(v);
}

function rowHasAnyPropertyText(row: OnboardingDraftState['properties'][number]): boolean {
  return (
    row.name.trim() !== '' ||
    row.address.trim() !== '' ||
    row.estimatedValue.trim() !== '' ||
    row.loanBalance.trim() !== '' ||
    row.monthlyRent.trim() !== '' ||
    row.interestRate.trim() !== '' ||
    row.monthlyPayment.trim() !== '' ||
    row.lender.trim() !== '' ||
    row.maturityDate.trim() !== '' ||
    row.ownershipPercent.trim() !== ''
  );
}

function rowHasAnyBusinessText(row: OnboardingDraftState['businesses'][number]): boolean {
  return (
    row.entityName.trim() !== '' || row.ownershipPercent.trim() !== '' || row.estimatedValue.trim() !== ''
  );
}

function rowHasAnyAccountText(row: OnboardingDraftState['liquidityAccounts'][number]): boolean {
  return row.institution.trim() !== '' || row.currentBalance.trim() !== '';
}

export type MapOnboardingResult =
  | { ok: true; payload: CompleteInvestorOnboardRequest }
  | { ok: false; message: string };

export function mapOnboardingStateToDto(
  state: OnboardingDraftState,
  userId: string,
): MapOnboardingResult {
  const phone = normalizePhoneForApi(state.basicInfo.phone);
  if (!phone) {
    return { ok: false, message: 'Enter a valid mobile phone number (US numbers can be 10 digits).' };
  }

  const fullLegalName = state.basicInfo.fullName.trim();
  const primaryAddress = state.basicInfo.primaryAddress.trim();
  const ssn = state.basicInfo.ssn.trim();
  if (!fullLegalName) return { ok: false, message: 'Legal name is required.' };
  if (!primaryAddress) return { ok: false, message: 'Primary address is required.' };
  if (!ssn) return { ok: false, message: 'SSN is required.' };

  const accounts: CreateAccountWithoutProfileDto[] = [];
  for (const row of state.liquidityAccounts) {
    const touched = rowHasAnyAccountText(row);
    if (!touched) continue;
    if (!row.institution.trim()) {
      return { ok: false, message: 'Each liquidity account needs an institution, or remove empty rows.' };
    }
    if (!isAccountType(row.accountType)) {
      return { ok: false, message: 'Invalid account type selected.' };
    }
    const bal = parseMoneyInput(row.currentBalance);
    if (bal === null || bal < 0) {
      return { ok: false, message: 'Enter a valid current balance for each liquidity account.' };
    }
    accounts.push({
      institution: row.institution.trim(),
      accountType: row.accountType,
      currentBalance: bal,
    });
  }

  const properties: CreatePropertyWithoutProfileDto[] = [];
  for (const row of state.properties) {
    if (!rowHasAnyPropertyText(row)) continue;
    const address = row.address.trim();
    if (!address) {
      return { ok: false, message: 'Each property with financial details needs a full address.' };
    }
    if (!isPropertyType(row.propertyType)) {
      return { ok: false, message: 'Invalid property type selected.' };
    }
    const estimatedValue = parseMoneyInput(row.estimatedValue);
    const loanBalance = parseMoneyInput(row.loanBalance);
    const monthlyRent = parseMoneyInput(row.monthlyRent);
    if (estimatedValue === null || estimatedValue < 0) {
      return { ok: false, message: 'Enter a valid estimated value for each property you add.' };
    }
    if (loanBalance === null || loanBalance < 0) {
      return { ok: false, message: 'Enter a valid loan balance for each property you add.' };
    }
    if (monthlyRent === null || monthlyRent < 0) {
      return { ok: false, message: 'Enter a valid monthly rent for each property you add (use 0 if none).' };
    }

    const item: CreatePropertyWithoutProfileDto = {
      address,
      propertyType: row.propertyType,
      estimatedValue,
      loanBalance,
      monthlyRent,
    };

    const ir = parseMoneyInput(row.interestRate);
    if (ir !== null && ir >= 0) item.interestRate = ir;
    const mp = parseMoneyInput(row.monthlyPayment);
    if (mp !== null && mp >= 0) item.monthlyPayment = mp;
    if (row.lender.trim()) item.lender = row.lender.trim();
    if (row.maturityDate.trim()) {
      const iso = ymdToIso8601UtcMidnight(row.maturityDate.trim());
      if (!iso) {
        return {
          ok: false,
          message: 'Use the calendar to pick a valid maturity date, or clear the field.',
        };
      }
      item.maturityDate = iso;
    }
    const op = parsePercentInput(row.ownershipPercent);
    if (op !== null && op >= 0 && op <= 100) item.ownershipPercentage = op;

    properties.push(item);
  }

  const businessEntities: CreateBusinessesEntityWithoutProfileDto[] = [];
  for (const row of state.businesses) {
    if (!rowHasAnyBusinessText(row)) continue;
    const entityName = row.entityName.trim();
    if (!entityName) {
      return { ok: false, message: 'Each business entity needs a name, or remove empty rows.' };
    }
    const ownershipPercentage = parsePercentInput(row.ownershipPercent);
    const estimatedValue = parseMoneyInput(row.estimatedValue);
    if (ownershipPercentage === null || ownershipPercentage < 0 || ownershipPercentage > 100) {
      return { ok: false, message: 'Enter a valid ownership percentage (0–100) for each entity.' };
    }
    if (estimatedValue === null || estimatedValue < 0) {
      return { ok: false, message: 'Enter a valid estimated value for each business entity.' };
    }
    businessEntities.push({ entityName, ownershipPercentage, estimatedValue });
  }

  const d = state.disclosures;
  const bool = (v: boolean | null) => v ?? false;

  const payload: CompleteInvestorOnboardRequest = {
    userId,
    fullLegalName,
    primaryAddress,
    phone,
    ssn,
    isGuarantor: bool(d.guarantor),
    hasLegalActions: bool(d.legalActions),
    hasFiledBankruptcy: bool(d.bankruptcy),
    isObligatedForSupport: bool(d.alimony),
    hasPledgedAssets: bool(d.pledgedAssets),
    hasForeclosures: bool(d.foreclosure),
    isPartyToLawsuit: bool(d.lawsuits),
  };

  if (accounts.length > 0) payload.accounts = accounts;
  if (properties.length > 0) payload.properties = properties;
  if (businessEntities.length > 0) payload.businessEntities = businessEntities;

  const pub = parseMoneyInput(state.otherAssets.publicInvestments);
  const priv = parseMoneyInput(state.otherAssets.privateInvestments);
  const oa = parseMoneyInput(state.otherAssets.otherAssets);
  if (pub !== null || priv !== null || oa !== null) {
    const asset: NonNullable<CompleteInvestorOnboardRequest['asset']> = {};
    if (pub !== null && pub >= 0) asset.publicInvestmentsTotal = pub;
    if (priv !== null && priv >= 0) asset.privateInvestments = priv;
    if (oa !== null && oa >= 0) asset.otherAssets = oa;
    if (Object.keys(asset).length > 0) payload.asset = asset;
  }

  const cc = parseMoneyInput(state.liabilities.creditCards);
  const pl = parseMoneyInput(state.liabilities.personalLoans);
  const od = parseMoneyInput(state.liabilities.otherDebt);
  const linked = state.liabilities.linkedDebt.trim();
  const linkedOk = linked !== '' && linked !== 'None';
  if (cc !== null || pl !== null || od !== null || linkedOk) {
    const liability: CreateLiabilityWithoutProfileDto = {};
    if (cc !== null && cc >= 0) liability.creditCardsTotal = cc;
    if (pl !== null && pl >= 0) liability.personalLoans = pl;
    if (od !== null && od >= 0) liability.otherDebt = od;
    if (linkedOk) liability.linkedAsset = linked;
    if (Object.keys(liability).length > 0) payload.liability = liability;
  }

  const pi = parseMoneyInput(state.income.primaryIncome);
  const ri = parseMoneyInput(state.income.rentalIncome);
  const oi = parseMoneyInput(state.income.otherIncome);
  if (pi !== null || ri !== null || oi !== null) {
    const income: CreateIncomeWithoutProfileDto = {};
    if (pi !== null && pi >= 0) income.primaryIncome = pi;
    if (ri !== null && ri >= 0) income.rentalIncome = ri;
    if (oi !== null && oi >= 0) income.otherIncome = oi;
    if (Object.keys(income).length > 0) payload.income = income;
  }

  return { ok: true, payload };
}
