import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { useShallow } from 'zustand/shallow';
import svgPaths from '@/icons/onboarding';
import checkSvgPaths from '@/icons/onboarding-check';
import summarySvgPaths from '@/icons/onboarding-summary';
import advancedSvgPaths from '@/icons/onboarding-advanced';
import type {
  LiquidityAccount,
  OnboardingBasicInfo,
  OnboardingBusiness,
  OnboardingLocationState,
  OnboardingProperty,
} from '@/features/onboarding/types/wizard.types';
import { computeOnboardingSummary, formatUsdCompact } from '@/features/onboarding/utils/compute-onboarding-summary';
import { mapOnboardingStateToDto } from '@/features/onboarding/utils/map-onboarding-to-dto';
import {
  type BasicInfoValidatedFieldKey,
  getBasicInfoStepFieldErrors,
} from '@/features/onboarding/utils/onboarding-validation';
import { useInvestorOnboardMutation } from '@/services/onboarding.service';
import { OutlinedDatePicker, OutlinedSelect, OutlinedTextField } from '@/shared/components/form';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { clearOnboardingDraft, useOnboardingStore } from '@/store/onboarding.store';
import { useSessionStore } from '@/store/session.store';
import {
  ONBOARDING_ACCOUNT_TYPE_OPTIONS,
  ONBOARDING_PROPERTY_TYPE_OPTIONS,
} from '@/features/onboarding/constants/select-options';

type Step = {
  id: number;
  label: string;
  shortLabel?: string;
};

/** Matches legacy `<p>` labels on property/business/income steps (Figtree, not SF Pro). */
const ONBOARDING_FIGTREE_LABEL_CLASS =
  "font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] w-full";

