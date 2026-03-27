import svgPaths from "./svg-z99rxpbbck";

function ProiconsFolder() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="proicons:folder">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="proicons:folder">
          <path d={svgPaths.p15e33e70} id="Vector" stroke="var(--stroke-0, #3E2D1D)" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button() {
  return (
    <div className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <ProiconsFolder />
      <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        New Folder
      </p>
    </div>
  );
}

function MynauiUpload() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="mynaui:upload">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="mynaui:upload">
          <path d={svgPaths.p27c29e0} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#3e2d1d] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0" data-name="Button">
      <MynauiUpload />
      <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Upload
      </p>
    </div>
  );
}

export default function Frame() {
  return (
    <div className="content-stretch flex gap-[8px] items-center relative size-full">
      <Button />
      <Button1 />
    </div>
  );
}