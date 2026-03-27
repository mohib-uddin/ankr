
import type { SVGProps } from 'react';

export const paths = {
p14e33580: "M12.987 20H27.013M20 27.013V12.987",
p1ae0a380: "M11.1111 23.8933V25C11.1111 25.8841 11.4623 26.7319 12.0874 27.357C12.7125 27.9821 13.5604 28.3333 14.4444 28.3333H25.5556C26.4396 28.3333 27.2875 27.9821 27.9126 27.357C28.5377 26.7319 28.8889 25.8841 28.8889 25V23.8889M20 23.3333V11.1111M20 11.1111L23.8889 15M20 11.1111L16.1111 15",
} as const;


export type ProfileSetupPathName = keyof typeof paths;

type PathProps = { name: ProfileSetupPathName } & SVGProps<SVGPathElement>;

/** Figma-exported path — use semantic wrappers in feature code where possible. */
export function SvgPath({ name, ...rest }: PathProps) {
  return <path d={paths[name]} {...rest} />;
}

export default paths;
