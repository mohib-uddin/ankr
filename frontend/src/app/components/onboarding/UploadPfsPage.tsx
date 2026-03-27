import { useEffect, useRef, useState, type DragEvent } from 'react';
import { useNavigate } from 'react-router';

type Step = {
  id: number;
  label: string;
  active?: boolean;
};

const STEPS: Step[] = [
  { id: 1, label: 'Upload\nPFS', active: true },
  { id: 2, label: 'Review\nPFS' },
  { id: 3, label: 'Summary' },
];

const processingFileIcon = 'https://www.figma.com/api/mcp/asset/ae165b82-74f7-4a1b-85f2-48b91cfc117c';

export function UploadPfsPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFile = (file: File | null) => {
    if (!file) return;
    setSelectedFile(file.name);
    setProgress(0);
  };

  useEffect(() => {
    if (!selectedFile) return;

    const timer = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 82) return prev;
        return prev + 2;
      });
    }, 110);

    return () => window.clearInterval(timer);
  }, [selectedFile]);

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

  return (
    <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto">
      <div className="mx-auto min-h-screen w-full max-w-[1430px] px-[20px] pb-[40px] pt-[44px] md:px-[40px] md:pb-[56px] md:pt-[56px] xl:px-[60px]">
        <Stepper />

        <div className="mx-auto mt-[42px] flex w-full max-w-[1275px] flex-col gap-[36px]">
          <section className="flex w-full flex-col gap-[32px]">
            <div className="flex w-full max-w-[417px] flex-col gap-[8px]">
              <h1
                className="text-[32px] font-medium leading-[1] text-[#764d2f] md:text-[36px]"
                style={{ fontFamily: "'Canela Text Trial', sans-serif" }}
              >
                Upload Your PFS
              </h1>
              <p className="font-['Montserrat',sans-serif] text-[14px] font-medium leading-normal text-[#8c8780] md:text-[16px]">
                Upload a PDF and we&apos;ll extract your financial data.
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

            {!selectedFile ? (
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
            ) : (
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
                      {selectedFile}
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
            )}
          </section>

          <div className="flex w-full flex-col gap-[16px] sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => navigate('/profile-setup')}
              className="h-[50px] rounded-[8px] border-[1.5px] border-[#3e2d1d] px-[28px] sm:px-[48px]"
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
                onClick={() => navigate('/onboarding')}
                className="h-[50px] flex-1 rounded-[8px] border-[1.5px] border-[#3e2d1d] px-[20px] text-[16px] font-semibold leading-normal text-[#3e2d1d] sm:flex-none sm:px-[48px]"
                style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
              >
                Skip
              </button>
              <button
                type="button"
                onClick={() => navigate('/onboarding')}
                className="h-[50px] flex-1 rounded-[8px] bg-[#764d2f] px-[20px] text-[16px] font-semibold leading-normal text-white sm:flex-none sm:px-[48px]"
                style={{ fontFamily: "'SF Pro', sans-serif", fontVariationSettings: "'wdth' 100" }}
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

function Stepper() {
  return (
    <div className="mx-auto w-full max-w-[1310px] overflow-x-auto pb-[8px]">
      <div className="flex min-w-[760px] items-start px-[8px]">
        {STEPS.map((step, idx) => (
          <div key={step.id} className="flex min-w-0 flex-1 items-start">
            <div className="flex w-[96px] shrink-0 flex-col items-center gap-[8px]">
              <div
                className={`flex size-[44px] items-center justify-center rounded-full border-2 ${
                  step.active ? 'border-[#764d2f] bg-[#fafafa]' : 'border-[#d3b597] bg-[#fafafa]'
                }`}
              >
                <span
                  className={`font-['DM_Sans',sans-serif] text-[16px] font-bold leading-normal ${
                    step.active ? 'text-[#764d2f]' : 'text-[#d3b597]'
                  }`}
                  style={{ fontVariationSettings: "'opsz' 14" }}
                >
                  {step.id}
                </span>
              </div>
              <p
                className={`whitespace-pre-wrap text-center font-['Montserrat',sans-serif] text-[14px] font-medium leading-normal ${
                  step.active ? 'text-[#764d2f]' : 'text-[#d3b597]'
                }`}
              >
                {step.label}
              </p>
            </div>

            {idx < STEPS.length - 1 && (
              <div className="flex-1 pb-[15px] pt-[20px]">
                <div className="h-[2px] w-full bg-[#d3b597]" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
