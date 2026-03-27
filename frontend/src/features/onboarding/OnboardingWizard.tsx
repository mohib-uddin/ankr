import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { FormData, StepId } from '@/app/types';
import { MANUAL_STEPS, UPLOAD_STEPS, STEP_LABELS, createEmptyFormData } from '@/app/types';
import { WelcomeStep } from './WelcomeStep';
import { BasicInfoStep } from './BasicInfoStep';
import { LiquidityStep } from './LiquidityStep';
import { RealEstateStep } from './RealEstateStep';
import { BusinessEntitiesStep } from './BusinessEntitiesStep';
import { OtherAssetsStep } from './OtherAssetsStep';
import { LiabilitiesStep } from './LiabilitiesStep';
import { IncomeStep } from './IncomeStep';
import { YesNoStep } from './YesNoStep';
import { SnapshotStep } from './SnapshotStep';
import { UploadReviewStep } from './UploadReviewStep';
import { ActivatedScreen } from './ActivatedScreen';

export function OnboardingWizard() {
  const [currentStep, setCurrentStep] = useState<StepId>('welcome');
  const [path, setPath] = useState<'manual' | 'upload' | null>(null);
  const [formData, setFormData] = useState<FormData>(createEmptyFormData());
  const [activated, setActivated] = useState(false);
  const [direction, setDirection] = useState(1);

  const steps = useMemo(() => {
    if (path === 'upload') return UPLOAD_STEPS;
    if (path === 'manual') return MANUAL_STEPS;
    return [];
  }, [path]);

  const currentIndex = steps.indexOf(currentStep);
  const progressPercent = useMemo(() => {
    if (currentStep === 'welcome') return 0;
    if (steps.length === 0) return 0;
    return Math.round(((currentIndex + 1) / steps.length) * 100);
  }, [currentStep, currentIndex, steps]);

  const handleChange = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const goNext = () => {
    const nextIdx = currentIndex + 1;
    if (nextIdx < steps.length) {
      setDirection(1);
      setCurrentStep(steps[nextIdx]);
    }
  };

  const goBack = () => {
    if (currentIndex === 0) {
      setDirection(-1);
      setPath(null);
      setCurrentStep('welcome');
      return;
    }
    const prevIdx = currentIndex - 1;
    if (prevIdx >= 0) {
      setDirection(-1);
      setCurrentStep(steps[prevIdx]);
    }
  };

  const selectPath = (p: 'upload' | 'manual') => {
    setPath(p);
    setDirection(1);
    if (p === 'upload') {
      setCurrentStep('upload-review');
    } else {
      setCurrentStep('basic-info');
    }
  };

  if (activated) {
    return (
      <div className="min-h-screen bg-[#F8F6F1]">
        <Header />
        <ActivatedScreen />
      </div>
    );
  }

  const yesNoStepNumber = path === 'upload' ? 2 : 8;

  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      <Header />

      {currentStep !== 'welcome' && (
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          currentIndex={currentIndex}
          percent={progressPercent}
        />
      )}

      <div className={`max-w-[660px] mx-auto px-6 ${currentStep === 'welcome' ? '' : 'py-10'}`}>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -24 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {currentStep === 'welcome' && <WelcomeStep onSelectPath={selectPath} />}
            {currentStep === 'upload-review' && (
              <UploadReviewStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'basic-info' && (
              <BasicInfoStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'liquidity' && (
              <LiquidityStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'real-estate' && (
              <RealEstateStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'businesses' && (
              <BusinessEntitiesStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'other-assets' && (
              <OtherAssetsStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'liabilities' && (
              <LiabilitiesStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'income' && (
              <IncomeStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} />
            )}
            {currentStep === 'yes-no' && (
              <YesNoStep data={formData} onChange={handleChange} onNext={goNext} onBack={goBack} stepNumber={yesNoStepNumber} />
            )}
            {currentStep === 'snapshot' && (
              <SnapshotStep data={formData} onBack={goBack} onActivate={() => setActivated(true)} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="h-16 border-b border-[#E6E2DB] bg-white/60 backdrop-blur-sm flex items-center px-6">
      <div className="max-w-[660px] mx-auto w-full flex items-center">
        <span className="text-[16px] tracking-[-0.02em] text-[#1A1A1A]">PFS</span>
        <span className="mx-2 text-[#D2CEC7]">/</span>
        <span className="text-[14px] text-[#8C8780]">Onboarding</span>
      </div>
    </div>
  );
}

function ProgressBar({ steps, currentStep, currentIndex, percent }: {
  steps: StepId[];
  currentStep: StepId;
  currentIndex: number;
  percent: number;
}) {
  return (
    <div className="border-b border-[#E6E2DB] bg-white/40 backdrop-blur-sm">
      {/* Thin progress line */}
      <div className="h-0.5 bg-[#EDEBE6]">
        <motion.div
          className="h-full bg-[#22C55E]"
          initial={false}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Step labels */}
      <div className="max-w-[660px] mx-auto px-6">
        <div className="flex items-center gap-1 py-3 overflow-x-auto scrollbar-hide">
          {steps.map((step, idx) => {
            const isActive = step === currentStep;
            const isComplete = idx < currentIndex;
            return (
              <div key={step} className="flex items-center shrink-0">
                {idx > 0 && <span className="mx-1.5 text-[#D2CEC7] text-[10px]">/</span>}
                <span
                  className={`text-[12px] tracking-wide transition-colors duration-200 ${
                    isActive
                      ? 'text-[#1A1A1A]'
                      : isComplete
                      ? 'text-[#22C55E]'
                      : 'text-[#C5C0B9]'
                  }`}
                >
                  {STEP_LABELS[step]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}