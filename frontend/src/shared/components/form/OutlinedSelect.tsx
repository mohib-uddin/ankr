import { useId } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { cn } from '@/ui/utils';

import { outlinedFieldErrorTextClass } from './outlined-field-tokens';

const triggerBaseClass = cn(
  'h-[46px] min-h-[46px] w-full rounded-[8px] border border-solid bg-white px-[12px] py-[10px] shadow-none',
  "font-['Figtree',sans-serif] text-[14px] font-normal leading-[21px] text-[#1a1a1a]",
  'outline-none transition-[color,box-shadow]',
  'focus-visible:border-[#764d2f] focus-visible:ring-[3px] focus-visible:ring-[#764d2f]/20 focus-visible:ring-offset-0',
  'data-[placeholder]:text-[#767676]',
  '[&_[data-slot=select-value]]:font-normal [&_[data-slot=select-value]]:text-[#1a1a1a]',
  'data-[placeholder]:[&_[data-slot=select-value]]:text-[#767676]',
  '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:text-[#767676] [&_svg]:opacity-100',
);

function triggerClassName(invalid: boolean) {
  return cn(triggerBaseClass, invalid ? 'border-[#b42318]' : 'border-[#d0d0d0]');
}

const contentClassName = cn(
  'z-[100] max-h-[min(320px,var(--radix-select-content-available-height))] rounded-[8px] border border-[#d0d0d0] bg-white shadow-[0px_10px_40px_0px_rgba(243,219,188,0.35)]',
  "font-['Figtree',sans-serif] text-[14px]",
);

const itemClassName =
  "rounded-[6px] py-2.5 text-[#1a1a1a] focus:bg-[#fcf6f0] focus:text-[#1a1a1a] data-[highlighted]:bg-[#fcf6f0] data-[highlighted]:text-[#1a1a1a]";

export type OutlinedSelectOption = { value: string; label: string };

export type OutlinedSelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly OutlinedSelectOption[];
  placeholder?: string;
  id?: string;
  'aria-label'?: string;
  error?: string;
};

/** 46px outlined select matching {@link OutlinedTextField} styling (label stays in parent when needed). */
export function OutlinedSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Select…',
  id,
  'aria-label': ariaLabel,
  error,
}: OutlinedSelectProps) {
  const fallbackId = useId();
  const invalid = Boolean(error);
  const errorId = invalid ? `${id ?? fallbackId}-field-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-[6px]">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          aria-label={ariaLabel}
          aria-invalid={invalid}
          aria-describedby={invalid ? errorId : undefined}
          size="none"
          className={triggerClassName(invalid)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent position="popper" sideOffset={4} className={contentClassName}>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className={itemClassName}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p id={errorId} role="alert" className={outlinedFieldErrorTextClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
