import svgPaths from "./svg-mek2toe8bl";
import imgImage from "@/assets/4f3d3d31e8f035df10a1a48ab89d7f060cac4fe0.png";

function Paragraph() {
  return (
    <div className="h-[42px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Inter',sans-serif] font-normal leading-[42px] left-0 not-italic text-[#3e2d1d] text-[28px] top-px whitespace-nowrap">Document Vault</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[21px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['SF_Pro',sans-serif] font-[510] leading-[21px] left-0 text-[#8c8780] text-[14px] top-[2px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Securely upload, organize, and share your financial documents.
      </p>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[67px] relative shrink-0 w-[428px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start relative size-full">
        <Paragraph />
        <Paragraph1 />
      </div>
    </div>
  );
}

function Icon() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d="M8 6.66667V10.6667" id="Vector" stroke="var(--stroke-0, #3E2D1D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M6 8.66667H10" id="Vector_2" stroke="var(--stroke-0, #3E2D1D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p1f315b00} id="Vector_3" stroke="var(--stroke-0, #3E2D1D)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Text() {
  return (
    <div className="flex-[1_0_0] h-[21px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[21px] left-[38.5px] not-italic text-[#3e2d1d] text-[14px] text-center top-0 tracking-[-0.1504px] whitespace-nowrap">New Folder</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="flex-[1_0_0] h-[40px] min-h-px min-w-px relative rounded-[8px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center px-[17.5px] py-[1.5px] relative size-full">
          <Icon />
          <Text />
        </div>
      </div>
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[20px] size-[16px] top-[12px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="Icon">
          <path d={svgPaths.p23ad1400} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d={svgPaths.p26e09a00} id="Vector_2" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
          <path d="M8 2V10" id="Vector_3" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="bg-[#3e2d1d] h-[40px] relative rounded-[8px] shrink-0 w-[111.914px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon1 />
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[21px] left-[68px] not-italic text-[14px] text-center text-white top-[9.5px] tracking-[-0.1504px] whitespace-nowrap">Upload</p>
      </div>
    </div>
  );
}

function Container3() {
  return (
    <div className="h-[40px] relative shrink-0 w-[257.094px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
        <Button />
        <Button1 />
      </div>
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute content-stretch flex h-[67px] items-end justify-between left-[58px] top-[40px] w-[1136px]" data-name="Container">
      <Container2 />
      <Container3 />
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p3a382d00} id="Vector" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p678c080} id="Vector_2" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 6.75H6" id="Vector_3" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 9.75H6" id="Vector_4" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M12 12.75H6" id="Vector_5" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container6() {
  return (
    <div className="bg-[#f3efe6] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon2 />
      </div>
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-[21px] top-[21px] w-[230px]" data-name="Container">
      <Container6 />
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="absolute h-[30px] left-[21px] top-[63px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['Inter',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#3e2d1d] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="absolute h-[18px] left-[21px] top-[95px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['SF_Pro',sans-serif] font-[510] leading-[18px] left-0 text-[#8c8780] text-[12px] top-[1.5px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Total Documents
      </p>
    </div>
  );
}

function Cc() {
  return (
    <div className="bg-white col-1 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="cc">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Container5 />
      <Paragraph2 />
      <Paragraph3 />
    </div>
  );
}

function Group() {
  return (
    <div className="absolute inset-[13.54%_10.35%_13.54%_9.38%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4492 13.125">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p1caf3e80} fill="var(--fill-0, #764D2F)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Lv() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="lv">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group />
      </div>
    </div>
  );
}

function Container8() {
  return (
    <div className="bg-[#f3efe6] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Lv />
      </div>
    </div>
  );
}

function Container7() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-[21px] top-[21px] w-[230px]" data-name="Container">
      <Container8 />
    </div>
  );
}

function Paragraph4() {
  return (
    <div className="absolute h-[30px] left-[21px] top-[63px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['Inter',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#3e2d1d] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0 MB</p>
    </div>
  );
}

function Paragraph5() {
  return (
    <div className="absolute h-[18px] left-[21px] top-[95px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['SF_Pro',sans-serif] font-[510] leading-[18px] left-0 text-[#8c8780] text-[12px] top-[1.5px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Storage Used
      </p>
    </div>
  );
}

function Cc1() {
  return (
    <div className="bg-white col-2 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="cc">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Container7 />
      <Paragraph4 />
      <Paragraph5 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.pe4b0410} id="Vector" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p14e74100} id="Vector_2" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M6 9H12" id="Vector_3" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Container10() {
  return (
    <div className="bg-[#f3efe6] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon3 />
      </div>
    </div>
  );
}

function Container9() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-[21px] top-[21px] w-[230px]" data-name="Container">
      <Container10 />
    </div>
  );
}

