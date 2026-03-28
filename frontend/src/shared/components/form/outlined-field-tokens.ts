import { cn } from '@/ui/utils';

/** Figtree input text — matches auth & onboarding outlined fields. Hook: `.outlined-text-field-input` (see `theme.css` autofill reset). */
export const outlinedInputClassName =
  "outlined-text-field-input font-['Figtree',sans-serif] font-normal leading-[21px] text-[#1a1a1a] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none focus-visible:outline-none placeholder:text-[#767676]";

/** SF Pro label — matches auth & onboarding. */
export const outlinedLabelClassName =
  "font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full";

export const outlinedLabelStyle = { fontVariationSettings: "'wdth' 100" } as const;

/** Outer shell must include `group` so `group-focus-within` on the border overlay responds to the input. */
export const outlinedControlShellClassName =
  'group relative h-[46px] w-full rounded-[8px] bg-white';

/**
 * Border + a single outer glow shadow (no Tailwind `ring-*`, which stacks extra shadows and animates poorly).
 * Default and focused states use the same one-layer shadow so `transition-shadow` interpolates cleanly.
 */
export function outlinedControlBorderClass(invalid: boolean) {
  return cn(
    'pointer-events-none absolute inset-0 rounded-[8px] border border-solid transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.33,1,0.68,1)]',
    invalid
      ? 'border-[#b42318] shadow-[0_0_0_0_rgba(180,35,24,0)] group-focus-within:border-[#b42318] group-focus-within:shadow-[0_0_0_3px_rgba(180,35,24,0.18)]'
      : 'border-[#d0d0d0] shadow-[0_0_0_0_rgba(118,77,47,0)] group-hover:border-[#bcbab6] group-focus-within:border-[#764d2f] group-focus-within:shadow-[0_0_0_3px_rgba(118,77,47,0.2)]',
  );
}

export const outlinedFieldErrorTextClass =
  "font-['Figtree',sans-serif] text-[#b42318] text-[13px] leading-[18px]";
