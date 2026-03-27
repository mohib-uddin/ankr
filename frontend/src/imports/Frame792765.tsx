function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">Jane A. Smith</p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <Frame1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <Frame2 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">123 Main Street, New York</p>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <Frame5 />
    </div>
  );
}

function Frame3() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <Frame4 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame8() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">jane@example.com</p>
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <Frame8 />
    </div>
  );
}

function Frame6() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <Frame7 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame11() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">(555) 000 - 0000</p>
    </div>
  );
}

function Frame10() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <Frame11 />
    </div>
  );
}

function Frame9() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <Frame10 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame16() {
  return (
    <div className="content-stretch flex gap-[24px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative" data-name="Text field (white)">
        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
          Email
        </p>
        <Frame6 />
      </div>
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative" data-name="Text field (white)">
        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Phone `}</p>
        <Frame9 />
      </div>
    </div>
  );
}

function Frame14() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">********</p>
    </div>
  );
}

function Frame13() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center min-h-px min-w-px relative">
      <Frame14 />
    </div>
  );
}

function Frame12() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <Frame13 />
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function Frame15() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Text field (white)">
        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Full Legal Name `}</p>
        <Frame />
      </div>
      <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full" data-name="Text field (white)">
        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
          Primary Address
        </p>
        <Frame3 />
      </div>
      <Frame16 />
      <div className="content-stretch flex flex-col gap-[6px] h-[103px] items-start relative shrink-0 w-full" data-name="Text field (white)">
        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>{`Social Security Number `}</p>
        <Frame12 />
        <p className="font-['Figtree',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#8c8780] text-[12px] w-full">{`Encrypted and stored securely. Required for identity verification. `}</p>
      </div>
    </div>
  );
}

export default function Frame17() {
  return (
    <div className="bg-white content-stretch flex flex-col items-start p-[24px] relative rounded-[20px] size-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <Frame15 />
    </div>
  );
}