function Paragraph6() {
  return (
    <div className="absolute h-[30px] left-[21px] top-[63px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['Inter',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#3e2d1d] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0</p>
    </div>
  );
}

function Paragraph7() {
  return (
    <div className="absolute h-[18px] left-[21px] top-[95px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['SF_Pro',sans-serif] font-[510] leading-[18px] left-0 text-[#8c8780] text-[12px] top-[1.5px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Active Share Links
      </p>
    </div>
  );
}

function Cc2() {
  return (
    <div className="bg-white col-3 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="cc">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Container9 />
      <Paragraph6 />
      <Paragraph7 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_2041_2192)" id="Icon">
          <path d={svgPaths.p2b6c5300} id="Vector" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1bf5c271} fill="var(--fill-0, #764D2F)" id="Vector_2" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_2041_2192">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Container12() {
  return (
    <div className="bg-[#f3efe6] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon4 />
      </div>
    </div>
  );
}

function Container11() {
  return (
    <div className="absolute content-stretch flex h-[32px] items-center left-[21px] top-[21px] w-[230px]" data-name="Container">
      <Container12 />
    </div>
  );
}

function Paragraph8() {
  return (
    <div className="absolute h-[30px] left-[21px] top-[63px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['Inter',sans-serif] font-bold leading-[30px] left-0 not-italic text-[#3e2d1d] text-[20px] top-0 tracking-[-0.4492px] whitespace-nowrap">0 / 7</p>
    </div>
  );
}

function Paragraph9() {
  return (
    <div className="absolute h-[18px] left-[21px] top-[95px] w-[230px]" data-name="Paragraph">
      <p className="absolute font-['SF_Pro',sans-serif] font-[510] leading-[18px] left-0 text-[#8c8780] text-[12px] top-[1.5px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
        Categories
      </p>
    </div>
  );
}

function Cc3() {
  return (
    <div className="bg-white col-4 justify-self-stretch relative rounded-[20px] row-1 self-stretch shrink-0" data-name="cc">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px]" />
      <Container11 />
      <Paragraph8 />
      <Paragraph9 />
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute gap-x-[16px] gap-y-[16px] grid grid-cols-[repeat(4,minmax(0,1fr))] grid-rows-[repeat(1,minmax(0,1fr))] h-[134px] left-[58px] top-[131px] w-[1136px]" data-name="Container">
      <Cc />
      <Cc1 />
      <Cc2 />
      <Cc3 />
    </div>
  );
}

