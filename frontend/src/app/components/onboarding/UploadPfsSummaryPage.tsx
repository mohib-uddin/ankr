import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import checkSvgPaths from '@/icons/onboarding-check';

type Step = {
  id: number;
  label: string;
  state: 'inactive' | 'active' | 'complete';
};

const STEPS: Step[] = [
  { id: 1, label: 'Upload\nPFS', state: 'complete' },
  { id: 2, label: 'Review\nPFS', state: 'complete' },
  { id: 3, label: 'Summary', state: 'active' },
];

export function UploadPfsSummaryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activated, setActivated] = useState(false);
  const prefillData = (location.state as { prefillData?: unknown } | null)?.prefillData;

  if (activated) {
    return (
      <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto">
        <div className="relative min-h-screen w-full flex items-center justify-center p-[24px]">
          <div className="flex flex-col gap-[24px] items-center w-full max-w-[442px]">
            <div className="relative shrink-0 size-[233px]">
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full size-[233px] top-0 border-2 border-[#c4b29a]" />
              <div className="absolute left-1/2 -translate-x-1/2 rounded-full size-[183px] top-[25px] border-2 border-[#c4b29a]" />
              <div className="absolute left-1/2 -translate-x-1/2 size-[139px] top-[47px]">
                <div className="bg-[#764d2f] rounded-full size-full relative">
                  <svg className="absolute inset-0 m-auto size-full" fill="none" viewBox="0 0 139 139">
                    <path d={checkSvgPaths.p17b85580} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[24px] items-center text-center w-full">
              <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic text-[#764d2f] text-[36px] md:text-[48px] w-full">
                Profile Activated
              </p>
              <p className="font-['Montserrat',sans-serif] font-medium leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full">
                Your financial profile is live and ready to use across every deal on the platform.
              </p>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="bg-[#764d2f] flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] hover:bg-[#8c5d3a] hover:shadow-md active:scale-[0.99] transition-all"
            >
              <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-white text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Go to Dashboard
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative min-h-screen w-full px-[24px] py-[40px] lg:px-[40px] xl:px-0">
        <Stepper />

        <div className="w-full max-w-[1305px] mx-auto">
          <div className="flex flex-col gap-[8px] items-start leading-[normal] w-full mb-[32px]">
            <p className="font-['Canela_Text_Trial',sans-serif] font-medium not-italic text-[#764d2f] text-[28px] md:text-[36px] w-full">
              Financial Snapshot
            </p>
            <p className="font-['Montserrat',sans-serif] font-medium text-[#8c8780] text-[14px] md:text-[16px] w-full">
              Review your profile before activation.
            </p>
          </div>

          <div className="flex flex-col gap-[24px] w-full mb-[36px]">
            <div className="relative w-full" style={{ minHeight: '191px' }}>
              <div className="absolute left-1/2 -translate-x-1/2 bg-[#eedccf] h-[155px] rounded-[16px] top-[36px] w-[90%] hidden md:block" />
              <div className="absolute left-1/2 -translate-x-1/2 bg-[#ceab92] h-[155px] rounded-[16px] top-[18px] w-[95%] hidden md:block" />
              <div className="bg-[#764d2f] h-[191px] relative rounded-[16px] w-full">
                <div className="flex flex-col items-center justify-center size-full p-[28px] text-center text-white">
                  <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[16px] mb-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Estimated Net Worth
                  </p>
                  <p className="font-['SF_Pro',sans-serif] font-bold leading-[50px] text-[64px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    $10M
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-[24px] w-full">
              <StatCard label="Total Assets" value="$10.8M" />
              <StatCard label="Total Liabilities" value="$800k" />
              <StatCard label="Annual Income" value="$1M" />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-[16px] sm:gap-[24px] w-full">
            <button
              onClick={() => navigate('/onboarding/upload')}
              className="h-[50px] px-[48px] rounded-[8px] border-[#3e2d1d] border-[1.5px] bg-white relative hover:bg-[rgba(62,45,29,0.06)] active:scale-[0.99]"
            >
              <p className="font-['SF_Pro',sans-serif] font-[590] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                Back
              </p>
            </button>

            <div className="flex items-center gap-[16px] sm:gap-[24px]">
              <button
                onClick={() => navigate('/onboarding', { state: { startStep: 1, prefillData } })}
                className="h-[50px] px-[48px] rounded-[8px] border-[#3e2d1d] border-[1.5px] bg-white relative hover:bg-[rgba(62,45,29,0.06)] active:scale-[0.99]"
              >
                <p className="font-['SF_Pro',sans-serif] font-[590] text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Edit Profile
                </p>
              </button>

              <button
                onClick={() => setActivated(true)}
                className="bg-[#764d2f] h-[50px] px-[48px] rounded-[8px] hover:bg-[#8c5d3a] hover:shadow-md active:scale-[0.99] transition-colors flex items-center justify-center gap-[10px]"
              >
                <p className="font-['SF_Pro',sans-serif] font-[590] text-white text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Activate Profile
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper() {
  return (
    <div className="mx-auto w-full max-w-[1305px] mb-[40px] md:mb-[48px]">
      <div className="flex w-full items-start">
        {STEPS.map((step, idx) => {
          const isActive = step.state === 'active';
          const isComplete = step.state === 'complete';

          return (
            <div key={step.id} className="flex min-w-0 flex-1 items-start">
              <div className="flex w-[96px] shrink-0 flex-col items-center gap-[8px]">
                <div
                  className={`flex size-[44px] items-center justify-center rounded-full border-2 ${
                    isComplete ? 'border-[#764d2f] bg-[#764d2f]' : isActive ? 'border-[#764d2f] bg-[#fafafa]' : 'border-[#d3b597] bg-[#fafafa]'
                  }`}
                >
                  <span
                    className={`font-['DM_Sans',sans-serif] text-[16px] font-bold leading-normal ${
                      isComplete ? 'text-white' : isActive ? 'text-[#764d2f]' : 'text-[#d3b597]'
                    }`}
                    style={{ fontVariationSettings: "'opsz' 14" }}
                  >
                    {step.id}
                  </span>
                </div>
                <p
                  className={`whitespace-pre-wrap text-center font-['Montserrat',sans-serif] text-[14px] font-medium leading-normal ${
                    isActive || isComplete ? 'text-[#764d2f]' : 'text-[#d3b597]'
                  }`}
                >
                  {step.label}
                </p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="flex-1 pb-[15px] pt-[20px]">
                  <div className={`h-[2px] w-full ${isComplete ? 'bg-[#764d2f]' : 'bg-[#d3b597]'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white relative rounded-[16px]">
      <div className="border border-[#eaeaea] absolute inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="flex flex-col items-center justify-center p-[28px] text-center">
        <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764d2f] text-[16px] mb-[8px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {label}
        </p>
        <p className="font-['SF_Pro',sans-serif] font-bold text-[#764d2f] text-[36px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {value}
        </p>
      </div>
    </div>
  );
}
