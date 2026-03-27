import { useState } from 'react';
import { CurrencyInput, StepHeader, StepActions, FileUpload } from './FormUI';
import type { FormData } from '../types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LiabilitiesStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  return (
    <div>
      <StepHeader
        stepNumber={6}
        title="Liabilities"
        subtitle="Outstanding debts not associated with real estate."
      />

      <div className="space-y-5">
        <CurrencyInput
          label="Credit Cards Total"
          value={data.creditCardsTotal}
          onChange={(v) => onChange({ creditCardsTotal: v })}
        />
        <CurrencyInput
          label="Personal Loans"
          value={data.personalLoans}
          onChange={(v) => onChange({ personalLoans: v })}
        />
        <CurrencyInput
          label="Other Debt"
          value={data.otherDebt}
          onChange={(v) => onChange({ otherDebt: v })}
        />

        <div className="pt-2">
          <FileUpload
            label="Statements"
            selectedFile={uploadedFile}
            onFileSelect={(f) => setUploadedFile(f.name)}
          />
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
