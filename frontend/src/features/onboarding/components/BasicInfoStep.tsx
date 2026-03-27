import { TextInput, StepHeader, StepActions } from './FormUI';
import type { FormData } from '@/app/types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BasicInfoStep({ data, onChange, onNext, onBack }: Props) {
  return (
    <div>
      <StepHeader
        stepNumber={1}
        title="Personal Details"
        subtitle="Basic information for your financial profile."
      />

      <div className="space-y-5">
        <TextInput
          label="Full Legal Name"
          value={data.fullName}
          onChange={(v) => onChange({ fullName: v })}
          placeholder="e.g. John A. Smith"
        />

        <TextInput
          label="Primary Address"
          value={data.address}
          onChange={(v) => onChange({ address: v })}
          placeholder="123 Main St, City, State ZIP"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="Email"
            value={data.email}
            onChange={(v) => onChange({ email: v })}
            placeholder="john@example.com"
            type="email"
          />
          <TextInput
            label="Phone"
            value={data.phone}
            onChange={(v) => onChange({ phone: v })}
            placeholder="(555) 123-4567"
            mask="phone"
          />
        </div>

        <div className="sm:w-1/2">
          <TextInput
            label="SSN"
            value={data.ssn}
            onChange={(v) => onChange({ ssn: v })}
            placeholder="XXX-XX-XXXX"
            mask="ssn"
          />
        </div>
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}
