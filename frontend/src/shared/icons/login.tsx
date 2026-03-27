import type { SVGProps } from 'react';

export const paths = {
pec28900: "M1.29871 5.27934C1.23005 5.35303 1.14725 5.41213 1.05525 5.45312C0.963247 5.49411 0.863934 5.51616 0.763231 5.51793C0.662528 5.51971 0.562499 5.50118 0.46911 5.46346C0.375722 5.42574 0.290888 5.3696 0.21967 5.29838C0.148451 5.22716 0.0923064 5.14233 0.0545854 5.04894C0.0168643 4.95555 -0.00166006 4.85552 0.000116722 4.75482C0.00189351 4.65412 0.023935 4.5548 0.064927 4.4628C0.105919 4.3708 0.165021 4.288 0.238708 4.21934L4.23871 0.21934C4.37933 0.0788894 4.56996 0 4.76871 0C4.96746 0 5.15808 0.0788894 5.29871 0.21934L9.29871 4.21934C9.3724 4.288 9.4315 4.3708 9.47249 4.4628C9.51348 4.5548 9.53552 4.65412 9.5373 4.75482C9.53908 4.85552 9.52055 4.95555 9.48283 5.04894C9.44511 5.14233 9.38896 5.22716 9.31775 5.29838C9.24653 5.3696 9.16169 5.42574 9.06831 5.46346C8.97492 5.50118 8.87489 5.51971 8.77419 5.51793C8.67348 5.51616 8.57417 5.49411 8.48217 5.45312C8.39017 5.41213 8.30737 5.35303 8.23871 5.27934L5.51871 2.55934V12.2493C5.51871 12.4483 5.43969 12.639 5.29904 12.7797C5.15839 12.9203 4.96762 12.9993 4.76871 12.9993C4.5698 12.9993 4.37903 12.9203 4.23838 12.7797C4.09773 12.639 4.01871 12.4483 4.01871 12.2493V2.55934L1.29871 5.27934Z",
} as const;


export type LoginPathName = keyof typeof paths;

type PathProps = { name: LoginPathName } & SVGProps<SVGPathElement>;

/** Figma-exported path — use semantic wrappers in feature code where possible. */
export function SvgPath({ name, ...rest }: PathProps) {
  return <path d={paths[name]} {...rest} />;
}

/** Chevron used on the login submit button (Figma) */
export function LoginSubmitChevronIcon() {
  return (
    <div className="flex h-[9.537px] items-center justify-center w-[12.999px]">
      <div className="flex-none rotate-90">
        <div className="h-[12.999px] w-[9.537px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
            <path d={paths.pec28900} fill="white" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default paths;