function Fq1() {
  return (
    <div className="h-[47px] relative shrink-0 w-[128.016px]" data-name="FQ">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-medium leading-[21px] left-[64px] not-italic text-[#8c8780] text-[14px] text-center top-[12px] tracking-[-0.1504px] whitespace-nowrap">All Documents</p>
      </div>
    </div>
  );
}

function Fq2() {
  return (
    <div className="h-[47px] relative shrink-0 w-[167.43px]" data-name="FQ">
      <div aria-hidden="true" className="absolute border-[rgba(0,0,0,0)] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-medium leading-[21px] left-[84px] not-italic text-[#8c8780] text-[14px] text-center top-[12px] tracking-[-0.1504px] whitespace-nowrap">Document Packages</p>
      </div>
    </div>
  );
}

function Fq3() {
  return (
    <div className="h-[47px] relative shrink-0 w-[118.789px]" data-name="FQ">
      <div aria-hidden="true" className="absolute border-[#3e2d1d] border-b-2 border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[21px] left-[59px] not-italic text-[#3e2d1d] text-[14px] text-center top-[12px] tracking-[-0.1504px] whitespace-nowrap">Shared Links</p>
      </div>
    </div>
  );
}

function Container13() {
  return (
    <div className="absolute h-[48px] left-[58px] top-[293px] w-[1136px]" data-name="Container">
      <div className="content-stretch flex gap-[4px] items-start overflow-clip pb-px relative rounded-[inherit] size-full">
        <Fq1 />
        <Fq2 />
        <Fq3 />
      </div>
      <div aria-hidden="true" className="absolute border-[#e8e4dd] border-b border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Icon">
          <path d={svgPaths.p1176ebe0} id="Vector" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d={svgPaths.p10b2e490} id="Vector_2" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M8 12H16" id="Vector_3" stroke="var(--stroke-0, #764D2F)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function Container14() {
  return (
    <div className="absolute bg-[#f3efe6] content-stretch flex items-center justify-center left-[539px] px-[16px] rounded-[14px] size-[56px] top-[60px]" data-name="Container">
      <Icon5 />
    </div>
  );
}

function Paragraph10() {
  return (
    <div className="absolute h-[30px] left-[60px] top-[136px] w-[1014px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-normal leading-[30px] left-[507.08px] not-italic text-[#3e2d1d] text-[20px] text-center top-[0.5px] whitespace-nowrap">No shared links</p>
    </div>
  );
}

function Paragraph11() {
  return (
    <div className="absolute h-[42px] left-[387px] top-[174px] w-[360px]" data-name="Paragraph">
      <p className="-translate-x-1/2 absolute font-['SF_Pro',sans-serif] font-[510] leading-[21px] left-[180.47px] text-[#8c8780] text-[14px] text-center top-[2px] w-[341px]" style={{ fontVariationSettings: "'wdth' 100" }}>
        Share documents or packages to generate secure, expiring links.
      </p>
    </div>
  );
}

function Wq() {
  return (
    <div className="absolute bg-white border border-[#d0d0d0] border-solid h-[278px] left-[58px] rounded-[20px] top-[365px] w-[1136px]" data-name="WQ">
      <Container14 />
      <Paragraph10 />
      <Paragraph11 />
    </div>
  );
}

function Fq() {
  return (
    <div className="h-[683px] relative shrink-0 w-full" data-name="FQ">
      <Container1 />
      <Container4 />
      <Container13 />
      <Wq />
    </div>
  );
}

function MainContent() {
  return (
    <div className="absolute content-stretch flex flex-col h-[723px] items-start left-0 overflow-clip top-[89px] w-[1252px]" data-name="Main Content">
      <Fq />
    </div>
  );
}

function Group1() {
  return (
    <div className="absolute inset-[8.31%_8.41%_8.41%_8.31%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3251 13.3244">
        <g id="Group">
          <path d={svgPaths.p35416280} fill="var(--fill-0, #767676)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Af() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="AF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group1 />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="h-[21px] relative shrink-0 w-[43.5px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Figtree',sans-serif] font-normal leading-[21px] left-0 text-[#767676] text-[14px] top-0 whitespace-nowrap">Search</p>
      </div>
    </div>
  );
}

function Container15() {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-[291px]" data-name="Container">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center pl-[13px] pr-px py-px relative size-full">
        <Af />
        <Text1 />
      </div>
    </div>
  );
}

function Sf() {
  return (
    <div className="relative shrink-0 size-[28px]" data-name="SF">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 28 28">
        <g id="SF">
          <path d={svgPaths.p11637200} fill="var(--fill-0, #333333)" id="Vector" />
          <path d={svgPaths.p143ff00} fill="var(--fill-0, #764D2F)" id="Vector_2" />
        </g>
      </svg>
    </div>
  );
}

function Image() {
  return (
    <div className="flex-[1_0_0] h-[38px] min-h-px min-w-px relative rounded-[16777200px]" data-name="Image">
      <img alt="" className="absolute bg-clip-padding border-0 border-[transparent] border-solid inset-0 max-w-none object-cover pointer-events-none rounded-[16777200px] size-full" src={imgImage} />
    </div>
  );
}

function Container16() {
  return (
    <div className="h-[38px] relative shrink-0 w-[82px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[16px] items-center relative size-full">
        <Sf />
        <Image />
      </div>
    </div>
  );
}

function Header() {
  return (
    <div className="absolute bg-[#fcf5ed] content-stretch flex h-[89px] items-center justify-between left-0 px-[58px] top-0 w-[1252px]" data-name="Header">
      <Container15 />
      <Container16 />
    </div>
  );
}

function Container() {
  return (
    <div className="flex-[1252_0_0] h-[812px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <MainContent />
        <Header />
      </div>
    </div>
  );
}

function Pf() {
  return (
    <div className="absolute bg-gradient-to-b content-stretch flex from-[#fcf5ed] h-[812px] items-start left-0 pl-[260px] to-[#ded0c3] to-[160.46%] top-0 w-[1512px]" data-name="PF">
      <Container />
    </div>
  );
}

function Paragraph12() {
  return (
    <div className="h-[49.5px] relative shrink-0 w-[100.531px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter',sans-serif] font-bold leading-[49.5px] left-0 not-italic text-[#f3dbbc] text-[33px] top-[0.5px] tracking-[1.3px] whitespace-nowrap">ANKR</p>
      </div>
    </div>
  );
}

function Df() {
  return (
    <div className="h-[36px] relative shrink-0 w-[37px]" data-name="DF">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 37 36">
        <g id="DF">
          <path clipRule="evenodd" d={svgPaths.p1421a800} fill="var(--fill-0, #F3DBBC)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Container17() {
  return (
    <div className="h-[89px] relative shrink-0 w-[260px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(117,77,47,0.5)] border-b border-solid inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-between pb-px px-[34px] relative size-full">
        <Paragraph12 />
        <Df />
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute inset-[8.33%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p316bfb80} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector" />
          <path clipRule="evenodd" d={svgPaths.p37c43800} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_2" />
          <path clipRule="evenodd" d={svgPaths.p11e38bb0} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p221cf180} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function BF() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="bF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group2 />
      </div>
    </div>
  );
}

function Mb1() {
  return (
    <div className="h-[24px] relative shrink-0 w-[69.531px]" data-name="mb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#fcf6f0] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Overview</p>
      </div>
    </div>
  );
}

function Link() {
  return (
    <div className="h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pl-[18px] relative size-full">
          <BF />
          <Mb1 />
        </div>
      </div>
    </div>
  );
}

function Group3() {
  return (
    <div className="absolute inset-[9.38%_7.32%_9.38%_5%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.0427 19.5">
        <g id="Group">
          <path d={svgPaths.p3a1a0700} fill="var(--fill-0, #FCF6F0)" id="Vector" />
          <path d={svgPaths.p39cd280} fill="var(--fill-0, #FCF6F0)" id="Vector_2" />
          <path d={svgPaths.p2698c880} fill="var(--fill-0, #FCF6F0)" id="Vector_3" />
          <path d={svgPaths.p3e663f00} fill="var(--fill-0, #FCF6F0)" id="Vector_4" />
          <path d={svgPaths.p14587d70} fill="var(--fill-0, #FCF6F0)" id="Vector_5" />
          <path d={svgPaths.p128ecd80} fill="var(--fill-0, #FCF6F0)" id="Vector_6" />
          <path d={svgPaths.p163baa70} fill="var(--fill-0, #FCF6F0)" id="Vector_7" />
          <path d={svgPaths.p2abc1480} fill="var(--fill-0, #FCF6F0)" id="Vector_8" />
          <path clipRule="evenodd" d={svgPaths.p283d9a80} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_9" />
          <path clipRule="evenodd" d={svgPaths.p327e5d40} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_10" />
        </g>
      </svg>
    </div>
  );
}

function WF() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="wF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group3 />
      </div>
    </div>
  );
}

