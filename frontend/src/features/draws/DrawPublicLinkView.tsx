import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import svgPaths from '@/icons/draw-public-link';
import imgProperty from '@/assets/e9d78759a04046f1991fda88e44b64c28f7e866d.png';

/* ═══════════════════════════════════════════════════════════════════ */
/*  Mock Data                                                        */
/* ═══════════════════════════════════════════════════════════════════ */

const DRAW_DATA = {
  propertyName: 'Westlake Commons',
  address: '2847 Westlake Drive, Austin, TX',
  drawNumber: 'Draw #1',
  title: 'Land & Site Work',
  totalAmount: 1616000,
  requestDate: '2025-10-10',
  lender: 'First National Capital',
  categories: 3,
  budgetDrawn: '58% of total',
  stepper: [
    { label: 'Created', date: '2025-10-10', completed: true },
    { label: 'Submitted', date: '2025-10-12', completed: true },
    { label: 'Approved', date: '2025-10-18', completed: true },
    { label: 'Funded', date: '2025-10-22', completed: true },
  ],
  lineItems: [
    { category: 'Land', subcategory: '100% of budget', budget: 865000, previousDraws: 0, thisDraw: 865000, complete: 100 },
    { category: 'Site Work', subcategory: '100% of budget', budget: 430000, previousDraws: 0, thisDraw: 261000, complete: 61 },
    { category: 'Financing', subcategory: '', budget: 800000, previousDraws: 0, thisDraw: 570000, complete: 71 },
  ],
  budgetTracker: [
    { name: 'Site Work', value: 430000, color: '#764D2F' },
    { name: 'Financing', value: 800000, color: '#A67B5B' },
    { name: 'Land', value: 865000, color: '#C7AF97' },
    { name: 'Site Work', value: 261000, color: '#D9C4B0' },
    { name: 'Soft Costs', value: 340000, color: '#E5D7C8' },
    { name: 'Building Hard Costs', value: 8470000, color: '#EFE6DB' },
    { name: 'Soft Costs', value: 2026000, color: '#F5EEE7' },
    { name: 'Contingency', value: 75000, color: '#F9F5F0' },
  ],
  budgetLines: [
    { category: 'Site Work', amount: 430000 },
    { category: 'Fully drawn', amount: 430000 },
    { category: 'Land', amount: 865000 },
    { category: 'Fully drawn', amount: 865000 },
    { category: 'Financing', amount: 900000 },
    { category: '50% drawn', amount: 340000 },
    { category: 'Building Hard Costs', amount: 8470000 },
    { category: 'Soft Costs', amount: 2026000 },
    { category: 'Contingency', amount: 75000 },
  ],
  documents: [
    { name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', uploaded: '2025-10-10' },
    { name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', uploaded: '2025-10-10' },
    { name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', uploaded: '2025-10-10' },
  ],
  notes: 'Initial draw covering land acquisition, preliminary site work, and financing costs.',
};

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Component                                                   */
/* ═══════════════════════════════════════════════════════════════════ */

export function DrawPublicLinkView() {
  const totalBudget = DRAW_DATA.budgetTracker.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="min-h-screen bg-[#F8F6F1]">
      {/* Dark Brown Header */}
      <div className="bg-[#3e2d1d] content-stretch flex flex-col items-start pb-[80px] pt-[40px] px-4 sm:px-8 md:px-12 lg:px-[80px] w-full">
        <div className="content-stretch flex flex-col gap-[60px] items-center relative shrink-0 w-full max-w-[1352px] mx-auto">
          {/* Top Bar: Logo + Buttons */}
          <div className="content-stretch flex flex-col sm:flex-row items-start sm:items-center justify-between relative shrink-0 w-full gap-4">
            <p className="font-['Cormorant_Garamond',sans-serif] leading-[32.146px] not-italic relative shrink-0 text-[32.78px] text-center text-white tracking-[1.3112px] whitespace-nowrap">
              ANKR
            </p>
            <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
              {/* Print Button */}
              <button className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <div aria-hidden="true" className="absolute border-[1.5px] border-solid border-white inset-0 pointer-events-none rounded-[8px]" />
                <div className="relative shrink-0 size-[24px]">
                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p3534d100} fill="white" />
                  </svg>
                </div>
                <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap hidden sm:block" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Print
                </p>
              </button>
              {/* Read Only Badge */}
              <div className="bg-[rgba(255,239,223,0.4)] content-stretch flex gap-[10px] items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
                <div className="overflow-clip relative shrink-0 size-[24px]">
                  <div className="absolute inset-[20.83%_8.33%]">
                    <div className="absolute inset-[-5.36%_-3.75%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 21.5 15.5">
                        <path d={svgPaths.p1de46000} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        <path d={svgPaths.p32ffcf80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap hidden sm:block" style={{ fontVariationSettings: "'wdth' 100" }}>
                  Read Only
                </p>
              </div>
            </div>
          </div>

          {/* Property Info Section */}
          <div className="content-stretch flex flex-col lg:flex-row gap-[32px] items-start relative shrink-0 w-full">
            {/* Property Image */}
            <div className="h-[261.416px] relative shrink-0 w-full lg:w-[364.015px]">
              <div className="absolute h-[261.416px] left-0 rounded-[14.055px] top-0 w-full lg:w-[364.015px]">
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[14.055px]">
                  <img alt="" className="absolute max-w-none object-cover rounded-[14.055px] size-full" src={imgProperty} />
                  <div className="absolute bg-gradient-to-b from-1/2 from-[rgba(0,0,0,0)] inset-0 rounded-[14.055px] to-[83.871%] to-black" />
                </div>
              </div>
              <p className="absolute font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] left-[16.86px] not-italic text-[25.298px] text-white top-[188.33px] whitespace-nowrap">
                {DRAW_DATA.propertyName}
              </p>
            </div>

            {/* Middle: Draw Info */}
            <div className="flex-1 w-full min-w-0">
              <div className="content-stretch flex gap-[32px] items-start pl-0 lg:pl-[16px] pr-0 lg:pr-[32px] relative w-full">
                <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full lg:w-[477px]">
                  {/* Draw # Badge */}
                  <div className="bg-[rgba(255,239,223,0.1)] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
                    <div aria-hidden="true" className="absolute border border-[#ffbf7e] border-solid inset-0 pointer-events-none rounded-[100px]" />
                    <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffbf7e] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                      {DRAW_DATA.drawNumber}
                    </p>
                  </div>

                  {/* Title + Address */}
                  <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                      <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic relative shrink-0 text-[48px] text-white w-full">
                        {DRAW_DATA.title}
                      </p>
                      <div className="content-stretch flex gap-[6px] items-center justify-center relative shrink-0">
                        <div className="overflow-clip relative shrink-0 size-[20px]">
                          <div className="absolute inset-[8.33%_12.5%_9.64%_12.5%]">
                            <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.4049">
                              <path clipRule="evenodd" d={svgPaths.p36ed300} fill="#FFB680" fillRule="evenodd" />
                              <path clipRule="evenodd" d={svgPaths.p12b38500} fill="#FFB680" fillRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                        <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                          {DRAW_DATA.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Stepper */}
                  <div className="content-stretch flex items-start justify-center relative shrink-0 w-full overflow-x-auto">
                    <div className="content-stretch flex items-start justify-center relative shrink-0">
                      {DRAW_DATA.stepper.map((step, idx) => (
                        <div key={idx} className="content-stretch flex items-start relative shrink-0">
                          {/* Step */}
                          <div className="content-stretch flex flex-col gap-[7.31px] items-center relative shrink-0">
                            <div className="relative shrink-0 size-[40.204px]">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40.2048 40.2045">
                                <circle cx="20.1027" cy="20.1022" r="19.1884" stroke="white" strokeWidth="1.82747" />
                                {step.completed && (
                                  <path d="M13.3505 20.5444L17.548 24.7419L25.9429 15.7473" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.97024" />
                                )}
                              </svg>
                            </div>
                            <div className="content-stretch flex flex-col font-['Montserrat',sans-serif] font-medium gap-[5.318px] items-center leading-[normal] relative shrink-0 text-center">
                              <p className="relative shrink-0 text-[16px] text-white whitespace-nowrap">{step.label}</p>
                              <p className="relative shrink-0 text-[#ffb680] text-[14px] whitespace-nowrap">{step.date}</p>
                            </div>
                          </div>
                          {/* Trail */}
                          {idx < DRAW_DATA.stepper.length - 1 && (
                            <div className="content-stretch flex flex-col items-start pb-[13.706px] pt-[18.275px] relative shrink-0 w-[61.525px]">
                              <div className="bg-[#d3b597] h-[1.827px] shrink-0 w-full" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Total Amount */}
                <div className="content-stretch hidden xl:flex flex-col items-end justify-center min-h-[186px] relative text-center whitespace-nowrap ml-auto">
                  <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                    Total Draw Amount
                  </p>
                  <p className="font-['SF_Pro',sans-serif] font-bold leading-[61px] relative shrink-0 text-[48px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
                    ${(DRAW_DATA.totalAmount / 1000).toFixed(0)},000
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Total Amount - Mobile */}
          <div className="xl:hidden content-stretch flex flex-col items-center justify-center relative text-center whitespace-nowrap w-full">
            <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#ffb680] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>
              Total Draw Amount
            </p>
            <p className="font-['SF_Pro',sans-serif] font-bold leading-[61px] relative shrink-0 text-[48px] text-white" style={{ fontVariationSettings: "'wdth' 100" }}>
              ${(DRAW_DATA.totalAmount / 1000).toFixed(0)},000
            </p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="content-stretch flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-[80px] py-[40px] relative w-full">
        <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full max-w-[1352px]">
          {/* Info Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px] w-full">
            <InfoCard icon="wallet" label="Request Date" value={DRAW_DATA.requestDate} />
            <InfoCard icon="bank" label="Lender" value={DRAW_DATA.lender} />
            <InfoCard icon="layers" label="Categories" value={`${DRAW_DATA.categories} categories`} />
            <InfoCard icon="percent" label="Budget Drawn" value={DRAW_DATA.budgetDrawn} />
          </div>

          {/* Draw Line Items */}
          <DrawLineItemsCard lineItems={DRAW_DATA.lineItems} />

          {/* Standard Draw Package */}
          <StandardDrawPackageCard />

          {/* Budget Tracker */}
          <BudgetTrackerCard data={DRAW_DATA.budgetTracker} lines={DRAW_DATA.budgetLines} totalBudget={totalBudget} />

          {/* Supporting Documents */}
          <SupportingDocumentsCard documents={DRAW_DATA.documents} />

          {/* Notes */}
          <NotesCard notes={DRAW_DATA.notes} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Info Card Component                                              */
/* ═══════════════════════════════════════════════════════════════════ */

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  const getIcon = () => {
    switch (icon) {
      case 'wallet':
        return (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 15.75">
            <path d={svgPaths.pc6b3970} fill="#764D2F" />
            <path d={svgPaths.p4011680} fill="#764D2F" />
            <path clipRule="evenodd" d={svgPaths.p112cca80} fill="#764D2F" fillRule="evenodd" />
            <path d={svgPaths.p2a67df0} fill="#764D2F" />
          </svg>
        );
      case 'bank':
        return (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8994 14.8984">
            <path clipRule="evenodd" d={svgPaths.p74d3600} fill="#764D2F" fillRule="evenodd" />
            <path d={svgPaths.p292c4700} fill="#764D2F" />
            <path d={svgPaths.p72e8a00} fill="#764D2F" />
          </svg>
        );
      case 'layers':
        return (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8994 14.8984">
            <path clipRule="evenodd" d={svgPaths.p74d3600} fill="#764D2F" fillRule="evenodd" />
            <path d={svgPaths.p292c4700} fill="#764D2F" />
            <path d={svgPaths.p72e8a00} fill="#764D2F" />
          </svg>
        );
      case 'percent':
        return (
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6.5625 14.9501">
            <path d={svgPaths.p385cc600} fill="#764D2F" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white relative rounded-[16px] self-stretch">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[28px] py-[20px] relative size-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative w-full">
            <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
              <div className="overflow-clip relative shrink-0 size-[21px]">
                <div className="absolute inset-[8.33%_8.33%_16.67%_8.33%]">
                  {getIcon()}
                </div>
              </div>
            </div>
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                {label}
              </p>
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <p className="font-['SF_Pro','Noto_Sans:Bold',sans-serif] font-bold leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                  {value}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Draw Line Items Card                                             */
/* ═══════════════════════════════════════════════════════════════════ */

function DrawLineItemsCard({ lineItems }: { lineItems: any[] }) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[28px] whitespace-nowrap">
          Draw Line Items
        </p>
        
        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b border-[#E8E4DD]">
                <th className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-left pb-[16px] pr-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>CATEGORY</th>
                <th className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-right pb-[16px] pr-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>BUDGET</th>
                <th className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-right pb-[16px] pr-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>PREV. DRAWS</th>
                <th className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-right pb-[16px] pr-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>THIS DRAW</th>
                <th className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[12px] text-right pb-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>% COMPLETE</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, idx) => (
                <tr key={idx} className="border-b border-[#F8F6F1] last:border-0">
                  <td className="py-[20px] pr-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>{item.category}</p>
                      {item.subcategory && (
                        <p className="font-['SF_Pro',sans-serif] text-[#8C8780] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>{item.subcategory}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-[20px] pr-[16px] text-right">
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>${item.budget.toLocaleString()}</p>
                  </td>
                  <td className="py-[20px] pr-[16px] text-right">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>${item.previousDraws.toLocaleString()}</p>
                  </td>
                  <td className="py-[20px] pr-[16px] text-right">
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>${item.thisDraw.toLocaleString()}</p>
                  </td>
                  <td className="py-[20px] text-right">
                    <p className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>{item.complete}%</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Standard Draw Package Card                                       */
/* ═══════════════════════════════════════════════════════════════════ */

function StandardDrawPackageCard() {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[32px] relative w-full">
        <div className="content-stretch flex items-center gap-[12px] relative shrink-0">
          <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
            <div className="relative shrink-0 size-[21px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 16.9297">
                <path d={svgPaths.p270d0200} fill="#764D2F" />
              </svg>
            </div>
          </div>
          <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[20px] whitespace-nowrap">
            Standard Draw Package
          </p>
        </div>
        <p className="font-['SF_Pro',sans-serif] leading-[21px] relative shrink-0 text-[#8C8780] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          Most common package for residential or multi-family projects
        </p>
        <div className="flex flex-wrap gap-[12px]">
          <div className="bg-[#fcf6f0] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              AIA G702 Cover Sheet
            </p>
          </div>
          <div className="bg-[#fcf6f0] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Schedule of Values (SOV)
            </p>
          </div>
          <div className="bg-[#FFB680] content-stretch flex items-center justify-center px-[16px] py-[8px] relative rounded-[100px] shrink-0">
            <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-white text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Contractor invoices
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Budget Tracker Card                                              */
/* ═══════════════════════════════════════════════════════════════════ */

function BudgetTrackerCard({ data, lines, totalBudget }: { data: any[]; lines: any[]; totalBudget: number }) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="content-stretch flex flex-col gap-[32px] items-start p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[28px] whitespace-nowrap">
          Budget Tracker
        </p>

        <div className="flex flex-col lg:flex-row gap-[32px] w-full items-start">
          {/* Donut Chart */}
          <div className="relative shrink-0 w-full lg:w-[280px] h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={90}
                  outerRadius={130}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-['SF_Pro',sans-serif] font-[510] text-[#8C8780] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>Total Budget</p>
              <p className="font-['SF_Pro',sans-serif] font-bold text-[#3E2D1D] text-[32px]" style={{ fontVariationSettings: "'wdth' 100" }}>${(totalBudget / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          {/* Budget Lines */}
          <div className="flex-1 w-full min-w-0">
            <div className="flex flex-col gap-[16px] w-full">
              {lines.map((line, idx) => {
                const isCategory = idx % 2 === 0;
                return (
                  <div key={idx} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-[12px]">
                      {isCategory && <div className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: data[Math.floor(idx / 2)]?.color || '#E5D7C8' }} />}
                      <p className={`font-['SF_Pro',sans-serif] ${isCategory ? 'font-bold' : 'font-normal'} text-[#${isCategory ? '3E2D1D' : '8C8780'}] text-[14px] ${isCategory ? '' : 'pl-[24px]'}`} style={{ fontVariationSettings: "'wdth' 100" }}>
                        {line.category}
                      </p>
                    </div>
                    <p className={`font-['SF_Pro',sans-serif] ${isCategory ? 'font-bold' : 'font-[510]'} text-[#3E2D1D] text-[14px]`} style={{ fontVariationSettings: "'wdth' 100" }}>
                      ${line.amount.toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Supporting Documents Card                                        */
/* ═══════════════════════════════════════════════════════════════════ */

function SupportingDocumentsCard({ documents }: { documents: any[] }) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="content-stretch flex flex-col gap-[24px] items-start p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[28px] whitespace-nowrap">
          Supporting Documents
        </p>

        <div className="flex flex-col gap-[16px] w-full">
          {documents.map((doc, idx) => (
            <div key={idx} className="bg-[#FAFAFA] relative rounded-[12px] w-full">
              <div className="content-stretch flex items-center justify-between px-[20px] py-[16px] relative w-full">
                <div className="flex items-center gap-[16px]">
                  <div className="relative shrink-0 size-[36px]">
                    <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 36 36">
                      <rect fill="#F3EFE6" height="36" rx="4" width="36" />
                      <svg x="8" y="8" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d={svgPaths.p148d9a00} fill="#764D2F" />
                        <path clipRule="evenodd" d={svgPaths.p8e79d80} fill="#764D2F" fillRule="evenodd" />
                      </svg>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-[4px]">
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#3E2D1D] text-[16px]" style={{ fontVariationSettings: "'wdth' 100" }}>{doc.name}</p>
                    <p className="font-['SF_Pro',sans-serif] text-[#8C8780] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
                      PDF · {doc.size} · Uploaded {doc.uploaded}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <button className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors">
                    <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    <div className="relative shrink-0 size-[16px]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path d={svgPaths.p16e43a80} stroke="#764D2F" strokeWidth="1.125" />
                        <path d={svgPaths.p123590f0} stroke="#764D2F" strokeWidth="1.125" />
                      </svg>
                    </div>
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764D2F] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>View</p>
                  </button>
                  <button className="bg-white content-stretch flex gap-[8px] items-center justify-center px-[16px] py-[8px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors">
                    <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    <div className="relative shrink-0 size-[16px]">
                      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                        <path d={svgPaths.p1b7d8060} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12" />
                      </svg>
                    </div>
                    <p className="font-['SF_Pro',sans-serif] font-[510] text-[#764D2F] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>Download</p>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Notes Card                                                       */
/* ═══════════════════════════════════════════════════════════════════ */

function NotesCard({ notes }: { notes: string }) {
  return (
    <div className="bg-white relative rounded-[20px] w-full">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="content-stretch flex flex-col gap-[16px] items-start p-[32px] relative w-full">
        <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] not-italic relative shrink-0 text-[#3e2d1d] text-[28px] whitespace-nowrap">
          Notes
        </p>
        <p className="font-['SF_Pro',sans-serif] leading-[21px] relative text-[#3E2D1D] text-[14px]" style={{ fontVariationSettings: "'wdth' 100" }}>
          {notes}
        </p>
      </div>
    </div>
  );
}
