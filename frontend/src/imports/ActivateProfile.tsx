import svgPaths from "./svg-5t5g3jnxim";

function InterfaceCheck() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 rounded-[1000px] size-[233px] top-0" data-name="Interface / Check">
      <div aria-hidden="true" className="absolute border-2 border-[#c4b29a] border-solid inset-0 pointer-events-none rounded-[1000px]" />
    </div>
  );
}

function InterfaceCheck1() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 rounded-[1000px] size-[183px] top-[25px]" data-name="Interface / Check">
      <div aria-hidden="true" className="absolute border-2 border-[#c4b29a] border-solid inset-0 pointer-events-none rounded-[1000px]" />
    </div>
  );
}

function InterfaceCheck2() {
  return (
    <div className="-translate-x-1/2 absolute left-1/2 size-[139px] top-[47px]" data-name="Interface / Check">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 139 139">
        <g id="Interface / Check">
          <rect fill="var(--fill-0, #764D2F)" height="139" rx="69.5" width="139" />
          <path d={svgPaths.p17b85580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" />
        </g>
      </svg>
    </div>
  );
}

function Frame1() {
  return (
    <div className="relative shrink-0 size-[233px]">
      <InterfaceCheck />
      <InterfaceCheck1 />
      <InterfaceCheck2 />
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center relative shrink-0 text-center w-full">
      <p className="font-['Canela_Text_Trial',sans-serif] leading-[50px] not-italic relative shrink-0 text-[#764d2f] text-[48px] w-full">Profile Activated</p>
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#8c8780] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Your financial profile is live and ready to use across every deal on the platform.
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col gap-[24px] items-center left-1/2 top-[calc(50%-0.5px)] w-[442px]">
      <Frame1 />
      <Frame />
      <div className="bg-[#764d2f] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] relative rounded-[8px] shrink-0" data-name="Button">
        <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Go to Dashboard
        </p>
        <div className="flex h-[9.537px] items-center justify-center relative shrink-0 w-[12.999px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "19" } as React.CSSProperties}>
          <div className="flex-none rotate-90">
            <div className="h-[12.999px] relative w-[9.537px]" data-name="Vector">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
                <path d={svgPaths.pec28900} fill="var(--fill-0, white)" id="Vector" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ActivateProfile() {
  return (
    <div className="bg-[#fcf6f0] relative size-full" data-name="Activate Profile">
      <Frame2 />
    </div>
  );
}