function Mb2() {
  return (
    <div className="h-[24px] relative shrink-0 w-[77.195px]" data-name="mb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#fcf6f0] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Properties</p>
      </div>
    </div>
  );
}

function Link1() {
  return (
    <div className="h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pl-[18px] relative size-full">
          <WF />
          <Mb2 />
        </div>
      </div>
    </div>
  );
}

function Group4() {
  return (
    <div className="absolute inset-[13.54%_10.35%_13.54%_9.38%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.2656 17.5">
        <g id="Group">
          <path clipRule="evenodd" d={svgPaths.p9300b00} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Cf() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="CF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group4 />
      </div>
    </div>
  );
}

function Mb3() {
  return (
    <div className="h-[24px] relative shrink-0 w-[85.07px]" data-name="mb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#fcf6f0] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">Documents</p>
      </div>
    </div>
  );
}

function Link2() {
  return (
    <div className="bg-[#764d2f] h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pl-[18px] relative size-full">
          <Cf />
          <Mb3 />
        </div>
      </div>
    </div>
  );
}

function Group5() {
  return (
    <div className="absolute inset-[9.38%_17.71%]" data-name="Group">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 19.5">
        <g id="Group">
          <path d={svgPaths.p21d23180} fill="var(--fill-0, #FCF6F0)" id="Vector" />
          <path d={svgPaths.p919200} fill="var(--fill-0, #FCF6F0)" id="Vector_2" />
          <path d={svgPaths.p33653100} fill="var(--fill-0, #FCF6F0)" id="Vector_3" />
          <path clipRule="evenodd" d={svgPaths.p2f3a4040} fill="var(--fill-0, #FCF6F0)" fillRule="evenodd" id="Vector_4" />
        </g>
      </svg>
    </div>
  );
}

