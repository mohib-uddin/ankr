import { useMemo, useState } from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import { cn } from '@/ui/utils';

export type OutlinedDatePickerProps = {
  /** Stored as `YYYY-MM-DD` or empty. */
  value: string;
  onChange: (ymd: string) => void;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  'aria-label'?: string;
};

/** 46px outlined date trigger + popover calendar, matching outlined field styling. */
export function OutlinedDatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  id,
  disabled,
  'aria-label': ariaLabel,
}: OutlinedDatePickerProps) {
  const [open, setOpen] = useState(false);

  const selected = useMemo(() => {
    if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const d = parseISO(value);
    return isValid(d) ? d : undefined;
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          disabled={disabled}
          aria-label={ariaLabel ?? placeholder}
          className={cn(
            "flex h-[46px] w-full items-center justify-between gap-2 rounded-[8px] border border-[#d0d0d0] bg-white px-[12px] font-['Figtree',sans-serif] text-[14px] leading-[21px] outline-none transition-colors",
            selected ? 'text-[#1a1a1a]' : 'text-[#767676]',
            'focus-visible:border-[#764d2f] focus-visible:ring-[3px] focus-visible:ring-[#764d2f]/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          <span className="truncate text-left">
            {selected ? format(selected, 'MMM d, yyyy') : placeholder}
          </span>
          <CalendarIcon className="size-4 shrink-0 text-[#767676]" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className="w-auto border border-[#d0d0d0] bg-white p-0 shadow-[0px_10px_40px_0px_rgba(243,219,188,0.35)]"
      >
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onChange(format(date, 'yyyy-MM-dd'));
              setOpen(false);
            }
          }}
          initialFocus
          className="rounded-[8px]"
        />
      </PopoverContent>
    </Popover>
  );
}
