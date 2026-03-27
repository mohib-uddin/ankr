import React, { useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router';

type Step = {
  id: number;
  label: string;
  state: 'inactive' | 'active' | 'complete';
};

type UploadPhase = 'upload' | 'processing' | 'review';

const processingFileIcon = 'https://www.figma.com/api/mcp/asset/ae165b82-74f7-4a1b-85f2-48b91cfc117c';
const reviewCheckIcon = 'https://www.figma.com/api/mcp/asset/11413330-ae13-4893-ae06-b5f15cc0c66d';

const extractedData = {
  fullName: 'John A. Smith',
  primaryAddress: '1234 Oak Street, Austin, TX 78701',
  email: 'john.smith@email.com',
  phone: '(512) 555-0147',
  ssn: '***-**-1234',
  accounts: [
    { institution: 'Chase', accountType: 'Checking Account', currentBalance: '245,000' },
    { institution: 'Schwab', accountType: 'Brokerage', currentBalance: '1,850,000' },
  ],
  properties: [
    {
      address: '456 Main Blvd, Austin, TX 78704',
      propertyType: 'Multi Family',
      estimatedValue: '2,400,000',
      loanBalance: '1,600,000',
      monthlyRent: '18,500',
      showAdvanced: false,
      interestRate: '5.75%',
      monthlyPayment: '9,340',
      lender: 'Wells Fargo',
      maturityDate: '03/2029',
      ownershipPercent: '100%',
    },
  ],
  entities: [{ entityName: 'Smith Capital Holdings LLC', ownershipPercent: '100%', estimatedValue: '3,200,000' }],
  publicInvestments: '750,000',
  privateInvestments: '400,000',
  otherAssets: '125,000',
  creditCards: '12,000',
  personalLoans: '85,000',
  otherDebt: '0',
  linkedDebt: 'None',
  primaryIncome: '380,000',
  rentalIncome: '222,000',
  otherIncome: '48,000',
};

export function UploadPfsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [phase, setPhase] = useState<UploadPhase>('upload');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file.name);
    setProgress(0);
    setPhase('processing');
  };

  useEffect(() => {
    if (phase !== 'processing') return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          window.clearInterval(timer);
          return 100;
        }
        return prev + 4;
      });
    }, 110);

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'processing' || progress < 100) return;
    const completeTimer = window.setTimeout(() => setPhase('review'), 400);
    return () => window.clearTimeout(completeTimer);
  }, [phase, progress]);

  const onDragOver = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    handleFile(file);
  };

  const steps: Step[] =
    phase === 'review'
      ? [
          { id: 1, label: 'Upload\nPFS', state: 'complete' },
          { id: 2, label: 'Review\nPFS', state: 'active' },
          { id: 3, label: 'Summary', state: 'inactive' },
        ]
      : [
          { id: 1, label: 'Upload\nPFS', state: 'active' },
          { id: 2, label: 'Review\nPFS', state: 'inactive' },
          { id: 3, label: 'Summary', state: 'inactive' },
        ];

  return (
    <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto">
      <div className="mx-auto min-h-screen w-full max-w-[1430px] px-[20px] pb-[40px] pt-[44px] md:px-[40px] md:pb-[56px] md:pt-[56px] xl:px-[60px]">
        <Stepper steps={steps} />

        <div className="mx-auto mt-[42px] flex w-full max-w-[1305px] flex-col gap-[36px]">
          <section className="flex w-full flex-col gap-[32px]">
            <div className="flex w-full max-w-[417px] flex-col gap-[8px]">
              <h1
                className="text-[32px] font-medium leading-[1] text-[#764d2f] md:text-[36px]"
                style={{ fontFamily: "'Canela Text Trial', sans-serif" }}
              >
                {phase === 'review' ? 'Review Your PFS' : 'Upload Your PFS'}
              </h1>
              <p className="font-['Montserrat',sans-serif] text-[14px] font-medium leading-normal text-[#8c8780] md:text-[16px]">
                {phase === 'review' ? 'Review extracted financial data' : 'Upload a PDF and we&apos;ll extract your financial data.'}
              </p>
            </div>

            <input
              id="pfs-file-input"
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
            />

            {phase === 'upload' ? (
              <label
                htmlFor="pfs-file-input"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative flex h-[380px] cursor-pointer items-center justify-center rounded-[24px] border-[1.5px] border-dashed px-[24px] py-[16px] text-center shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] transition-colors md:h-[464px] md:px-[48px] ${
                  isDragging ? 'border-[#764d2f] bg-[#fff8f0]' : 'border-[#764d2f] bg-[#fffdf8]'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-[16px]">
                  <div className="flex size-[36px] items-center justify-center rounded-[6px] bg-[#f3efe6] md:size-[54px]">
                    <svg
                      className="h-[19px] w-[19px] md:h-[26px] md:w-[26px]"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15V6M12 6L8.5 9.5M12 6L15.5 9.5M5 17.5V18.5C5 19.6046 5.89543 20.5 7 20.5H17C18.1046 20.5 19 19.6046 19 18.5V17.5"
                        stroke="#9A7348"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p
                    className="text-[16px] font-medium leading-normal text-[#764d2f] md:text-[18px]"
                    style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                  >
                    Drop your PFS here or click to browse
                  </p>

                  <p
                    className="text-[13px] font-medium leading-normal text-[#d3b597] md:text-[14px]"
                    style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                  >
                    PDF format, upto 25 MB
                  </p>
                </div>
              </label>
            ) : phase === 'processing' ? (
              <div className="w-full rounded-[16px] border border-[#eaeaea] bg-white p-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] md:p-[28px]">
                <div className="flex max-w-full items-center gap-[16px]">
                  <div className="h-[40.222px] w-[35.722px] shrink-0">
                    <img src={processingFileIcon} alt="" className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate text-[16px] font-medium leading-normal text-[#764d2f]"
                      style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                    >
                      {selectedFile ?? 'YourPFS.pdf'}
                    </p>
                    <p
                      className="text-[14px] font-medium leading-normal text-[#8c8780]"
                      style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                    >
                      Extracting Data
                    </p>
                  </div>
                </div>
                <div className="mt-[16px] h-[8px] w-full rounded-[100px] bg-[#fcf6f0]">
                  <div
                    className="h-full rounded-[100px] bg-[#764d2f] transition-[width] duration-150"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-[24px]">
                <div className="w-full rounded-[16px] border border-[#eaeaea] bg-white p-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] md:p-[28px]">
                  <div className="flex items-center gap-[12px]">
                    <img src={reviewCheckIcon} alt="" className="size-[30px] shrink-0" />
                    <p
                      className="text-[16px] font-medium leading-normal text-[#764d2f]"
                      style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                    >
                      Data extracted from {selectedFile ?? 'YourPFS.pdf'}
                    </p>
                  </div>
                </div>

                <div className="w-full rounded-[20px] border border-[#d0d0d0] bg-white p-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] md:p-[24px]">
                  <ReviewRow label="Accounts Found" value="2 accounts" />
                  <ReviewRow label="Properties Found" value="1 properties" />
                  <ReviewRow label="Entities Found" value="1 entities" />
                  <ReviewRow label="Income Sources" value="2 sources identified" isLast />
                </div>
              </div>
            )}
          </section>

          <div className="flex w-full flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => {
                if (phase === 'review') {
                  setPhase('upload');
                  setSelectedFile(null);
                  setProgress(0);
                  return;
                }
                navigate('/profile-setup');
              }}
              className="h-[50px] rounded-[8px] border-[1.5px] border-[#3e2d1d] px-[28px] transition-all duration-200 hover:bg-[rgba(62,45,29,0.06)] active:scale-[0.99] sm:px-[48px]"
            >
              <span
                className="flex items-center justify-center gap-[10px] text-[16px] font-semibold leading-normal text-[#3e2d1d]"
                style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
              >
                <span aria-hidden="true">←</span>
                Back
              </span>
            </button>

            <div className="flex w-full gap-[12px] sm:w-auto sm:gap-[24px]">
              <button
                type="button"
                onClick={() =>
                  phase === 'review'
                    ? navigate('/onboarding', { state: { startStep: 1, prefillData: extractedData } })
                    : undefined
                }
                className="h-[50px] flex-1 rounded-[8px] border-[1.5px] border-[#3e2d1d] px-[20px] text-[16px] font-semibold leading-normal text-[#3e2d1d] transition-all duration-200 hover:bg-[rgba(62,45,29,0.06)] active:scale-[0.99] sm:flex-none sm:px-[48px]"
                style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
              >
                {phase === 'review' ? 'Edit Profile' : 'Skip'}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (phase === 'upload') {
                    fileInputRef.current?.click();
                    return;
                  }
                  if (phase === 'processing') {
                    return;
                  }
                  if (phase === 'review') {
                    navigate('/onboarding/upload-summary', { state: { prefillData: extractedData } });
                  }
                }}
                className="h-[50px] flex-1 rounded-[8px] bg-[#764d2f] px-[20px] text-[16px] font-semibold leading-normal text-white transition-all duration-200 hover:bg-[#8c5d3a] hover:shadow-md active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none sm:px-[48px]"
                style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
                disabled={phase === 'processing'}
              >
                <span className="flex items-center justify-center gap-[10px]">
                  Next
                  <span aria-hidden="true">→</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stepper({ steps }: { steps: Step[] }) {
  return (
    <div className="mx-auto w-full max-w-[1305px] pb-[8px]">
      <div className="flex w-full items-start">
        {steps.map((step, idx) => {
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

              {idx < steps.length - 1 && (
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

function ReviewRow({ label, value, isLast = false }: { label: string; value: string; isLast?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-[20px] ${isLast ? '' : 'border-b border-[#fcf6f0]'}`}>
      <p
        className="text-[16px] font-medium leading-normal text-[#764d2f] md:text-[18px]"
        style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
      >
        {label}
      </p>
      <p
        className="text-[16px] font-bold leading-normal text-[#764d2f] md:text-[18px]"
        style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
      >
        {value}
      </p>
    </div>
  );
}
