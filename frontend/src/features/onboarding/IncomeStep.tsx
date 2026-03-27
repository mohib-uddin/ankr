import { useState } from 'react';
import { CurrencyInput, StepHeader, StepActions, FileUpload } from './FormUI';
import type { FormData } from '@/app/types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function IncomeStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  return (
    <div>
      <StepHeader
        stepNumber={7}
        title="Income"
        subtitle="Annual income from all sources."
      />

      <div className="space-y-5">
        <CurrencyInput
          label="Primary Income"
          value={data.primaryIncome}
          onChange={(v) => onChange({ primaryIncome: v })}
        />
        <CurrencyInput
          label="Rental Income"
          value={data.rentalIncome}
          onChange={(v) => onChange({ rentalIncome: v })}
        />
        <CurrencyInput
          label="Other Income"
          value={data.otherIncome}
          onChange={(v) => onChange({ otherIncome: v })}
        />

        <div className="pt-2">
          <FileUpload
            label="Tax Return"
            selectedFile={uploadedFile}
            onFileSelect={(f) => setUploadedFile(f.name)}
          />
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
