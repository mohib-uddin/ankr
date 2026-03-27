import { useState } from 'react';
import { TextInput, CurrencyInput, SelectInput, StepHeader, StepActions, AddButton, CardShell, FileUpload } from './FormUI';
import { ChevronDown, ChevronUp } from 'lucide-react';
import type { FormData, Property } from '@/app/types';
import { generateId } from '@/app/types';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const PROPERTY_TYPES = [
  { value: 'single_family', label: 'Single Family' },
  { value: 'multi_family', label: 'Multi-Family' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'mixed_use', label: 'Mixed Use' },
  { value: 'land', label: 'Land' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'condo', label: 'Condo/Townhouse' },
];

export function RealEstateStep({ data, onChange, onNext, onBack }: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, string>>({});

  const addProperty = () => {
    const newProperty: Property = {
      id: generateId(),
      address: '',
      propertyType: '',
      estimatedValue: '',
      loanBalance: '',
      monthlyRent: '',
      interestRate: '',
      monthlyPayment: '',
      lender: '',
      maturityDate: '',
      ownershipPercent: '',
      showAdvanced: false,
    };
    onChange({ properties: [...data.properties, newProperty] });
  };

  const updateProperty = (id: string, updates: Partial<Property>) => {
    onChange({
      properties: data.properties.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    });
  };

  const removeProperty = (id: string) => {
    onChange({ properties: data.properties.filter((p) => p.id !== id) });
  };

  const duplicateProperty = (id: string) => {
    const source = data.properties.find((p) => p.id === id);
    if (source) {
      const dup: Property = { ...source, id: generateId() };
      onChange({ properties: [...data.properties, dup] });
    }
  };

  return (
    <div>
      <StepHeader
        stepNumber={3}
        title="Properties You Own"
        subtitle="Real estate holdings and associated debt."
      />

      <div className="space-y-4 mb-5">
        {data.properties.map((property, idx) => (
          <CardShell
            key={property.id}
            index={idx}
            onRemove={() => removeProperty(property.id)}
            onDuplicate={() => duplicateProperty(property.id)}
          >
            <div className="space-y-4">
              <TextInput
                label="Address"
                value={property.address}
                onChange={(v) => updateProperty(property.id, { address: v })}
                placeholder="Full property address"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SelectInput
                  label="Property Type"
                  value={property.propertyType}
                  onChange={(v) => updateProperty(property.id, { propertyType: v })}
                  options={PROPERTY_TYPES}
                />
                <CurrencyInput
                  label="Estimated Value"
                  value={property.estimatedValue}
                  onChange={(v) => updateProperty(property.id, { estimatedValue: v })}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <CurrencyInput
                  label="Loan Balance"
                  value={property.loanBalance}
                  onChange={(v) => updateProperty(property.id, { loanBalance: v })}
                />
                <CurrencyInput
                  label="Monthly Rent"
                  value={property.monthlyRent}
                  onChange={(v) => updateProperty(property.id, { monthlyRent: v })}
                />
              </div>

              <FileUpload
                compact
                selectedFile={uploadedFiles[property.id] || null}
                onFileSelect={(f) => setUploadedFiles((prev) => ({ ...prev, [property.id]: f.name }))}
              />

              <button
                type="button"
                onClick={() => updateProperty(property.id, { showAdvanced: !property.showAdvanced })}
                className="flex items-center gap-1.5 text-[13px] text-[#8C8780] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                {property.showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Advanced Details
              </button>

              {property.showAdvanced && (
                <div className="border-t border-[#E6E2DB] pt-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Interest Rate"
                      value={property.interestRate}
                      onChange={(v) => updateProperty(property.id, { interestRate: v })}
                      placeholder="e.g. 6.5%"
                    />
                    <CurrencyInput
                      label="Monthly Payment"
                      value={property.monthlyPayment}
                      onChange={(v) => updateProperty(property.id, { monthlyPayment: v })}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <TextInput
                      label="Lender"
                      value={property.lender}
                      onChange={(v) => updateProperty(property.id, { lender: v })}
                      placeholder="e.g. Wells Fargo"
                    />
                    <TextInput
                      label="Maturity Date"
                      value={property.maturityDate}
                      onChange={(v) => updateProperty(property.id, { maturityDate: v })}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="sm:w-1/2">
                    <TextInput
                      label="Ownership %"
                      value={property.ownershipPercent}
                      onChange={(v) => updateProperty(property.id, { ownershipPercent: v })}
                      placeholder="e.g. 100"
                    />
                  </div>
                </div>
              )}
            </div>
          </CardShell>
        ))}
      </div>

      <AddButton onClick={addProperty} label="Add Property" />

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}