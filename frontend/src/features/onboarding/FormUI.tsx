import React, { useRef } from 'react';
import { Upload, ChevronDown } from 'lucide-react';

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  mask?: 'phone' | 'ssn';
}

export function TextInput({ label, value, onChange, placeholder, type = 'text', mask }: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (mask === 'phone') {
      val = val.replace(/\D/g, '').slice(0, 10);
      if (val.length > 6) val = `(${val.slice(0, 3)}) ${val.slice(3, 6)}-${val.slice(6)}`;
      else if (val.length > 3) val = `(${val.slice(0, 3)}) ${val.slice(3)}`;
      else if (val.length > 0) val = `(${val}`;
    }
    if (mask === 'ssn') {
      val = val.replace(/\D/g, '').slice(0, 9);
      if (val.length > 5) val = `${val.slice(0, 3)}-${val.slice(3, 5)}-${val.slice(5)}`;
      else if (val.length > 3) val = `${val.slice(0, 3)}-${val.slice(3)}`;
    }
    onChange(val);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-[#6E6A65] tracking-wide uppercase">{label}</label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 bg-white border border-[#E6E2DB] rounded-lg text-[#1A1A1A] placeholder-[#C5C0B9] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all duration-150"
      />
    </div>
  );
}

interface CurrencyInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencyInput({ label, value, onChange, placeholder = '0' }: CurrencyInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      onChange('');
      return;
    }
    const num = parseInt(raw, 10);
    onChange(num.toLocaleString('en-US'));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-[#6E6A65] tracking-wide uppercase">{label}</label>
      <div className="relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C8780]">$</span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-7 pr-3.5 py-2.5 bg-white border border-[#E6E2DB] rounded-lg text-[#1A1A1A] placeholder-[#C5C0B9] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all duration-150"
        />
      </div>
    </div>
  );
}

interface SelectInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export function SelectInput({ label, value, onChange, options, placeholder = 'Select' }: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[13px] text-[#6E6A65] tracking-wide uppercase">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-3.5 py-2.5 bg-white border border-[#E6E2DB] rounded-lg text-[#1A1A1A] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all duration-150 cursor-pointer"
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C8780] pointer-events-none" />
      </div>
    </div>
  );
}

interface FileUploadProps {
  label?: string;
  onFileSelect: (file: File) => void;
  selectedFile?: string | null;
  compact?: boolean;
}

export function FileUpload({ label, onFileSelect, selectedFile, compact }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-[13px] text-[#6E6A65] tracking-wide uppercase">{label}</label>}
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed border-[#D2CEC7] rounded-lg text-[#8C8780] hover:border-[#22C55E] hover:text-[#16A34A] transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${compact ? 'px-3 py-2 text-[13px]' : 'px-4 py-3 text-[14px]'}`}
      >
        <Upload className={compact ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        {selectedFile ? (
          <span className="text-[#1A1A1A] truncate max-w-[200px]">{selectedFile}</span>
        ) : (
          <span>{label ? 'Choose file' : 'Upload document'}</span>
        )}
      </button>
    </div>
  );
}

interface StepHeaderProps {
  stepNumber: number;
  title: string;
  subtitle?: string;
}

export function StepHeader({ stepNumber, title, subtitle }: StepHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-1">
        <span className="text-[12px] tracking-[0.15em] uppercase text-[#8C8780]">Step {stepNumber}</span>
      </div>
      <h2 className="text-[24px] text-[#1A1A1A] tracking-[-0.02em]">{title}</h2>
      {subtitle && <p className="text-[15px] text-[#8C8780] mt-1">{subtitle}</p>}
    </div>
  );
}

interface StepActionsProps {
  onBack?: () => void;
  onNext: () => void;
  nextLabel?: string;
  backLabel?: string;
  showBack?: boolean;
}

export function StepActions({ onBack, onNext, nextLabel = 'Continue', backLabel = 'Back', showBack = true }: StepActionsProps) {
  return (
    <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E6E2DB]">
      {showBack && onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-[15px] text-[#6E6A65] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          {backLabel}
        </button>
      ) : (
        <div />
      )}
      <button
        type="button"
        onClick={onNext}
        className="px-7 py-2.5 bg-[#22C55E] text-white rounded-lg text-[15px] hover:bg-[#16A34A] transition-colors cursor-pointer"
      >
        {nextLabel}
      </button>
    </div>
  );
}

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export function AddButton({ onClick, label }: AddButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full py-3 border border-dashed border-[#D2CEC7] rounded-lg text-[14px] text-[#6E6A65] hover:border-[#22C55E] hover:text-[#16A34A] transition-all duration-150 cursor-pointer"
    >
      + {label}
    </button>
  );
}

interface CardShellProps {
  children: React.ReactNode;
  onRemove?: () => void;
  onDuplicate?: () => void;
  index: number;
}

export function CardShell({ children, onRemove, onDuplicate, index }: CardShellProps) {
  return (
    <div className="bg-white border border-[#E6E2DB] rounded-lg p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[12px] tracking-[0.1em] uppercase text-[#B5B0A9]">#{index + 1}</span>
        <div className="flex items-center gap-1">
          {onDuplicate && (
            <button
              type="button"
              onClick={onDuplicate}
              className="text-[12px] text-[#8C8780] hover:text-[#1A1A1A] px-2 py-1 transition-colors cursor-pointer"
            >
              Duplicate
            </button>
          )}
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="text-[12px] text-[#EF4444] hover:text-[#DC2626] px-2 py-1 transition-colors cursor-pointer"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}