const STEPS: Step[] = [
  { id: 1, label: 'Basic\nInformation', shortLabel: 'Basic Information' },
  { id: 2, label: 'Liquidity', shortLabel: 'Liquidity' },
  { id: 3, label: 'Properties\nYou Own', shortLabel: 'Properties You Own' },
  { id: 4, label: 'Businesses\n& Entities', shortLabel: 'Businesses & Entities' },
  { id: 5, label: 'Other Assets', shortLabel: 'Other Assets' },
  { id: 6, label: 'Liabilities', shortLabel: 'Liabilities' },
  { id: 7, label: 'Income', shortLabel: 'Income' },
  { id: 8, label: 'Summary', shortLabel: 'Summary' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const appliedNavState = useRef<string>('');
  const [onboardingHydrated, setOnboardingHydrated] = useState(() => useOnboardingStore.persist.hasHydrated());

  const userId = useSessionStore((s) => s.user?.id);

  useEffect(() => {
    if (onboardingHydrated) return;
    const unsub = useOnboardingStore.persist.onFinishHydration(() => setOnboardingHydrated(true));
    return unsub;
  }, [onboardingHydrated]);

  const {
    currentStep,
    direction,
    basicInfo,
    liquidityAccounts,
    properties,
    businesses,
    otherAssets,
    liabilities,
    income,
    disclosures,
    setCurrentStep,
    setDirection,
    setBasicInfo,
    setLiquidityAccounts,
    setProperties,
    setBusinesses,
    setOtherAssets,
    setLiabilities,
    setIncome,
    setDisclosures,
    resetDraftForUser,
    applyRoutePrefill,
  } = useOnboardingStore(
    useShallow((s) => ({
      currentStep: s.currentStep,
      direction: s.direction,
      basicInfo: s.basicInfo,
      liquidityAccounts: s.liquidityAccounts,
      properties: s.properties,
      businesses: s.businesses,
      otherAssets: s.otherAssets,
      liabilities: s.liabilities,
      income: s.income,
      disclosures: s.disclosures,
      setCurrentStep: s.setCurrentStep,
      setDirection: s.setDirection,
      setBasicInfo: s.setBasicInfo,
      setLiquidityAccounts: s.setLiquidityAccounts,
      setProperties: s.setProperties,
      setBusinesses: s.setBusinesses,
      setOtherAssets: s.setOtherAssets,
      setLiabilities: s.setLiabilities,
      setIncome: s.setIncome,
      setDisclosures: s.setDisclosures,
      resetDraftForUser: s.resetDraftForUser,
      applyRoutePrefill: s.applyRoutePrefill,
    })),
  );

  useEffect(() => {
    if (!onboardingHydrated || !userId) return;
    if (useOnboardingStore.getState().ownerUserId !== userId) {
      resetDraftForUser(userId);
    }
  }, [userId, onboardingHydrated, resetDraftForUser]);

  useEffect(() => {
    const st = location.state as OnboardingLocationState;
    if (st == null) return;
    const serialized = JSON.stringify(st);
    if (serialized === '{}' || appliedNavState.current === serialized) return;
    const hasPrefill = Boolean(st.prefillData && Object.keys(st.prefillData).length > 0);
    const hasStart = typeof st.startStep === 'number' && st.startStep >= 1 && st.startStep <= 8;
    if (!hasPrefill && !hasStart) return;
    appliedNavState.current = serialized;
    const start = hasStart ? st.startStep! : 1;
    if (hasPrefill && st.prefillData) {
      applyRoutePrefill(st.prefillData, start);
    } else {
      setCurrentStep(start);
    }
    navigate(`${location.pathname}${location.search || ''}`, { replace: true, state: {} });
  }, [location.state, location.pathname, location.search, navigate, applyRoutePrefill, setCurrentStep]);

  const summaryInputs = useOnboardingStore(
    useShallow((s) => ({
      liquidityAccounts: s.liquidityAccounts,
      properties: s.properties,
      businesses: s.businesses,
      otherAssets: s.otherAssets,
      liabilities: s.liabilities,
      income: s.income,
    })),
  );
  const summary = useMemo(() => computeOnboardingSummary(summaryInputs), [summaryInputs]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [step1FieldErrors, setStep1FieldErrors] = useState<
    Partial<Record<BasicInfoValidatedFieldKey, string>>
  >({});
  const [activateError, setActivateError] = useState('');

  const onboardMutation = useInvestorOnboardMutation();

  const handleBack = () => {
    setStep1FieldErrors({});
    setActivateError('');
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep(currentStep - 1);
    } else {
      navigate('/profile-setup');
    }
  };

  const handleSkip = () => {
    setStep1FieldErrors({});
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleNext = () => {
    setActivateError('');
    if (currentStep === 1) {
      const errs = getBasicInfoStepFieldErrors(useOnboardingStore.getState().basicInfo);
      if (Object.keys(errs).length > 0) {
        setStep1FieldErrors(errs);
        return;
      }
      setStep1FieldErrors({});
    }
    if (currentStep < STEPS.length) {
      setDirection(1);
      setCurrentStep(currentStep + 1);
    } else {
      setShowSuccess(true);
    }
  };

  const handleActivate = () => {
    setActivateError('');
    if (!userId) {
      setActivateError('You must be signed in to activate your profile.');
      return;
    }
    const state = useOnboardingStore.getState();
    const mapped = mapOnboardingStateToDto(state, userId);
    if (!mapped.ok) {
      setActivateError(mapped.message);
      return;
    }
    onboardMutation.mutate(mapped.payload, {
      onSuccess: () => {
        clearOnboardingDraft();
        setShowSuccess(true);
      },
      onError: (err) => setActivateError(getApiErrorMessage(err)),
    });
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleInputChange = (field: keyof OnboardingBasicInfo, value: string) => {
    setBasicInfo({ [field]: value });
    const schemaKey: BasicInfoValidatedFieldKey | null =
      field === 'fullName'
        ? 'fullName'
        : field === 'primaryAddress'
          ? 'primaryAddress'
          : field === 'phone'
            ? 'phone'
            : field === 'ssn'
              ? 'ssn'
              : null;
    if (!schemaKey) return;
    setStep1FieldErrors((prev) => {
      if (!prev[schemaKey]) return prev;
      const next = { ...prev };
      delete next[schemaKey];
      return next;
    });
  };

  const addLiquidityAccount = () => {
    const rows = useOnboardingStore.getState().liquidityAccounts;
    setLiquidityAccounts([
      ...rows,
      { id: String(rows.length + 1), institution: '', accountType: 'Saving Account', currentBalance: '' },
    ]);
  };

  const removeLiquidityAccount = (id: string) => {
    const rows = useOnboardingStore.getState().liquidityAccounts;
    if (rows.length > 1) {
      setLiquidityAccounts(rows.filter((acc) => acc.id !== id));
    }
  };

  const updateLiquidityAccount = (id: string, field: keyof LiquidityAccount, value: string) => {
    const rows = useOnboardingStore.getState().liquidityAccounts;
    setLiquidityAccounts(rows.map((acc) => (acc.id === id ? { ...acc, [field]: value } : acc)));
  };

  const addProperty = () => {
    const rows = useOnboardingStore.getState().properties;
    setProperties([
      ...rows,
      {
        id: String(rows.length + 1),
        name: '',
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
    ]);
  };

  const removeProperty = (id: string) => {
    const rows = useOnboardingStore.getState().properties;
    if (rows.length > 1) {
      setProperties(rows.filter((prop) => prop.id !== id));
    }
  };

  const updateProperty = (id: string, field: keyof OnboardingProperty, value: string | boolean) => {
    const rows = useOnboardingStore.getState().properties;
    setProperties(rows.map((prop) => (prop.id === id ? { ...prop, [field]: value } : prop)));
  };

  const toggleAdvancedDetails = (id: string) => {
    const rows = useOnboardingStore.getState().properties;
    setProperties(rows.map((prop) => (prop.id === id ? { ...prop, showAdvanced: !prop.showAdvanced } : prop)));
  };

  const addBusiness = () => {
    const rows = useOnboardingStore.getState().businesses;
    setBusinesses([...rows, { id: String(rows.length + 1), entityName: '', ownershipPercent: '', estimatedValue: '' }]);
  };

  const removeBusiness = (id: string) => {
    const rows = useOnboardingStore.getState().businesses;
    if (rows.length > 1) {
      setBusinesses(rows.filter((bus) => bus.id !== id));
    }
  };

  const updateBusiness = (id: string, field: keyof OnboardingBusiness, value: string) => {
    const rows = useOnboardingStore.getState().businesses;
    setBusinesses(rows.map((bus) => (bus.id === id ? { ...bus, [field]: value } : bus)));
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Basic Information';
      case 2: return 'Liquidity';
      case 3: return 'Properties You Own';
      case 4: return 'Businesses & Entities';
      case 5: return 'Other Assets';
      case 6: return 'Liabilities';
      case 7: return 'Income';
      case 8: return 'Financial Snapshot';
      default: return '';
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case 1: return 'Your legal identity and contact details.';
      case 2: return 'Bank accounts and liquid assets.';
      case 3: return 'Real estate assets and associated debt.';
      case 4: return 'LLCs, corporations, partnerships you own.';
      case 5: return 'Investments and additional holdings.';
      case 6: return 'Outstanding debt and obligations.';
      case 7: return 'Annual income from all sources.';
      case 8: return 'Review your profile before activation.';
      default: return '';
    }
  };

  // Success State
  if (showSuccess) {
    return (
      <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto">
        <div className="relative min-h-screen w-full flex items-center justify-center p-[24px]">
          <div className="flex flex-col gap-[24px] items-center w-full max-w-[442px]">
            {/* Checkmark Icon */}
            <div className="relative shrink-0 size-[233px]">
              {/* Outer circle */}
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full size-[233px] top-0 border-2 border-[#c4b29a]" />
              {/* Middle circle */}
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full size-[183px] top-[25px] border-2 border-[#c4b29a]" />
              {/* Inner circle with checkmark */}
              <div className="absolute left-1/2 -translate-x-1/2 size-[139px] top-[47px]">
                <div className="bg-[#764d2f] rounded-full size-full relative">
                  <svg className="absolute inset-0 m-auto size-full" fill="none" viewBox="0 0 139 139">
                    <path d={checkSvgPaths.p17b85580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Text */}
            <div className="flex flex-col gap-[24px] items-center text-center w-full">
              <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic text-[#764d2f] text-[36px] md:text-[48px] w-full">
                Profile Activated
              </p>
              <p className="font-['Montserrat',sans-serif] font-medium leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full">
                Your financial profile is live and ready to use across every deal on the platform.
              </p>
            </div>

            {/* Button */}
            <button
              onClick={handleGoToDashboard}
              className="bg-[#764d2f] flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] hover:bg-[#8c5d3a] transition-colors"
            >
              <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-white text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Go to Dashboard
              </p>
              <div className="flex h-[9.537px] items-center justify-center w-[12.999px]">
                <div className="flex-none rotate-90">
                  <div className="h-[12.999px] w-[9.537px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
                      <path d={checkSvgPaths.pec28900} fill="white" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative min-h-screen w-full px-[24px] py-[40px] lg:px-[40px] xl:px-0">
        {/* Stepper */}
        <div className="w-full max-w-[1310px] mx-auto mb-[40px] md:mb-[48px]">
          <div className="flex items-start justify-start xl:justify-center overflow-x-auto pb-[16px] scrollbar-hide">
            <div className="flex items-start min-w-max xl:min-w-0">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-start">
                  <div className="flex flex-col gap-[8px] items-center w-[86px] shrink-0">
                    <div className="relative size-[44px]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 44 44">
                        {currentStep > step.id ? (
                          <circle cx="22" cy="22" fill="#764D2F" r="22" />
                        ) : currentStep === step.id ? (
                          <circle cx="22" cy="22" fill="#FAFAFA" r="21" stroke="#764D2F" strokeWidth="2" />
                        ) : (
                          <circle cx="22" cy="22" fill="#FAFAFA" r="21" stroke="#D3B597" strokeWidth="2" />
                        )}
                      </svg>
                      <p
                        className="absolute font-['DM_Sans',sans-serif] font-bold leading-[normal] text-[16px] whitespace-nowrap left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                        style={{
                          fontVariationSettings: "'opsz' 14",
                          color: currentStep >= step.id ? (currentStep === step.id ? '#764D2F' : '#FFFFFF') : '#D3B597'
                        }}
                      >
                        {step.id}
                      </p>
                    </div>
                    <p
                      className="font-['Montserrat',sans-serif] font-medium leading-[normal] text-[14px] text-center w-full whitespace-pre-wrap"
                      style={{ color: currentStep >= step.id ? '#764D2F' : '#D3B597' }}
                    >
                      {step.label}
                    </p>
                  </div>
                  {index < STEPS.length - 1 && (
                    <div className="flex flex-col items-start pb-[15px] pt-[20px] w-[80px] shrink-0">
                      <div className={`h-[2px] w-full ${currentStep > step.id ? 'bg-[#764d2f]' : 'bg-[#d3b597]'}`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-[1305px] mx-auto [&_div.flex.flex-col.gap-\\[6px\\].items-start>p]:font-['SF_Pro',sans-serif] [&_div.flex.flex-col.gap-\\[6px\\].items-start>p]:font-[510] [&_div.flex.flex-col.gap-\\[6px\\].items-start>p]:leading-[normal] [&_div.flex.flex-col.gap-\\[6px\\].items-start>p]:text-[#333] [&_div.flex.flex-col.gap-\\[6px\\].items-start>p]:text-[14px]">
          {/* Title Section */}
          <div className="flex flex-col gap-[8px] items-start leading-[normal] w-full mb-[32px]">
            <p className="font-['Canela_Text_Trial',sans-serif] font-medium not-italic text-[#764d2f] text-[28px] md:text-[36px] w-full">
              {getStepTitle()}
            </p>
            <p className="font-['Montserrat',sans-serif] font-medium text-[#8c8780] text-[14px] md:text-[16px] w-full">
              {getStepSubtitle()}
            </p>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              initial={{ opacity: 0, y: 20, x: direction * 42, scale: 0.985, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, x: direction * -36, scale: 0.992, filter: 'blur(3px)' }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
          {/* Step 1 - Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white relative rounded-[20px] w-full mb-[36px]">
              <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col items-start p-[24px] relative w-full">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  <OutlinedTextField
                    id="onboarding-basic-full-name"
                    label="Full Legal Name"
                    type="text"
                    value={basicInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Jane A. Smith"
                    error={step1FieldErrors.fullName}
                  />

                  <OutlinedTextField
                    id="onboarding-basic-primary-address"
                    label="Primary Address"
                    type="text"
                    value={basicInfo.primaryAddress}
                    onChange={(e) => handleInputChange('primaryAddress', e.target.value)}
                    placeholder="123 Main Street, New York"
                    error={step1FieldErrors.primaryAddress}
                  />

                  <div className="flex flex-col md:flex-row gap-[24px] items-start w-full">
                    <div className="flex-1 w-full md:w-auto">
                      <OutlinedTextField
                        id="onboarding-basic-email"
                        label="Email"
                        type="email"
                        value={basicInfo.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="jane@example.com"
                      />
                    </div>

                    <div className="flex-1 w-full md:w-auto">
                      <OutlinedTextField
                        id="onboarding-basic-phone"
                        label="Phone"
                        type="tel"
                        value={basicInfo.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="(555) 000 - 0000"
                        error={step1FieldErrors.phone}
                      />
                    </div>
                  </div>

                  <OutlinedTextField
                    id="onboarding-basic-ssn"
                    label="Social Security Number"
                    type="password"
                    value={basicInfo.ssn}
                    onChange={(e) => handleInputChange('ssn', e.target.value)}
                    placeholder="********"
                    error={step1FieldErrors.ssn}
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Encrypted and stored securely. Required for identity verification.
                      </p>
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2 - Liquidity */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-[24px] w-full mb-[36px]">
              {liquidityAccounts.map((account, index) => (
                <div key={account.id} className="bg-white relative rounded-[20px] w-full">
                  <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-start p-[24px] relative w-full">
                    <div className="flex gap-[10px] items-start justify-end w-full mb-[24px]">
                      <p className="flex-1 font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic text-[#764d2f] text-[24px]">
                        Account {index + 1}
                      </p>
                      <button onClick={() => removeLiquidityAccount(account.id)} className="size-[24px] shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <path d={advancedSvgPaths.p36250880} stroke="#D3B597" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col gap-[24px] w-full">
                      <div className="flex flex-col md:flex-row gap-[24px] items-start w-full">
                        <div className="flex-1 w-full md:w-auto">
                          <OutlinedTextField
                            id={`liquidity-institution-${account.id}`}
                            label="Institution"
                            type="text"
                            value={account.institution}
                            onChange={(e) => updateLiquidityAccount(account.id, 'institution', e.target.value)}
                            placeholder="Chase,wells,fargo...."
                          />
                        </div>

                        <div className="flex flex-col gap-[6px] items-start flex-1 w-full md:w-auto">
                          <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Account Type
                          </p>
                          <div className="w-full">
                            <OutlinedSelect
                              value={account.accountType}
                              onValueChange={(v) => updateLiquidityAccount(account.id, 'accountType', v)}
                              options={ONBOARDING_ACCOUNT_TYPE_OPTIONS}
                              placeholder="Select account type"
                              aria-label={`Account ${index + 1} type`}
                            />
                          </div>
                        </div>
                      </div>

                      <OutlinedTextField
                        id={`liquidity-balance-${account.id}`}
                        label="Current Balance"
                        type="text"
                        value={account.currentBalance}
                        onChange={(e) => updateLiquidityAccount(account.id, 'currentBalance', e.target.value)}
                        placeholder="000000"
                      />

                      <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                        <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                        <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                          <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                          <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Upload Bank Statement to autofill
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addLiquidityAccount}
                className="h-[50px] rounded-[8px] relative self-center hover:bg-[rgba(62,45,29,0.06)]"
              >
                <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex gap-[10px] items-center justify-center px-[24px] py-[10px] size-full">
                  <svg className="size-[15.5px] shrink-0" fill="none" viewBox="0 0 15.5 15.5">
                    <path d={svgPaths.p1a0c1c00} fill="#3E2D1D" />
                  </svg>
                  <p className="font-['Montserrat',sans-serif] font-bold leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap">
                    Add Account
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Step 3 - Properties */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-[24px] w-full mb-[36px]">
              {properties.map((property, index) => (
                <div key={property.id} className="bg-white relative rounded-[20px] w-full">
                  <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-start p-[24px] relative w-full">
                    <div className="flex gap-[10px] items-start justify-end w-full mb-[24px]">
                      <p className="flex-1 font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic text-[#764d2f] text-[24px]">
                        Property {index + 1}
                      </p>
                      <button onClick={() => removeProperty(property.id)} className="size-[24px] shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <path d={advancedSvgPaths.p36250880} stroke="#D3B597" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col gap-[36px] w-full">
                      <div className="flex flex-col gap-[24px] w-full">
                        <OutlinedTextField
                          id={`property-name-${property.id}`}
                          label="Property Name"
                          labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                          type="text"
                          value={property.name}
                          onChange={(e) => updateProperty(property.id, 'name', e.target.value)}
                          placeholder="Westlake Commons"
                        />

                        <OutlinedTextField
                          id={`property-address-${property.id}`}
                          label="Property Address"
                          labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                          type="text"
                          value={property.address}
                          onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                          placeholder="123 Oak Ave, Austin, TX"
                        />

                        <div className="flex flex-col gap-[6px] items-start w-full">
                          <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] w-full">
                            Property Type
                          </p>
                          <div className="w-full">
                            <OutlinedSelect
                              value={property.propertyType}
                              onValueChange={(v) => updateProperty(property.id, 'propertyType', v)}
                              options={ONBOARDING_PROPERTY_TYPE_OPTIONS}
                              placeholder="Select property type"
                              aria-label={`Property ${index + 1} type`}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-[24px] items-start w-full">
                          <div className="flex-1 w-full">
                            <OutlinedTextField
                              id={`property-estimated-${property.id}`}
                              label="Estimated Value"
                              labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                              type="text"
                              value={property.estimatedValue}
                              onChange={(e) => updateProperty(property.id, 'estimatedValue', e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div className="flex-1 w-full">
                            <OutlinedTextField
                              id={`property-loan-${property.id}`}
                              label="Loan Balance"
                              labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                              type="text"
                              value={property.loanBalance}
                              onChange={(e) => updateProperty(property.id, 'loanBalance', e.target.value)}
                              placeholder="0"
                            />
                          </div>

                          <div className="flex-1 w-full">
                            <OutlinedTextField
                              id={`property-rent-${property.id}`}
                              label="Monthly Rent"
                              labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                              type="text"
                              value={property.monthlyRent}
                              onChange={(e) => updateProperty(property.id, 'monthlyRent', e.target.value)}
                              placeholder="0"
                            />
                          </div>
                        </div>

                        <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                          <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                          <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                            <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                              <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                            </svg>
                            <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                              Upload Mortage Statement to Rent Roll
                            </p>
                          </div>
                        </button>
                      </div>

                      {/* Advanced Details Toggle */}
                      <button
                        onClick={() => toggleAdvancedDetails(property.id)}
                        className="flex gap-[10px] items-center w-full"
                      >
                        <div className="flex h-[7.5px] items-center justify-center w-[12px]">
                          <div className={`flex-none transition-transform ${property.showAdvanced ? '-rotate-90' : 'rotate-90'}`}>
                            <div className="h-[12px] w-[7.5px]">
                              <svg className="block size-full" fill="none" viewBox="0 0 7.5 12">
                                <path clipRule="evenodd" d={advancedSvgPaths.p1b26ab80} fill="#764D2F" fillRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <p className="font-['Montserrat',sans-serif] font-bold leading-[normal] text-[#764d2f] text-[16px]">
                          {property.showAdvanced ? 'Hide' : 'Show'} Advanced Details
                        </p>
                      </button>

                      {/* Advanced Details Section */}
                      {property.showAdvanced && (
                        <div className="flex flex-col gap-[24px] w-full">
                          <div className="flex flex-col md:flex-row gap-[24px] items-start w-full">
                            <div className="flex-1 w-full md:w-auto">
                              <OutlinedTextField
                                id={`property-rate-${property.id}`}
                                label="Interest Rate"
                                labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                                type="text"
                                value={property.interestRate}
                                onChange={(e) => updateProperty(property.id, 'interestRate', e.target.value)}
                                placeholder="6.5%"
                              />
                            </div>

                            <div className="flex-1 w-full md:w-auto">
                              <OutlinedTextField
                                id={`property-payment-${property.id}`}
                                label="Monthly Payment"
                                labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                                type="text"
                                value={property.monthlyPayment}
                                onChange={(e) => updateProperty(property.id, 'monthlyPayment', e.target.value)}
                                placeholder="0"
                              />
                            </div>
                          </div>

                          <div className="flex flex-col md:flex-row gap-[24px] items-start w-full">
                            <div className="flex-1 w-full md:w-auto">
                              <OutlinedTextField
                                id={`property-lender-${property.id}`}
                                label="Lender"
                                labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                                type="text"
                                value={property.lender}
                                onChange={(e) => updateProperty(property.id, 'lender', e.target.value)}
                                placeholder="First National Bank"
                              />
                            </div>

                            <div className="flex flex-col gap-[6px] items-start flex-1 w-full md:w-auto">
                              <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] w-full">
                                Maturity Date
                              </p>
                              <div className="w-full">
                                <OutlinedDatePicker
                                  value={property.maturityDate}
                                  onChange={(ymd) => updateProperty(property.id, 'maturityDate', ymd)}
                                  placeholder="Select maturity date"
                                  aria-label={`Property ${index + 1} loan maturity date`}
                                />
                              </div>
                            </div>
                          </div>

                          <OutlinedTextField
                            id={`property-ownership-${property.id}`}
                            label="Ownership %"
                            labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                            type="text"
                            value={property.ownershipPercent}
                            onChange={(e) => updateProperty(property.id, 'ownershipPercent', e.target.value)}
                            placeholder="100%"
                            footer={
                              <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                                Your ownership percentage in this property
                              </p>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addProperty}
                className="h-[50px] rounded-[8px] relative self-center hover:bg-[rgba(62,45,29,0.06)]"
              >
                <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex gap-[10px] items-center justify-center px-[24px] py-[10px] size-full">
                  <svg className="size-[15.5px] shrink-0" fill="none" viewBox="0 0 15.5 15.5">
                    <path d={svgPaths.p1a0c1c00} fill="#3E2D1D" />
                  </svg>
                  <p className="font-['Montserrat',sans-serif] font-bold leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap">
                    Add Property
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Step 4 - Businesses & Entities */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-[24px] w-full mb-[36px]">
              {businesses.map((business, index) => (
                <div key={business.id} className="bg-white relative rounded-[20px] w-full">
                  <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-start p-[24px] relative w-full">
                    <div className="flex gap-[10px] items-start justify-end w-full mb-[24px]">
                      <p className="flex-1 font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic text-[#764d2f] text-[24px]">
                        Entity
                      </p>
                      <button onClick={() => removeBusiness(business.id)} className="size-[24px] shrink-0">
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                          <path d={advancedSvgPaths.p36250880} stroke="#D3B597" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex flex-col gap-[24px] w-full">
                      <OutlinedTextField
                        id={`business-name-${business.id}`}
                        label="Entity Name"
                        labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                        type="text"
                        value={business.entityName}
                        onChange={(e) => updateBusiness(business.id, 'entityName', e.target.value)}
                        placeholder="Smith Holding LLC"
                      />

                      <div className="flex flex-col md:flex-row gap-[24px] items-start w-full">
                        <div className="flex-1 w-full md:w-auto">
                          <OutlinedTextField
                            id={`business-ownership-${business.id}`}
                            label="Ownership %"
                            labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                            type="text"
                            value={business.ownershipPercent}
                            onChange={(e) => updateBusiness(business.id, 'ownershipPercent', e.target.value)}
                            placeholder="100"
                          />
                        </div>

                        <div className="flex-1 w-full md:w-auto">
                          <OutlinedTextField
                            id={`business-value-${business.id}`}
                            label="Estimated Value"
                            labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                            type="text"
                            value={business.estimatedValue}
                            onChange={(e) => updateBusiness(business.id, 'estimatedValue', e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                        <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                        <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                          <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                            <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                          </svg>
                          <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            Upload operating agreement to auto-fill
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addBusiness}
                className="h-[50px] rounded-[8px] relative self-center hover:bg-[rgba(62,45,29,0.06)]"
              >
                <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <div className="flex gap-[10px] items-center justify-center px-[24px] py-[10px] size-full">
                  <svg className="size-[15.5px] shrink-0" fill="none" viewBox="0 0 15.5 15.5">
                    <path d={svgPaths.p1a0c1c00} fill="#3E2D1D" />
                  </svg>
                  <p className="font-['Montserrat',sans-serif] font-bold leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap">
                    Add Entity
                  </p>
                </div>
              </button>
            </div>
          )}

          {/* Step 5 - Other Assets */}
          {currentStep === 5 && (
            <div className="bg-white relative rounded-[20px] w-full mb-[36px]">
              <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col items-start p-[24px] relative w-full">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  <OutlinedTextField
                    id="onboarding-other-public"
                    label="Public Investments Total"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={otherAssets.publicInvestments}
                    onChange={(e) => setOtherAssets({ publicInvestments: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Stocks, ETFs, mutual funds, retirement accounts
                      </p>
                    }
                  />

                  <OutlinedTextField
                    id="onboarding-other-private"
                    label="Private Investments"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={otherAssets.privateInvestments}
                    onChange={(e) => setOtherAssets({ privateInvestments: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Private equity, venture, angel investments
                      </p>
                    }
                  />

                  <OutlinedTextField
                    id="onboarding-other-misc"
                    label="Other Assets"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={otherAssets.otherAssets}
                    onChange={(e) => setOtherAssets({ otherAssets: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Vehicles, art, collectibles, jewelry, etc.
                      </p>
                    }
                  />

                  <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                    <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                    <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                      <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                      <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Upload brokerage statement to auto-fill
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 6 - Liabilities */}
          {currentStep === 6 && (
            <div className="bg-white relative rounded-[20px] w-full mb-[36px]">
              <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col items-start p-[24px] relative w-full">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  <OutlinedTextField
                    id="onboarding-liability-cards"
                    label="Credit Cards Total"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={liabilities.creditCards}
                    onChange={(e) => setLiabilities({ creditCards: e.target.value })}
                    placeholder="0"
                  />

                  <OutlinedTextField
                    id="onboarding-liability-loans"
                    label="Personal Loans"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={liabilities.personalLoans}
                    onChange={(e) => setLiabilities({ personalLoans: e.target.value })}
                    placeholder="0"
                  />

                  <OutlinedTextField
                    id="onboarding-liability-other"
                    label="Other Debt"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={liabilities.otherDebt}
                    onChange={(e) => setLiabilities({ otherDebt: e.target.value })}
                    placeholder="0"
                  />

                  <OutlinedTextField
                    id="onboarding-liability-linked"
                    label="Link Other Debt to Asset"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={liabilities.linkedDebt}
                    onChange={(e) => setLiabilities({ linkedDebt: e.target.value })}
                    placeholder="None"
                  />

                  <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                    <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                    <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                      <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                      <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Upload statements to auto-fill
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 7 - Income */}
          {currentStep === 7 && (
            <div className="bg-white relative rounded-[20px] w-full mb-[36px]">
              <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col items-start p-[24px] relative w-full">
                <div className="flex flex-col gap-[24px] items-start w-full">
                  <OutlinedTextField
                    id="onboarding-income-primary"
                    label="Primary Income"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={income.primaryIncome}
                    onChange={(e) => setIncome({ primaryIncome: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        W-2 salary or primary business income
                      </p>
                    }
                  />

                  <OutlinedTextField
                    id="onboarding-income-rental"
                    label="Rental Income"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={income.rentalIncome}
                    onChange={(e) => setIncome({ rentalIncome: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Gross annual rental receipts
                      </p>
                    }
                  />

                  <OutlinedTextField
                    id="onboarding-income-other"
                    label="Other Income"
                    labelClassName={ONBOARDING_FIGTREE_LABEL_CLASS}
                    type="text"
                    value={income.otherIncome}
                    onChange={(e) => setIncome({ otherIncome: e.target.value })}
                    placeholder="0"
                    footer={
                      <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#8c8780] text-[12px] w-full">
                        Dividends, capital gains, royalties, etc.
                      </p>
                    }
                  />

                  <button className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full hover:bg-[#faf7f0] transition-colors">
                    <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                    <div className="flex items-center justify-start px-[24px] py-[10px] size-full gap-[10px]">
                      <svg className="size-[24px] shrink-0" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p27c29e0} stroke="#3E2D1D" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                      <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Upload tax return to auto-fill
                      </p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 8 - Disclosures (disabled for now per request) */}
          {currentStep === 99 && (
            <div className="bg-white relative rounded-[20px] w-full mb-[36px]">
              <div className="border border-[#d0d0d0] border-solid absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col items-start p-[24px] relative w-full gap-[24px]">
                {/* Question 1 - with expandable details */}
                <div className="flex flex-col gap-[12px] w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                    <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                      Are you a guarantor, co-maker, or endorser on any debt not listed above?
                    </p>
                    <div className="flex gap-[12px] shrink-0">
                      <button
                        onClick={() => setDisclosures({guarantor: true })}
                        className={`h-[40px] px-[24px] rounded-[8px] transition-colors ${
                          disclosures.guarantor === true
                            ? 'bg-[#6f4c30]'
                            : 'bg-white'
                        }`}
                      >
                        <div className={`absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] ${disclosures.guarantor === true ? 'hidden' : ''}`} />
                        <p className={`font-['Figtree',sans-serif] font-medium text-[14px] whitespace-nowrap ${
                          disclosures.guarantor === true ? 'text-white' : 'text-[#764d2f]'
                        }`}>
                          Yes
                        </p>
                      </button>
                      <button
                        onClick={() => setDisclosures({guarantor: false })}
                        className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                          disclosures.guarantor === false
                            ? 'bg-white'
                            : 'bg-white'
                        }`}
                      >
                        <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                        <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                          No
                        </p>
                      </button>
                    </div>
                  </div>
                  {disclosures.guarantor === true && (
                    <div className="bg-white relative rounded-[8px] w-full">
                      <textarea
                        value={disclosures.guarantorDetails}
                        onChange={(e) => setDisclosures({guarantorDetails: e.target.value })}
                        placeholder="Provide Details"
                        className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#1a1a1a] text-[14px] bg-transparent w-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676] min-h-[80px] resize-none"
                      />
                      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                  )}
                </div>

                {/* Question 2 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Are there any pending legal actions, judgments, or liens against you?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({legalActions: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.legalActions === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({legalActions: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.legalActions === false
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        No
                      </p>
                    </button>
                  </div>
                </div>

                {/* Question 3 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Have you ever filed for bankruptcy?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({bankruptcy: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.bankruptcy === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({bankruptcy: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors ${
                        disclosures.bankruptcy === false
                          ? 'bg-[#6f4c30]'
                          : 'bg-white'
                      }`}
                    >
                      <div className={`absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] ${disclosures.bankruptcy === false ? 'hidden' : ''}`} />
                      <p className={`font-['Figtree',sans-serif] font-medium text-[14px] whitespace-nowrap ${
                        disclosures.bankruptcy === false ? 'text-white' : 'text-[#764d2f]'
                      }`}>
                        No
                      </p>
                    </button>
                  </div>
                </div>

                {/* Question 4 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Are you obligated to pay alimony, child support, or separate maintenance?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({alimony: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.alimony === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({alimony: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.alimony === false
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        No
                      </p>
                    </button>
                  </div>
                </div>

                {/* Question 5 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Have you pledged any of the above assets as collateral for any debt not listed?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({pledgedAssets: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.pledgedAssets === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({pledgedAssets: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors ${
                        disclosures.pledgedAssets === false
                          ? 'bg-[#6f4c30]'
                          : 'bg-white'
                      }`}
                    >
                      <div className={`absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] ${disclosures.pledgedAssets === false ? 'hidden' : ''}`} />
                      <p className={`font-['Figtree',sans-serif] font-medium text-[14px] whitespace-nowrap ${
                        disclosures.pledgedAssets === false ? 'text-white' : 'text-[#764d2f]'
                      }`}>
                        No
                      </p>
                    </button>
                  </div>
                </div>

                {/* Question 6 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Have you ever had property foreclosed upon or given title or deed in lieu thereof?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({foreclosure: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.foreclosure === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({foreclosure: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors ${
                        disclosures.foreclosure === false
                          ? 'bg-[#6f4c30]'
                          : 'bg-white'
                      }`}
                    >
                      <div className={`absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] ${disclosures.foreclosure === false ? 'hidden' : ''}`} />
                      <p className={`font-['Figtree',sans-serif] font-medium text-[14px] whitespace-nowrap ${
                        disclosures.foreclosure === false ? 'text-white' : 'text-[#764d2f]'
                      }`}>
                        No
                      </p>
                    </button>
                  </div>
                </div>

                {/* Question 7 */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-[12px] w-full">
                  <p className="font-['Figtree',sans-serif] font-normal leading-[normal] text-[#333] text-[14px] flex-1">
                    Are you a party to any claims or lawsuits?
                  </p>
                  <div className="flex gap-[12px] shrink-0">
                    <button
                      onClick={() => setDisclosures({lawsuits: true })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors relative ${
                        disclosures.lawsuits === true
                          ? 'bg-white'
                          : 'bg-white'
                      }`}
                    >
                      <div className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <p className="font-['Figtree',sans-serif] font-medium text-[14px] text-[#764d2f] whitespace-nowrap">
                        Yes
                      </p>
                    </button>
                    <button
                      onClick={() => setDisclosures({lawsuits: false })}
                      className={`h-[40px] px-[24px] rounded-[8px] transition-colors ${
                        disclosures.lawsuits === false
                          ? 'bg-[#6f4c30]'
                          : 'bg-white'
                      }`}
                    >
                      <div className={`absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] ${disclosures.lawsuits === false ? 'hidden' : ''}`} />
                      <p className={`font-['Figtree',sans-serif] font-medium text-[14px] whitespace-nowrap ${
                        disclosures.lawsuits === false ? 'text-white' : 'text-[#764d2f]'
                      }`}>
                        No
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 8 - Financial Snapshot / Summary */}
          {currentStep === 8 && (
            <div className="flex flex-col gap-[24px] w-full mb-[36px]">
              {/* Net Worth Banner - Stacked Cards */}
              <div className="relative w-full" style={{ minHeight: '191px' }}>
                {/* Back layer - lightest */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#eedccf] h-[155px] rounded-[16px] top-[36px] w-[90%] hidden md:block" />
                {/* Middle layer */}
                <div className="absolute left-1/2 -translate-x-1/2 bg-[#ceab92] h-[155px] rounded-[16px] top-[18px] w-[95%] hidden md:block" />
                {/* Front layer - darkest */}
                <div className="bg-[#764d2f] h-[191px] relative rounded-[16px] w-full">
                  <div className="flex flex-col items-center justify-center size-full p-[28px] text-center text-white">
                    <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[16px] mb-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Estimated Net Worth
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-bold leading-[50px] text-[64px] max-w-full truncate px-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.netWorth)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Stat Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
                <div className="bg-white relative rounded-[16px]">
                  <div className="border border-[#eaeaea] absolute inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-center justify-center p-[28px] text-center">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Total Assets
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#764d2f] text-[36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.totalAssets)}
                    </p>
                  </div>
                </div>

                <div className="bg-white relative rounded-[16px]">
                  <div className="border border-[#eaeaea] absolute inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-center justify-center p-[28px] text-center">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Total Liabilities
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#764d2f] text-[36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.totalLiabilities)}
                    </p>
                  </div>
                </div>

                <div className="bg-white relative rounded-[16px]">
                  <div className="border border-[#eaeaea] absolute inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-center justify-center p-[28px] text-center">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Annual Income
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#764d2f] text-[36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.annualIncome)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Asset Breakdown Card */}
              <div className="bg-white relative rounded-[20px] w-full">
                <div className="border border-[#d0d0d0] absolute inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                <div className="flex flex-col items-start p-[24px] relative w-full gap-[24px]">
                  <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic text-[#764d2f] text-[24px]">
                    Asset Breakdown
                  </p>

                  <div className="flex items-center justify-between py-[20px] w-full border-b border-[#fcf6f0]">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] md:text-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Liquid Assets
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#764d2f] text-[18px] md:text-[22px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.liquidAssets)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-[20px] w-full border-b border-[#fcf6f0]">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] md:text-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Real Estate
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#764d2f] text-[18px] md:text-[22px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.realEstateValue)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-[20px] w-full border-b border-[#fcf6f0]">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] md:text-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Businesses & Entities
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#764d2f] text-[18px] md:text-[22px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.businessValue)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between py-[20px] w-full">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] md:text-[18px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Other Assets
                    </p>
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#764d2f] text-[18px] md:text-[22px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {formatUsdCompact(summary.otherAssetsTotal)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-[12px] w-full">
                {activateError ? (
                  <p role="alert" className="font-['Figtree',sans-serif] text-[14px] text-[#b42318] w-full bg-[#fef3f2] border border-[#fecdca] rounded-[10px] px-[14px] py-[10px]">
                    {activateError}
                  </p>
                ) : null}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-[16px] sm:gap-[24px] w-full">
                  <button
                    type="button"
                    disabled={onboardMutation.isPending}
                    onClick={() => {
                      setActivateError('');
                      setDirection(-1);
                      setCurrentStep(1);
                    }}
                    className="h-[50px] px-[48px] rounded-[8px] border-[#3e2d1d] border-[1.5px] bg-white relative hover:bg-[rgba(62,45,29,0.06)] disabled:opacity-50"
                  >
                    <div className="absolute border border-[#3e2d1d] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    <p className="font-['SF_Pro',sans-serif] font-[590] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      Edit Profile
                    </p>
                  </button>
                  <button
                    type="button"
                    disabled={onboardMutation.isPending}
                    onClick={handleActivate}
                    className="bg-[#764d2f] h-[50px] px-[48px] rounded-[8px] hover:bg-[#8c5d3a] transition-colors flex items-center justify-center gap-[10px] disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {onboardMutation.isPending ? (
                      <p className="font-['SF_Pro',sans-serif] font-[590] text-white text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                        Activating…
                      </p>
                    ) : (
                      <>
                        <svg className="size-[16px] shrink-0" fill="none" viewBox="0 0 15.5 10.6426">
                          <path d={summarySvgPaths.p3981cc70} fill="white" />
                        </svg>
                        <p className="font-['SF_Pro',sans-serif] font-[590] text-white text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          Activate Profile
                        </p>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Hide on final step */}
          {currentStep !== 8 && (
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-[16px] sm:gap-[24px] w-full">
              <button
                onClick={handleBack}
                className="flex gap-[10px] h-[50px] items-center justify-center px-[32px] md:px-[48px] py-[10px] relative rounded-[8px] border-[#3e2d1d] border-[1.5px] border-solid bg-transparent hover:bg-[rgba(62,45,29,0.06)] group"
              >
                <div className="flex h-[9.537px] items-center justify-center w-[12.999px]">
                  <div className="-rotate-90 flex-none">
                    <div className="h-[12.999px] w-[9.537px]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
                        <path d={checkSvgPaths.pec28900} fill="#3E2D1D" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p
                  className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[14px] md:text-[16px] whitespace-nowrap"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Back
                </p>
              </button>

              <div className="flex items-center gap-[16px] sm:gap-[24px]">
                <button
                  onClick={handleSkip}
                  className="flex h-[50px] items-center justify-center px-[32px] md:px-[48px] py-[10px] rounded-[8px] border-[#3e2d1d] border-[1.5px] border-solid bg-transparent hover:bg-[rgba(62,45,29,0.06)] flex-1 sm:flex-initial"
                >
                  <p
                    className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[#3e2d1d] text-[14px] md:text-[16px] whitespace-nowrap"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Skip
                  </p>
                </button>

                <button
                  onClick={handleNext}
                  className="bg-[#764d2f] flex gap-[10px] h-[50px] items-center justify-center px-[32px] md:px-[48px] py-[10px] rounded-[8px] hover:bg-[#8c5d3a] transition-colors flex-1 sm:flex-initial"
                >
                  <p
                    className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-white text-[14px] md:text-[16px] whitespace-nowrap"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Next
                  </p>
                  <div className="flex h-[9.537px] items-center justify-center w-[12.999px]">
                    <div className="flex-none rotate-90">
                      <div className="h-[12.999px] w-[9.537px]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
                          <path d={checkSvgPaths.pec28900} fill="white" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
