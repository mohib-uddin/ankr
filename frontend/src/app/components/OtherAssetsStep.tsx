import { useState } from 'react';
import { CurrencyInput, StepHeader, StepActions, FileUpload } from './FormUI';
import type { FormData } from '../types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OtherAssetsStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  return (
    <div>
      <StepHeader
        stepNumber={5}
        title="Other Assets"
        subtitle="Investments, private holdings, and other asset classes."
      />

      <div className="space-y-5">
        <CurrencyInput
          label="Investments Total"
          value={data.investmentsTotal}
          onChange={(v) => onChange({ investmentsTotal: v })}
        />
        <CurrencyInput
          label="Private Investments"
          value={data.privateInvestments}
          onChange={(v) => onChange({ privateInvestments: v })}
        />
        <CurrencyInput
          label="Other Assets"
          value={data.otherAssets}
          onChange={(v) => onChange({ otherAssets: v })}
        />

        <div className="pt-2">
          <FileUpload
            label="Supporting Documents"
            selectedFile={uploadedFile}
            onFileSelect={(f) => setUploadedFile(f.name)}
          />
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
