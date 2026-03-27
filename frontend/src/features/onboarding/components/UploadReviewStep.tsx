import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, FileText, Check } from 'lucide-react';
import { StepActions } from './FormUI';
import type { FormData } from '@/app/types';
import { generateId } from '@/app/types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type UploadState = 'idle' | 'uploading' | 'processing' | 'done';

export function UploadReviewStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (file: File) => {
    setFileName(file.name);
    setUploadState('uploading');
    setProgress(0);

    // Simulate upload
    const uploadInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(uploadInterval);
          setUploadState('processing');

          // Simulate processing
          setTimeout(() => {
            // Populate with mock extracted data
            onChange({
              fullName: 'John A. Smith',
              address: '1234 Oak Street, Austin, TX 78701',
              email: 'john.smith@email.com',
              phone: '(512) 555-0147',
              accounts: [
                { id: generateId(), institution: 'Chase', accountType: 'checking', balance: '245,000' },
                { id: generateId(), institution: 'Schwab', accountType: 'brokerage', balance: '1,850,000' },
              ],
              properties: [
                {
                  id: generateId(),
                  address: '456 Main Blvd, Austin, TX 78704',
                  propertyType: 'multi_family',
                  estimatedValue: '2,400,000',
                  loanBalance: '1,600,000',
                  monthlyRent: '18,500',
                  interestRate: '5.75%',
                  monthlyPayment: '9,340',
                  lender: 'Wells Fargo',
                  maturityDate: '03/2029',
                  ownershipPercent: '100',
                  showAdvanced: false,
                },
              ],
              entities: [
                { id: generateId(), name: 'Smith Capital Holdings LLC', ownershipPercent: '100', estimatedValue: '3,200,000' },
              ],
              investmentsTotal: '750,000',
              privateInvestments: '400,000',
              creditCardsTotal: '12,000',
              personalLoans: '85,000',
              primaryIncome: '380,000',
              rentalIncome: '222,000',
            });

            setUploadState('done');
          }, 1800);

          return 100;
        }
        return p + 4;
      });
    }, 60);
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[12px] tracking-[0.15em] uppercase text-[#8C8780]">Upload</span>
        </div>
        <h2 className="text-[24px] text-[#1A1A1A] tracking-[-0.02em]">Upload Your PFS</h2>
        <p className="text-[15px] text-[#8C8780] mt-1">
          Upload a PDF and we'll extract your financial data.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
      />

      <AnimatePresence mode="wait">
        {uploadState === 'idle' && (
          <motion.button
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full border-2 border-dashed border-[#D2CEC7] rounded-xl py-16 flex flex-col items-center gap-3 hover:border-[#22C55E] transition-colors cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-lg bg-[#F0FDF4] flex items-center justify-center group-hover:bg-[#DCFCE7] transition-colors">
              <Upload className="w-5 h-5 text-[#22C55E]" />
            </div>
            <div className="text-center">
              <p className="text-[15px] text-[#1A1A1A]">Drop your PFS here or click to browse</p>
              <p className="text-[13px] text-[#B5B0A9] mt-1">PDF format, up to 25MB</p>
            </div>
          </motion.button>
        )}

        {(uploadState === 'uploading' || uploadState === 'processing') && (
          <motion.div
            key="progress"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full border border-[#E6E2DB] rounded-xl p-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center shrink-0">
                <FileText className="w-4.5 h-4.5 text-[#22C55E]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-[#1A1A1A] truncate">{fileName}</p>
                <p className="text-[13px] text-[#8C8780]">
                  {uploadState === 'uploading' ? 'Uploading...' : 'Extracting data...'}
                </p>
              </div>
            </div>
            <div className="h-1.5 bg-[#EDEBE6] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-[#22C55E] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: uploadState === 'processing' ? '100%' : `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>
        )}

        {uploadState === 'done' && (
          <motion.div
            key="done"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3 p-4 bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg">
              <div className="w-6 h-6 rounded-full bg-[#22C55E] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <p className="text-[14px] text-[#1A1A1A]">
                Data extracted from <span className="text-[#22C55E]">{fileName}</span>
              </p>
            </div>

            <div className="bg-white border border-[#E6E2DB] rounded-lg divide-y divide-[#E6E2DB]">
              <ExtractedRow label="Accounts Found" value={`${data.accounts.length} accounts`} />
              <ExtractedRow label="Properties Found" value={`${data.properties.length} properties`} />
              <ExtractedRow label="Entities Found" value={`${data.entities.length} entities`} />
              <ExtractedRow label="Income Sources" value="2 sources identified" />
            </div>

            <p className="text-[13px] text-[#8C8780]">
              You can review and edit all extracted data in the following steps.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <StepActions
        onBack={onBack}
        onNext={onNext}
        nextLabel={uploadState === 'done' ? 'Confirm & Continue' : 'Continue'}
      />
    </div>
  );
}

function ExtractedRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[14px] text-[#6E6A65]">{label}</span>
      <span className="text-[14px] text-[#1A1A1A]">{value}</span>
    </div>
  );
}