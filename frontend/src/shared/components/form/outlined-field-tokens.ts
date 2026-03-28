import { cn } from '@/ui/utils';

/** Figtree input text — matches auth & onboarding outlined fields. */
export const outlinedInputClassName =
  "font-['Figtree',sans-serif] font-normal leading-[21px] text-[#1a1a1a] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]";

/** SF Pro label — matches auth & onboarding. */
export const outlinedLabelClassName =
  "font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full";

export const outlinedLabelStyle = { fontVariationSettings: "'wdth' 100" } as const;

export function outlinedControlBorderClass(invalid: boolean) {
  return cn(
    'absolute border border-solid inset-0 pointer-events-none rounded-[8px]',
    invalid ? 'border-[#b42318]' : 'border-[#d0d0d0]',
  );
}

export const outlinedFieldErrorTextClass =
  "font-['Figtree',sans-serif] text-[#b42318] text-[13px] leading-[18px]";
