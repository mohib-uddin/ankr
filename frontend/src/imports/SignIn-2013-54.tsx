import svgPaths from "./svg-83mjixczgf";

function Frame12() {
  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
      <div className="font-['Cormorant_Garamond',sans-serif] leading-[50px] not-italic relative shrink-0 text-[#764d2f] text-[48px] w-full">
        <p className="mb-0">Build Your</p>
        <p>Financial Profile</p>
      </div>
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#8c8780] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Add it once. Use it across every deal.
      </p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative shrink-0 text-center w-full">
      <p className="font-['Cormorant_Garamond',sans-serif] leading-[71.822px] not-italic relative shrink-0 text-[#764d2f] text-[72px] tracking-[2.88px] whitespace-nowrap">ANKR</p>
      <Frame12 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-[442px]">
      <Frame />
    </div>
  );
}

function MynauiUpload() {
  return (
    <div className="h-[39.444px] relative shrink-0 w-[40px]" data-name="mynaui:upload">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 39.4444">
        <g id="mynaui:upload">
          <rect fill="var(--fill-0, #F3EFE6)" height="39.4444" rx="4.44444" width="40" />
          <path d={svgPaths.p1ae0a380} id="Vector" stroke="var(--stroke-0, #8B7357)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
      <p className="font-['Canela_Text_Trial',sans-serif] not-italic relative shrink-0 text-[#764d2f] text-[24px] w-full">Upload Existing PFS</p>
      <p className="font-['SF_Pro',sans-serif] font-[510] relative shrink-0 text-[#8c8780] text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Upload a PDF and we’ll parse and extract your data automatically
      </p>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-end relative shrink-0 w-[354px]">
      <MynauiUpload />
      <Frame2 />
    </div>
  );
}

function Frame4() {
  return (
    <div className="bg-white relative rounded-[16px] shrink-0">
      <div className="content-stretch flex flex-col gap-[10px] items-start overflow-clip p-[28px] relative rounded-[inherit]">
        <Frame3 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function MynauiUpload1() {
  return (
    <div className="relative shrink-0 size-[40px]" data-name="mynaui:upload">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
        <g id="mynaui:upload">
          <rect fill="var(--fill-0, #3E2D1D)" height="40" rx="5.19481" width="40" />
          <path d={svgPaths.p14e33580} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2.33766" />
        </g>
      </svg>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 text-white w-full">
      <p className="font-['Canela_Text_Trial',sans-serif] not-italic relative shrink-0 text-[24px] w-full">Build Profile in Minutes</p>
      <p className="font-['SF_Pro',sans-serif] font-[510] relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Step-by-step guided financial profile builder. Takes about 10 minutes
      </p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start justify-end relative shrink-0 w-[354px]">
      <MynauiUpload1 />
      <Frame10 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#764d2f] relative rounded-[16px] shrink-0">
      <div className="content-stretch flex flex-col items-start overflow-clip p-[28px] relative rounded-[inherit]">
        <Frame7 />
      </div>
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px]" />
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex gap-[24px] items-center relative shrink-0 w-full">
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex flex-col gap-[64px] items-center relative shrink-0">
      <Frame1 />
      <Frame6 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center left-1/2 top-[calc(50%-62.5px)] w-[844px]">
      <Frame8 />
    </div>
  );
}

function Frame11() {
  return (
    <div className="absolute bg-white bottom-[36px] content-stretch flex gap-[10px] items-center justify-center left-[calc(26.67%+76.3px)] px-[24px] py-[10px] rounded-[100px]">
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[100px]" />
      <div className="relative shrink-0 size-[9px]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
          <circle cx="4.5" cy="4.5" fill="var(--fill-0, #764D2F)" id="Ellipse 2" r="4.5" />
        </svg>
      </div>
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#8c8780] text-[14px] text-center whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Your data is encrypted and stored securely. You can update it at any time.
      </p>
    </div>
  );
}

export default function SignIn() {
  return (
    <div className="bg-[#fcf6f0] relative size-full" data-name="Sign In">
      <Frame9 />
      <Frame11 />
    </div>
  );
}