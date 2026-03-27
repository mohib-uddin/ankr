import svgPaths from "./svg-sact4x6z28";

export default function Button() {
  return (
    <div className="bg-[#fffdf8] content-stretch flex items-center pl-[24px] pr-[48px] py-[10px] relative rounded-[8px] size-full" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
      <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
        <div className="relative shrink-0 size-[24px]" data-name="mynaui:upload">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <g id="mynaui:upload">
              <path d={svgPaths.p27c29e0} id="Vector" stroke="var(--stroke-0, #3E2D1D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
        <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
          Upload Bank Statement to autofill
        </p>
      </div>
    </div>
  );
}