function Nf() {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="NF">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <Group5 />
      </div>
    </div>
  );
}

function Mb4() {
  return (
    <div className="h-[24px] relative shrink-0 w-[29.172px]" data-name="mb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter',sans-serif] font-medium leading-[24px] left-0 not-italic text-[#fcf6f0] text-[16px] top-[-0.5px] tracking-[-0.3125px] whitespace-nowrap">PFS</p>
      </div>
    </div>
  );
}

function Link3() {
  return (
    <div className="h-[52px] relative rounded-[8px] shrink-0 w-full" data-name="Link">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center pl-[18px] relative size-full">
          <Nf />
          <Mb4 />
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[723_0_0] min-h-px min-w-px relative w-[260px]" data-name="Navigation">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start pt-[25px] px-[13px] relative size-full">
        <Link />
        <Link1 />
        <Link2 />
        <Link3 />
      </div>
    </div>
  );
}

function Mb() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[260px]" data-name="mb">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Container17 />
        <Navigation />
      </div>
    </div>
  );
}

function Pf1() {
  return (
    <div className="absolute bg-[#3e2d1d] content-stretch flex flex-col h-[812px] items-start left-0 top-0 w-[260px]" data-name="PF">
      <Mb />
    </div>
  );
}

function Paragraph13() {
  return (
    <div className="h-[36px] relative shrink-0 w-[122.711px]" data-name="Paragraph">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Canela_Text_Trial',sans-serif] leading-[normal] left-0 not-italic text-[#3e2d1d] text-[24px] top-0 whitespace-nowrap">New Folder</p>
      </div>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d="M13.5 4.5L4.5 13.5" id="Vector" stroke="var(--stroke-0, #8C8780)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M4.5 4.5L13.5 13.5" id="Vector_2" stroke="var(--stroke-0, #8C8780)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="relative rounded-[8px] shrink-0 size-[32px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[7px] relative size-full">
        <Icon6 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="absolute content-stretch flex h-[36px] items-center justify-between left-[24px] top-[24px] w-[372px]" data-name="Container">
      <Paragraph13 />
      <Button2 />
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">e.g. Texas Properties</p>
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
    <div className="content-stretch flex gap-[10px] items-center relative shrink-0">
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">Identity</p>
    </div>
  );
}

function LsiconRightFilled() {
  return (
    <div className="relative shrink-0 size-[16px]" data-name="lsicon:right-filled">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <g id="lsicon:right-filled">
          <path clipRule="evenodd" d={svgPaths.p22c4cb00} fill="var(--fill-0, #767676)" fillRule="evenodd" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
      <Frame5 />
      <LsiconRightFilled />
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
      <p className="font-['Figtree',sans-serif] font-normal leading-[21px] relative shrink-0 text-[#767676] text-[14px] whitespace-nowrap">What goes in this folder?</p>
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

function Container20() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[14px] h-[220px] items-start left-[24px] top-[80px] w-[372px]" data-name="Container">
      <div className="relative shrink-0 w-full" data-name="Text field (white)">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative w-full">
          <p className="font-['SF_Pro',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            Folder Name
          </p>
          <Frame />
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Text field (white)">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative w-full">
          <p className="font-['SF_Pro',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            Category
          </p>
          <Frame3 />
        </div>
      </div>
      <div className="relative shrink-0 w-full" data-name="Text field (white)">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[6px] items-start relative w-full">
          <p className="font-['SF_Pro',sans-serif] font-normal leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
            Description (Optional)
          </p>
          <Frame6 />
        </div>
      </div>
    </div>
  );
}

function Button3() {
  return (
    <div className="h-[40px] relative rounded-[8px] shrink-0 w-[89.211px]" data-name="Button">
      <div aria-hidden="true" className="absolute border-[#d0d0d0] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[21px] left-[45px] not-italic text-[#3e2d1d] text-[14px] text-center top-[9.5px] tracking-[-0.1504px] whitespace-nowrap">Cancel</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div className="bg-[#c5c0b9] h-[40px] relative rounded-[8px] shrink-0 w-[139.352px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[21px] left-[70px] not-italic text-[14px] text-center text-white top-[9.5px] tracking-[-0.1504px] whitespace-nowrap">Create Folder</p>
      </div>
    </div>
  );
}

function Container21() {
  return (
    <div className="absolute content-stretch flex gap-[10px] h-[40px] items-start justify-end left-[24px] top-[324px] w-[372px]" data-name="Container">
      <Button3 />
      <Button4 />
    </div>
  );
}

function ZQ() {
  return (
    <div className="bg-white h-[388px] relative rounded-[20px] shrink-0 w-[420px]" data-name="zQ">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Container19 />
        <Container20 />
        <Container21 />
      </div>
    </div>
  );
}

function Container18() {
  return (
    <div className="absolute bg-[rgba(0,0,0,0.4)] content-stretch flex h-[812px] items-center justify-center left-0 px-[546px] top-0 w-[1512px]" data-name="Container">
      <ZQ />
    </div>
  );
}

export default function ProfessionalMultiStepOnboardingForm() {
  return (
    <div className="bg-[#f8f6f1] relative size-full" data-name="Ankr">
      <Pf />
      <Pf1 />
      <Container18 />
    </div>
  );
}