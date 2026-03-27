import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp, formatCurrency } from '../../context/AppContext';
import type { ProForma, ExitStrategy } from '../../context/AppContext';
import svgPaths from '../../../imports/svg-22tyinewy3';

/* ─── Figma-exact class fragments ────────────────────────────── */
const sfMed = "font-['SF_Pro',sans-serif] font-[510]";
const sfReg = "font-['SF_Pro',sans-serif] font-normal";
const sfSemi = "font-['SF_Pro',sans-serif] font-[590]";
const sfBold = "font-['SF_Pro',sans-serif] font-bold";
const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const figtree = "font-['Figtree',sans-serif] font-normal";
const wdth: React.CSSProperties = { fontVariationSettings: "'wdth' 100" };

const STRATEGIES: { id: ExitStrategy; label: string }[] = [
  { id: 'Fix & Flip', label: 'Fix & Flip' },
  { id: 'BRRRR', label: 'BRRRR' },
  { id: 'Hold & Rent', label: 'Hold & Rent' },
  { id: 'Wholesale', label: 'Wholesale' },
  { id: 'Development', label: 'Development' },
];

function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return formatCurrency(n);
}

/* ─── SVG Icons ──────────────────────────────────────────────── */

function EditIcon() {
  return (
    <div className="relative shrink-0 size-[16.536px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5355 16.5355">
        <path clipRule="evenodd" d={svgPaths.p22c0000} fill="var(--fill-0, #3E2D1D)" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function IcRoundExpandLess() {
  return (
    <div className="relative size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p7e66880} fill="var(--fill-0, #764D2F)" />
      </svg>
    </div>
  );
}

function IconoirCancel() {
  return (
    <div className="relative shrink-0 size-[24px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <path d={svgPaths.p36250880} stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <div className="h-[10.643px] relative shrink-0 w-[15.5px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.5 10.6426">
        <path d={svgPaths.p3981cc70} fill="var(--fill-0, white)" />
      </svg>
    </div>
  );
}

/* ─── Reusable sub-components ────────────────────────────────── */

function FigmaInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="bg-white h-[46px] relative rounded-[8px] shrink-0 w-full">
      <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex items-center px-[12px] py-[10px] relative size-full">
          <div className="content-stretch flex flex-1 items-center min-h-px min-w-px relative">
            <input
              type="text"
              value={value}
              onChange={e => onChange(e.target.value)}
              className={`${figtree} leading-[21px] relative shrink-0 text-[#767676] text-[14px] w-full bg-transparent outline-none border-none p-0 m-0`}
            />
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
    </div>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-1 flex-row items-center self-stretch">
      <div className="bg-[#fafafa] flex-1 h-full min-h-px min-w-px relative rounded-[16px]">
        <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
          <div className="content-stretch flex items-center px-[28px] py-[12px] relative size-full">
            <div className="content-stretch flex flex-1 flex-col items-start justify-center min-h-px min-w-px relative">
              <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[12px] w-full`} style={wdth}>{label}</p>
                <p className={`${sfSemi} relative shrink-0 text-[#3e2d1d] text-[20px] w-full`} style={wdth}>{value}</p>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#ececec] border-solid inset-0 pointer-events-none rounded-[16px]" />
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${sfReg} leading-[normal] relative shrink-0 text-[#333] text-[14px] w-full`} style={wdth}>{children}</p>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-stretch flex gap-[10px] items-start justify-end relative shrink-0 w-full">
      <p className={`flex-[1_0_0] ${canela} leading-[normal] min-h-px min-w-px relative text-[#3e2d1d] text-[24px]`}>{children}</p>
      <IconoirCancel />
    </div>
  );
}

/* ─── Main Page ──────────────────────────────────────────────── */

export function EditProFormaPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, updateProForma } = useApp();
  const property = state.properties.find(p => p.id === id);

  const [pf, setPf] = useState<ProForma | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (property) setPf({ ...property.proforma });
  }, [property]);

  if (!property || !pf) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>Property not found</p>
      </div>
    );
  }

  const set = (key: keyof ProForma, val: string | number) => {
    setPf(prev => prev ? { ...prev, [key]: val } : prev);
    setSaved(false);
  };

  const parseMoney = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
  const fmtInput = (n: number) => (n > 0 ? n.toLocaleString() : '');

  const handleSave = () => {
    if (!pf) return;
    updateProForma(property.id, pf);
    setSaved(true);
    setTimeout(() => navigate(`/dashboard/properties/${property.id}?tab=proforma`), 600);
  };

  /* calculations */
  const totalInvestment = pf.purchasePrice + pf.rehabCost + pf.holdingCosts + pf.financingCosts + pf.softCosts;
  const grossProfit = pf.afterRepairValue - totalInvestment;
  const roi = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
  const equityIn = totalInvestment - pf.loanAmount;
  const cocReturn = equityIn > 0 ? (grossProfit / equityIn) * 100 : roi;
  const ltvRatio = pf.afterRepairValue > 0 ? (pf.loanAmount / pf.afterRepairValue) * 100 : 0;
  const monthlyInterest = pf.loanAmount > 0 ? (pf.loanAmount * (pf.interestRate / 100)) / 12 : 0;
  const profitMargin = pf.afterRepairValue > 0 ? (grossProfit / pf.afterRepairValue) * 100 : 0;

  const costItems = [
    { label: 'Purchase', val: pf.purchasePrice },
    { label: 'Rehab', val: pf.rehabCost },
    { label: 'Holding', val: pf.holdingCosts },
    { label: 'Financing', val: pf.financingCosts },
    { label: 'Soft', val: pf.softCosts },
  ];

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-[58px] pb-[48px]">
      {/* ── Outer flex column: gap-32, items-end ── */}
      <div className="content-stretch flex flex-col gap-[32px] items-end relative shrink-0 w-full pt-[32px]">

        {/* ════ HEADER (breadcrumb + title) ════ */}
        <div className="content-stretch flex items-end justify-between relative shrink-0 w-full">
          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[24px] items-start min-h-px min-w-px relative">
            {/* Breadcrumb */}
            <div className="content-stretch flex items-center relative shrink-0 w-full">
              <button onClick={() => navigate('/dashboard/properties')} className={`${sfMed} cursor-pointer leading-[normal] relative shrink-0 text-[#764d2f] text-[16px] whitespace-nowrap bg-transparent border-none p-0`} style={wdth}>
                Properties
              </button>
              <div className="flex items-center justify-center relative shrink-0 size-[24px]">
                <div className="flex-none rotate-90"><IcRoundExpandLess /></div>
              </div>
              <button onClick={() => navigate(`/dashboard/properties/${property.id}?tab=proforma`)} className={`${sfMed} cursor-pointer leading-[normal] relative shrink-0 text-[#764d2f] text-[16px] whitespace-nowrap bg-transparent border-none p-0`} style={wdth}>
                Pro Forma
              </button>
              <div className="flex items-center justify-center relative shrink-0 size-[24px]">
                <div className="flex-none rotate-90"><IcRoundExpandLess /></div>
              </div>
              <p className={`${sfMed} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap`} style={wdth}>
                Edit Pro Forma
              </p>
            </div>
            {/* Title block */}
            <div className="content-stretch flex flex-col sm:flex-row sm:items-end justify-between relative shrink-0 w-full gap-[16px]">
              <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full sm:w-[417px]">
                <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                  <p className={`${canela} relative shrink-0 text-[#3e2d1d] text-[28px] w-full`}>Edit Pro Forma</p>
                  <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[16px] w-full`} style={wdth}>Update your deal economics</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ TWO-COLUMN CONTENT ════ */}
        <div className="content-stretch flex items-start relative shrink-0 w-full">
          <div className="content-stretch flex flex-col xl:flex-row gap-[16px] items-start justify-end min-h-px min-w-px relative w-full">

            {/* ──── LEFT: Form card ──── */}
            <div className="content-stretch flex flex-col items-start min-h-px min-w-px relative self-stretch w-full xl:flex-1">
              <div className="bg-white flex-[1_0_0] min-h-px min-w-px relative rounded-[20px] w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                <div className="flex flex-col items-end size-full">
                  <div className="content-stretch flex flex-col gap-[42px] items-end p-[24px] relative size-full">

                    {/* Section: Exit Strategy */}
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                      <SectionTitle>Exit Strategy</SectionTitle>
                      <div className="content-stretch flex flex-wrap gap-[12px] lg:gap-[16px] items-start relative shrink-0 w-full">
                        {STRATEGIES.map(s => {
                          const active = pf.exitStrategy === s.id;
                          return (
                            <button
                              key={s.id}
                              onClick={() => set('exitStrategy', s.id)}
                              className="min-h-px min-w-px relative rounded-[8px] cursor-pointer border-none p-0 flex-1 min-w-[120px]"
                              style={{ background: active ? '#fcf6f0' : 'transparent' }}
                            >
                              <div aria-hidden="true" className={`absolute border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px] ${active ? 'border-[#764d2f]' : 'border-[#3e2d1d]'}`} />
                              <div className="flex flex-row items-center justify-center size-full">
                                <div className="content-stretch flex gap-[10px] items-center justify-center px-[28px] py-[12px] relative w-full">
                                  <EditIcon />
                                  <p className={`${sfMed} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] whitespace-nowrap`} style={wdth}>{s.label}</p>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Section: Acquisition & Carrying Costs */}
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                      <SectionTitle>{`Acquisition & Carrying Costs`}</SectionTitle>
                      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                        {/* Purchase + Rehab */}
                        <div className="content-stretch flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                            <FieldLabel>{`Purchase Price `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.purchasePrice)} onChange={v => set('purchasePrice', parseMoney(v))} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                            <FieldLabel>{`Rehab / Construction `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.rehabCost)} onChange={v => set('rehabCost', parseMoney(v))} />
                          </div>
                        </div>
                        {/* Holding + Financing + Soft */}
                        <div className="content-stretch flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>{`Holding Costs `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.holdingCosts)} onChange={v => set('holdingCosts', parseMoney(v))} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>{`Financing Costs `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.financingCosts)} onChange={v => set('financingCosts', parseMoney(v))} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>{`Soft Costs `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.softCosts)} onChange={v => set('softCosts', parseMoney(v))} />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section: Exit Value */}
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                      <SectionTitle>{`Exit Value `}</SectionTitle>
                      <div className="content-stretch flex items-start relative shrink-0 w-full">
                        <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                          <FieldLabel>{`After Repair Value (ARV) `}</FieldLabel>
                          <FigmaInput value={pf.afterRepairValue > 0 ? `$ ${fmtInput(pf.afterRepairValue)}` : ''} onChange={v => set('afterRepairValue', parseMoney(v))} />
                        </div>
                      </div>
                    </div>

                    {/* Section: Financing */}
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                      <SectionTitle>{`Financing `}</SectionTitle>
                      <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                        {/* Lender Name + Email */}
                        <div className="content-stretch flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                            <FieldLabel>{`Lender Name `}</FieldLabel>
                            <FigmaInput value={pf.lenderName} onChange={v => set('lenderName', v)} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative">
                            <FieldLabel>{`Lender Email `}</FieldLabel>
                            <FigmaInput value={pf.lenderEmail || ''} onChange={v => set('lenderEmail', v)} />
                          </div>
                        </div>
                        {/* Loan Amount + Interest + Term */}
                        <div className="content-stretch flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] items-start relative shrink-0 w-full">
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>{`Loan Amount `}</FieldLabel>
                            <FigmaInput value={fmtInput(pf.loanAmount)} onChange={v => set('loanAmount', parseMoney(v))} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>{`Interest Rate (in %) `}</FieldLabel>
                            <FigmaInput value={pf.interestRate > 0 ? String(pf.interestRate) : ''} onChange={v => set('interestRate', parseFloat(v) || 0)} />
                          </div>
                          <div className="content-stretch flex flex-[1_0_0] flex-col gap-[6px] items-start min-h-px min-w-px relative w-full sm:w-auto">
                            <FieldLabel>Loan Term (in months)</FieldLabel>
                            <FigmaInput value={pf.loanTermMonths > 0 ? String(pf.loanTermMonths) : ''} onChange={v => set('loanTermMonths', parseInt(v) || 0)} />
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>

            {/* ──── RIGHT: Sidebar ──── */}
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full xl:w-[352px]">
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">

                {/* Live Analysis */}
                <div className="bg-white content-stretch flex flex-col gap-[16px] items-start p-[24px] relative rounded-[12px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] whitespace-nowrap`}>Live Analysis</p>
                  <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                    <div className="content-stretch flex gap-[16px] h-[70px] items-center relative shrink-0 w-full">
                      <MetricCell label="Gross Profit" value={`${grossProfit >= 0 ? '+' : ''}${compact(grossProfit)}`} />
                      <MetricCell label="ROI" value={`${roi.toFixed(1)}%`} />
                    </div>
                    <div className="content-stretch flex gap-[16px] h-[73px] items-center relative shrink-0 w-full">
                      <MetricCell label="Cash-on-Cash" value={`${cocReturn.toFixed(1)}%`} />
                      <MetricCell label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} />
                    </div>
                    <div className="content-stretch flex gap-[16px] h-[70px] items-center relative shrink-0 w-full">
                      <MetricCell label="LTV Ratio" value={`${ltvRatio.toFixed(1)}%`} />
                      <MetricCell label="Monthly Int." value={compact(monthlyInterest)} />
                    </div>
                  </div>
                </div>

                {/* Cost Mix */}
                <div className="bg-white relative rounded-[20px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-end size-full">
                    <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
                      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                        <div className="content-stretch flex items-center relative shrink-0 w-full">
                          <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] whitespace-nowrap`}>Cost Mix</p>
                        </div>
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                          <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
                            <div className="content-stretch flex flex-col items-start leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
                              {costItems.map(item => (
                                <div key={item.label} className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
                                  <p className={`${sfMed} relative shrink-0`} style={wdth}>{item.label}</p>
                                  <p className={`${sfBold} relative shrink-0`} style={wdth}>{totalInvestment > 0 ? `${Math.round((item.val / totalInvestment) * 100)}%` : '0%'}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financing sidebar */}
                <div className="bg-white relative rounded-[20px] shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                  <div className="flex flex-col items-end size-full">
                    <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
                      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                        <div className="content-stretch flex items-center relative shrink-0 w-full">
                          <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] whitespace-nowrap`}>Financing</p>
                        </div>
                        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                          <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
                            <div className="content-stretch flex flex-col items-start leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
                              <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
                                <p className={`${sfMed} relative shrink-0`} style={wdth}>Strategy</p>
                                <p className={`${sfBold} relative shrink-0`} style={wdth}>{pf.exitStrategy}</p>
                              </div>
                              <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
                                <p className={`${sfMed} relative shrink-0`} style={wdth}>Lender</p>
                                <p className={`${sfBold} relative shrink-0`} style={wdth}>{pf.lenderName || '—'}</p>
                              </div>
                              <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
                                <p className={`${sfMed} relative shrink-0`} style={wdth}>{`Equity Required `}</p>
                                <p className={`${sfBold} relative shrink-0`} style={wdth}>{compact(equityIn)}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ════ SAVE BUTTON ════ */}
        <button
          onClick={handleSave}
          className="bg-[#764d2f] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer border-none hover:bg-[#5c3a22] transition-colors"
        >
          <CheckIcon />
          <p className={`${sfSemi} leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap`} style={wdth}>
            {saved ? 'Saved!' : 'Save Pro Forma'}
          </p>
        </button>

      </div>
    </div>
  );
}