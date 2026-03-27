function Frame() {
  return (
    <div className="content-stretch flex flex-col gap-[12.984px] items-start relative shrink-0 text-center text-white w-full">
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[12.984px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Estimated Net Worth
      </p>
      <p className="font-['SF_Pro',sans-serif] font-bold leading-[40.576px] relative shrink-0 text-[51.937px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        $10M
      </p>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[287.277px]">
      <Frame />
    </div>
  );
}

function Frame9() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#eedccf] h-[155px] left-[calc(50%-0.5px)] rounded-[12.984px] top-[88px] w-[1168px]">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[22.723px] relative rounded-[inherit] size-full">
        <Frame1 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaeaea] border-[0.812px] border-solid inset-0 pointer-events-none rounded-[12.984px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-col gap-[12.984px] items-start relative shrink-0 text-center text-white w-full">
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[12.984px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Estimated Net Worth
      </p>
      <p className="font-['SF_Pro',sans-serif] font-bold leading-[40.576px] relative shrink-0 text-[51.937px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        $10M
      </p>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[287.277px]">
      <Frame3 />
    </div>
  );
}

function Frame8() {
  return (
    <div className="-translate-x-1/2 absolute bg-[#ceab92] h-[155px] left-1/2 rounded-[12.984px] top-[62px] w-[1235px]">
      <div className="content-stretch flex flex-col items-center justify-center overflow-clip p-[22.723px] relative rounded-[inherit] size-full">
        <Frame2 />
      </div>
      <div aria-hidden="true" className="absolute border-[#eaeaea] border-[0.812px] border-solid inset-0 pointer-events-none rounded-[12.984px]" />
    </div>
  );
}

function Frame7() {
  return (
    <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 text-center text-white w-full">
      <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[16px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        Estimated Net Worth
      </p>
      <p className="font-['SF_Pro',sans-serif] font-bold leading-[50px] relative shrink-0 text-[64px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
        $10M
      </p>
    </div>
  );
}

function Frame6() {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0 w-[354px]">
      <Frame7 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="bg-[#764d2f] h-[191px] relative rounded-[16px] shrink-0 w-full">
      <div className="flex flex-col items-center justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-center justify-center p-[28px] relative size-full">
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

export default function Frame4() {
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-start justify-center relative size-full">
      <Frame9 />
      <Frame8 />
      <Frame5 />
    </div>
  );
}