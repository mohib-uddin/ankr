import * as React from 'react';
import { REGEXP_ONLY_DIGITS, OTPInputContext } from 'input-otp';
import { InputOTP } from '@/shared/components/ui/input-otp';
import { cn } from '@/ui/utils';
import { outlinedFieldErrorTextClass, outlinedLabelClassName, outlinedLabelStyle } from './outlined-field-tokens';

const OTP_LENGTH = 5;

export type OutlinedOtpFieldProps = {
  id: string;
  /** Visible label above the OTP row; omit on screens where context is already explained (e.g. verify email copy). */
  label?: string;
  /** Used as `aria-label` when `label` is omitted (defaults to a short verification hint). */
  ariaLabel?: string;
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  error?: string;
};

type AuthOtpSlotProps = {
  index: number;
  invalid: boolean;
};

/**
 * Slot UI without shadcn defaults — full border per cell, brand focus, tabular digits (matches premium auth OTP patterns).
 */
function AuthOtpSlot({ index, invalid }: AuthOtpSlotProps) {
  const ctx = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = ctx?.slots[index] ?? {};

  return (
    <div
      data-slot="auth-otp-slot"
      data-active={isActive}
      className={cn(
        'relative flex h-[62px] min-w-0 flex-1 basis-0 select-none items-center justify-center rounded-[10px] border border-solid bg-white font-[\'Figtree\',sans-serif] text-[24px] font-medium tabular-nums tracking-[0.02em] text-[#1a1a1a] antialiased transition-[border-color,box-shadow,background-color] duration-200 md:h-[68px] md:text-[26px]',
        invalid
          ? 'border-[#b42318] bg-[#fff8f7] data-[active=true]:border-[#b42318] data-[active=true]:shadow-[inset_0_0_0_1px_rgba(180,35,24,0.25)] data-[active=true]:ring-2 data-[active=true]:ring-[#b42318]/15'
          : 'border-[#d0d0d0] shadow-[0_1px_2px_rgba(26,26,26,0.04)] data-[active=true]:border-[#764d2f] data-[active=true]:shadow-[0_1px_3px_rgba(118,77,47,0.12),inset_0_0_0_1px_rgba(118,77,47,0.2)] data-[active=true]:ring-2 data-[active=true]:ring-[#764d2f]/18',
      )}
    >
      {char != null && char !== '' ? <span className="leading-none">{char}</span> : null}
      {hasFakeCaret ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              'h-[26px] w-[2px] rounded-full md:h-[28px]',
              invalid ? 'animate-caret-blink bg-[#b42318]' : 'animate-caret-blink bg-[#764d2f]',
            )}
          />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Five-digit OTP using `input-otp`, styled to align with {@link OutlinedTextField} (outlined cells, Figtree, brand focus).
 */
export function OutlinedOtpField({
  id,
  label,
  ariaLabel = 'Verification code',
  value,
  onChange,
  onComplete,
  disabled,
  invalid: invalidProp,
  error,
}: OutlinedOtpFieldProps) {
  const invalid = Boolean(invalidProp || error);
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-[6px]">
      {label ? (
        <label htmlFor={id} className={outlinedLabelClassName} style={outlinedLabelStyle}>
          {label}
        </label>
      ) : null}
      <InputOTP
        id={id}
        maxLength={OTP_LENGTH}
        pattern={REGEXP_ONLY_DIGITS}
        inputMode="numeric"
        autoComplete="one-time-code"
        aria-label={label ? undefined : ariaLabel}
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        disabled={disabled}
        aria-invalid={invalid}
        aria-describedby={errorId}
        containerClassName="w-full gap-0 has-disabled:opacity-60"
      >
        <div className="flex w-full gap-[10px] md:gap-[12px]">
          {Array.from({ length: OTP_LENGTH }, (_, i) => (
            <AuthOtpSlot key={i} index={i} invalid={invalid} />
          ))}
        </div>
      </InputOTP>
      {error ? (
        <p id={errorId} role="alert" className={outlinedFieldErrorTextClass}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
