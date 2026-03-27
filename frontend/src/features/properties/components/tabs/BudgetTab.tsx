import React, { useState, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, getDrawnForCategory, genId, formatCurrency } from '@/app/context/AppContext';
import type { BudgetCategory, BudgetLineItem, PropertyBudget } from '@/app/context/AppContext';
import svgPaths from '@/icons/property-budget-tab';

/* ─── Figma-exact style tokens ───────────────────────────────── */
const sfMed   = "font-['SF_Pro',sans-serif] font-[510]";
const sfBold  = "font-['SF_Pro',sans-serif] font-bold";
const sfSemi  = "font-['SF_Pro',sans-serif] font-[590]";
const sfReg   = "font-['SF_Pro',sans-serif] font-normal";
const canela  = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const intBold = "font-['Inter',sans-serif] font-bold not-italic";
const intMed  = "font-['Inter',sans-serif] font-medium not-italic";
const intReg  = "font-['Inter',sans-serif] font-normal not-italic";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };

function parseMoney(v: string) { return parseFloat(v.replace(/[^0-9.]/g, '')) || 0; }
function fmtInput(n: number)   { return n > 0 ? n.toLocaleString() : ''; }

/* ─── SVG Icons (from Figma svg-57cp32n84p) ────────��─────────── */

/** Right-pointing chevron for collapsed categories */
function ChevronRight() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-[14px]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M5.25 3.5L8.75 7L5.25 10.5" stroke="#B5B0A8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
      </svg>
    </div>
  );
}

/** Down-pointing chevron for expanded categories */
function ChevronDown() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-[14px]">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="#B5B0A8" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
      </svg>
    </div>
  );
}

function BinIcon() {
  return (
    <div className="relative shrink-0 size-[18px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <path d={svgPaths.p2546c280} stroke="#B5B0A8" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.125" />
      </svg>
    </div>
  );
}

function BoxIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[24px]">
      <div className="absolute inset-[11.77%_9.38%_7.61%_9.38%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19.5 19.3483">
          <path clipRule="evenodd" d={svgPaths.p2bd84a00} fill="#3E2D1D" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function InfoIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[11.46%]">
        <div className="absolute inset-[-4.05%_-4.06%_-4.05%_-4.05%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 16.6667">
            <path d={svgPaths.p178c2500} stroke="#764D2F" strokeWidth="1.25" />
            <path d="M8.33333 8.1775V12.3442" stroke="#764D2F" strokeLinecap="round" strokeWidth="1.25" />
            <path d={svgPaths.p3d688680} fill="#764D2F" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <div className="relative shrink-0 size-[15.5px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 15.5 15.5">
        <path d={svgPaths.p1a0c1c00} fill="#3E2D1D" />
      </svg>
    </div>
  );
}

function SmallPlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
      <path d="M2.5 6H9.5" stroke="#C5C0B9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 2.5V9.5" stroke="#C5C0B9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Grid template matching Figma exactly ────────────────────── */
const GRID_COLS = '253.5px 126.75px 126.75px 126.75px 126.75px 126.75px 126.75px';
const GRID_COLS_8 = `${GRID_COLS} minmax(0,1fr)`;

/* ─── Templates ──────────────────────────────────────────────── */
const BUDGET_TEMPLATES: { name: string; categories: { name: string; items: { name: string; budget: number }[] }[] }[] = [
  {
    name: 'Fix & Flip',
    categories: [
      { name: 'Acquisition', items: [{ name: 'Purchase Price', budget: 0 }, { name: 'Closing Costs', budget: 0 }] },
      { name: 'Construction', items: [{ name: 'Demo & Cleanup', budget: 0 }, { name: 'Framing & Structural', budget: 0 }, { name: 'Plumbing', budget: 0 }, { name: 'Electrical', budget: 0 }, { name: 'HVAC', budget: 0 }, { name: 'Finishes', budget: 0 }] },
      { name: 'Soft Costs', items: [{ name: 'Permits & Fees', budget: 0 }, { name: 'Architecture & Design', budget: 0 }, { name: 'Insurance', budget: 0 }] },
      { name: 'Holding Costs', items: [{ name: 'Property Taxes', budget: 0 }, { name: 'Utilities', budget: 0 }, { name: 'Interest Payments', budget: 0 }] },
    ],
  },
  {
    name: 'Ground-Up Development',
    categories: [
      { name: 'Land & Acquisition', items: [{ name: 'Land Purchase', budget: 0 }, { name: 'Closing Costs', budget: 0 }, { name: 'Survey & Testing', budget: 0 }] },
      { name: 'Site Work', items: [{ name: 'Excavation & Grading', budget: 0 }, { name: 'Utilities & Infrastructure', budget: 0 }, { name: 'Landscaping', budget: 0 }] },
      { name: 'Hard Costs', items: [{ name: 'Foundation', budget: 0 }, { name: 'Framing', budget: 0 }, { name: 'Mechanical/Electrical/Plumbing', budget: 0 }, { name: 'Interior Finishes', budget: 0 }, { name: 'Exterior Finishes', budget: 0 }] },
      { name: 'Soft Costs', items: [{ name: 'Architecture & Engineering', budget: 0 }, { name: 'Permits', budget: 0 }, { name: 'Legal & Accounting', budget: 0 }, { name: 'Insurance', budget: 0 }] },
      { name: 'Financing', items: [{ name: 'Loan Origination', budget: 0 }, { name: 'Interest Reserve', budget: 0 }] },
    ],
  },
  {
    name: 'Multi-Family Rehab',
    categories: [
      { name: 'Acquisition', items: [{ name: 'Purchase Price', budget: 0 }, { name: 'Due Diligence', budget: 0 }] },
      { name: 'Common Areas', items: [{ name: 'Lobby & Hallways', budget: 0 }, { name: 'Exterior & Roof', budget: 0 }, { name: 'Parking & Landscaping', budget: 0 }] },
      { name: 'Unit Renovations', items: [{ name: 'Kitchen Upgrades', budget: 0 }, { name: 'Bathroom Upgrades', budget: 0 }, { name: 'Flooring & Paint', budget: 0 }, { name: 'Appliances', budget: 0 }] },
      { name: 'Systems', items: [{ name: 'Plumbing', budget: 0 }, { name: 'Electrical', budget: 0 }, { name: 'HVAC', budget: 0 }] },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                */
/* ═══════════════════════════════════════════════════════════════ */

export function BudgetTab({ propertyId }: { propertyId: string }) {
  const { state, updateBudget } = useApp();
  const property = state.properties.find(p => p.id === propertyId)!;
  const [budget, setBudget] = useState<PropertyBudget>({
    ...property.budget,
    categories: property.budget.categories.map(c => ({ ...c, items: c.items.map(i => ({ ...i })) })),
  });
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(
    () => Object.fromEntries(property.budget.categories.map(c => [c.id, true])),
  );
  const [saved, setSaved] = useState(false);
  const [editCell, setEditCell] = useState<{ catId: string; itemId: string; field: string } | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);

  const gsf = budget.grossSqft || 1;
  const nsf = budget.netSqft || 1;
  const totalBudget = budget.categories.reduce((s, c) => s + c.items.reduce((ss, i) => ss + i.budget, 0), 0);
  const totalActual = budget.categories.reduce((s, c) => s + c.items.reduce((ss, i) => ss + i.actual, 0), 0);
  const totalDrawn = budget.categories.reduce((s, c) => s + getDrawnForCategory(c.id, property.draws), 0);
  const totalRemaining = totalBudget - totalDrawn;
  const totalVariance = totalBudget - totalActual;
  const drawnPct = totalBudget > 0 ? Math.round((totalDrawn / totalBudget) * 100) : 0;
  const isEmpty = budget.categories.length === 0;

  /* ── state helpers ── */
  const updateItem = (catId: string, itemId: string, field: keyof BudgetLineItem, value: number | string) => {
    setBudget(prev => ({ ...prev, categories: prev.categories.map(c => c.id === catId ? { ...c, items: c.items.map(i => i.id === itemId ? { ...i, [field]: value } : i) } : c) }));
    setSaved(false);
  };
  const addItem = (catId: string) => {
    setBudget(prev => ({ ...prev, categories: prev.categories.map(c => c.id === catId ? { ...c, items: [...c.items, { id: genId(), name: 'New Line Item', budget: 0, actual: 0 }] } : c) }));
    setSaved(false); setCollapsed(prev => ({ ...prev, [catId]: false }));
  };
  const removeItem = (catId: string, itemId: string) => {
    setBudget(prev => ({ ...prev, categories: prev.categories.map(c => c.id === catId ? { ...c, items: c.items.filter(i => i.id !== itemId) } : c) }));
    setSaved(false);
  };
  const addCategory = () => {
    const newId = genId();
    setBudget(prev => ({ ...prev, categories: [...prev.categories, { id: newId, name: 'New Category', items: [] }] }));
    setCollapsed(prev => ({ ...prev, [newId]: true }));
    setSaved(false);
  };
  const removeCategory = (catId: string) => {
    setBudget(prev => ({ ...prev, categories: prev.categories.filter(c => c.id !== catId) }));
    setSaved(false);
  };
  const updateCatName = (catId: string, name: string) => {
    setBudget(prev => ({ ...prev, categories: prev.categories.map(c => c.id === catId ? { ...c, name } : c) }));
    setSaved(false);
  };
  const applyTemplate = (idx: number) => {
    const t = BUDGET_TEMPLATES[idx];
    const cats: BudgetCategory[] = t.categories.map(tc => ({ id: genId(), name: tc.name, items: tc.items.map(ti => ({ id: genId(), name: ti.name, budget: ti.budget, actual: 0 })) }));
    setBudget(prev => ({ ...prev, categories: [...prev.categories, ...cats] }));
    setCollapsed(prev => ({
      ...prev,
      ...Object.fromEntries(cats.map(c => [c.id, true])),
    }));
    setSaved(false); setShowTemplates(false);
  };
  const handleSave = () => { updateBudget(propertyId, budget); setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const toggleCollapse = (catId: string) => setCollapsed(prev => ({ ...prev, [catId]: !prev[catId] }));

  /* ── inline editing ── */
  function EditableInput({ catId, itemId, field, value, numeric }: {
    catId: string; itemId: string; field: string; value: number | string; numeric?: boolean;
  }) {
    const active = editCell?.catId === catId && editCell?.itemId === itemId && editCell?.field === field;
    if (active) {
      return (
        <input
          autoFocus
          type="text"
          defaultValue={numeric ? fmtInput(value as number) : value as string}
          onBlur={e => { updateItem(catId, itemId, field as keyof BudgetLineItem, numeric ? parseMoney(e.target.value) : e.target.value); setEditCell(null); }}
          onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); if (e.key === 'Escape') setEditCell(null); }}
          className={`w-full h-[30px] px-[6px] rounded-[4px] border border-[#764D2F] bg-white ${intReg} text-[16px] text-[#1a1a1a] tracking-[-0.3125px] leading-[24px] focus:outline-none ${numeric ? 'text-right' : ''}`}
        />
      );
    }
    const display = numeric ? (value as number > 0 ? formatCurrency(value as number) : '—') : value as string;
    return (
      <div
        onClick={e => { e.stopPropagation(); setEditCell({ catId, itemId, field }); }}
        className={`h-[30px] rounded-[4px] cursor-pointer hover:bg-[#f5f3ef] transition-colors flex items-center ${numeric ? 'justify-end' : ''} px-[6px]`}
      >
        <p className={`${intReg} leading-[24px] text-[#1a1a1a] text-[16px] tracking-[-0.3125px] whitespace-nowrap ${numeric ? 'text-right' : ''}`}>{display}</p>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════ */
  /*  RENDER                                                     */
  /* ═══════════════════════════════════════════════════════════ */
  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-full">

      {/* ═══ HEADER ═══ */}
      <div className="content-stretch flex flex-col sm:flex-row sm:items-end justify-between relative shrink-0 w-full gap-[16px] sm:gap-0">
        {/* Title */}
        <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full sm:w-[417px]">
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
            <p className={`${canela} relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px] w-full`}>Project Budget</p>
            <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[14px] sm:text-[16px] w-full`} style={wdth}>{`Track every dollar across your project categories `}</p>
          </div>
        </div>
        {/* Buttons */}
        <div className="content-stretch flex gap-[12px] sm:gap-[16px] items-center justify-end relative shrink-0">
          <button onClick={() => setShowTemplates(!showTemplates)} className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer bg-transparent border-none">
            <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <BoxIcon />
            <p className={`${sfSemi} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap`} style={wdth}>Templates</p>
          </button>
          <button onClick={handleSave} className="bg-[#3e2d1d] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer border-none hover:bg-[#2C1F14] transition-colors">
            <p className={`${sfSemi} leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap`} style={wdth}>{saved ? 'Saved!' : 'Save Budget'}</p>
          </button>
        </div>
      </div>

      {/* Templates panel */}
      <AnimatePresence>
        {showTemplates && (
          <motion.div initial={{ opacity: 0, y: -8, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto' }} exit={{ opacity: 0, y: -8, height: 0 }} className="overflow-hidden shrink-0 w-full -mt-[20px]">
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
              <p className={`${canela} text-[#3e2d1d] text-[20px] mb-[4px]`}>Start with a template</p>
              <p className={`${sfMed} text-[#8c8780] text-[13px] mb-[20px]`} style={wdth}>Pre-built budget structures to get you started quickly.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px]">
                {BUDGET_TEMPLATES.map((t, idx) => (
                  <button key={t.name} onClick={() => applyTemplate(idx)} className="flex flex-col gap-[8px] p-[20px] rounded-[12px] border border-[#E8E5E0] hover:border-[#764D2F] hover:bg-[#FCF6F0] transition-all cursor-pointer text-left group bg-transparent">
                    <p className={`${intBold} text-[14px] text-[#3E2D1D] group-hover:text-[#764D2F]`}>{t.name}</p>
                    <p className={`${intMed} text-[12px] text-[#8C8780]`}>{t.categories.length} categories · {t.categories.reduce((s, c) => s + c.items.length, 0)} line items</p>
                    <div className="flex flex-wrap gap-[4px] mt-[4px]">
                      {t.categories.slice(0, 3).map(c => (<span key={c.name} className={`${intMed} text-[11px] bg-[#F5F3EF] text-[#B5B0A8] px-[6px] py-[2px] rounded-[4px]`}>{c.name}</span>))}
                      {t.categories.length > 3 && <span className={`${intMed} text-[11px] text-[#B5B0A8] px-[4px] py-[2px]`}>+{t.categories.length - 3} more</span>}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ CONTENT ═══ */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">

        {/* ─── Summary Card ─── */}
        <div className="w-full">
          <div className="bg-white relative rounded-[20px] shrink-0 w-full">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="content-stretch flex flex-col items-start p-[20px] sm:p-[25px] relative w-full">
              <div className="content-stretch flex flex-col lg:flex-row gap-[24px] lg:gap-[32px] items-start relative shrink-0 w-full">

                {/* Total Budget */}
                <div className="relative shrink-0">
                  <div className="flex flex-col gap-[4px]">
                    <p className={`${sfMed} text-[#764d2f] text-[12px] whitespace-nowrap`} style={wdth}>Total Budget</p>
                    <p className={`${sfBold} text-[#3e2d1d] text-[28px] tracking-[0.3828px] whitespace-nowrap`} style={wdth}>{formatCurrency(totalBudget)}</p>
                    <p className={`${sfMed} text-[#b5b0a8] text-[12px] whitespace-nowrap`} style={wdth}>${(totalBudget / gsf).toFixed(0)}/gsf · ${(totalBudget / nsf).toFixed(0)}/nsf</p>
                  </div>
                </div>

                {/* Draw Progress */}
                <div className="flex-1 min-w-0 relative w-full lg:w-auto">
                  <div className="flex flex-col gap-[8px]">
                    {/* Label row */}
                    <div className="content-stretch flex items-center justify-between w-full">
                      <p className={`${sfMed} text-[#764d2f] text-[12px] whitespace-nowrap`} style={wdth}>Draw Progress</p>
                      <p className={`${sfMed} text-[#3e2d1d] text-[12px] whitespace-nowrap`} style={wdth}>{drawnPct}%</p>
                    </div>
                    {/* Bar */}
                    <div className="bg-[#e8e5e0] h-[6px] overflow-clip rounded-[100px] w-full">
                      <motion.div className="bg-[#3e2d1d] h-[6px] rounded-[100px]" initial={{ width: 0 }} animate={{ width: `${drawnPct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
                    </div>
                    {/* Stats row */}
                    <div className="content-stretch flex flex-wrap items-center justify-between gap-x-[16px] gap-y-[8px] w-full">
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <p className={`${sfMed} leading-[25.385px] text-[#764d2f] text-[16.923px]`} style={wdth}>Drawn</p>
                        <p className={`${sfBold} leading-[29.615px] text-[#3e2d1d] text-[19.744px] tracking-[-0.2121px]`} style={wdth}>{formatCurrency(totalDrawn)}</p>
                      </div>
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <p className={`${sfMed} leading-[25.385px] text-[#764d2f] text-[16.923px]`} style={wdth}>Actual Spent</p>
                        <p className={`${sfBold} leading-[29.615px] text-[#3e2d1d] text-[19.744px] tracking-[-0.2121px]`} style={wdth}>{formatCurrency(totalActual)}</p>
                      </div>
                      <div className="content-stretch flex flex-col items-start relative shrink-0">
                        <p className={`${sfMed} leading-[25.385px] text-[#764d2f] text-[16.923px]`} style={wdth}>Variance</p>
                        <p className={`${sfBold} leading-[29.615px] text-[#3e2d1d] text-[19.744px] tracking-[-0.2121px]`} style={wdth}>{totalVariance >= 0 ? '+' : ''}{formatCurrency(totalVariance)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Gross/Net SF */}
                <div className="relative shrink-0 lg:border-l lg:border-[#f0eeea] lg:pl-[25px]">
                  <div className="content-stretch flex flex-row lg:flex-col gap-[16px] lg:gap-[10px] items-start">
                    <div className="shrink-0">
                      <div className="content-stretch flex flex-col gap-[2px] items-start">
                        <p className={`${sfMed} text-[#764d2f] text-[11px] tracking-[0.0645px] whitespace-nowrap`} style={wdth}>Gross SF</p>
                        <div className="bg-[#fafaf9] h-[32px] relative rounded-[6px] w-[100px]">
                          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                            <div className="content-stretch flex items-center px-[10px] relative size-full">
                              <input
                                type="text" value={fmtInput(budget.grossSqft)}
                                onChange={e => { setBudget(prev => ({ ...prev, grossSqft: parseMoney(e.target.value) })); setSaved(false); }}
                                className={`${sfReg} leading-[19.5px] text-[#3e2d1d] text-[13px] tracking-[-0.0762px] w-full bg-transparent outline-none border-none p-0 m-0`}
                                style={wdth}
                              />
                            </div>
                          </div>
                          <div aria-hidden="true" className="absolute border border-[#e8e5e0] border-solid inset-0 pointer-events-none rounded-[6px]" />
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="content-stretch flex flex-col gap-[2px] items-start">
                        <p className={`${sfMed} text-[#764d2f] text-[11px] tracking-[0.0645px] whitespace-nowrap`} style={wdth}>Net SF</p>
                        <div className="bg-[#fafaf9] h-[32px] relative rounded-[6px] w-[100px]">
                          <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                            <div className="content-stretch flex items-center px-[10px] relative size-full">
                              <input
                                type="text" value={fmtInput(budget.netSqft)}
                                onChange={e => { setBudget(prev => ({ ...prev, netSqft: parseMoney(e.target.value) })); setSaved(false); }}
                                className={`${sfReg} leading-[19.5px] text-[#3e2d1d] text-[13px] tracking-[-0.0762px] w-full bg-transparent outline-none border-none p-0 m-0`}
                                style={wdth}
                              />
                            </div>
                          </div>
                          <div aria-hidden="true" className="absolute border border-[#e8e5e0] border-solid inset-0 pointer-events-none rounded-[6px]" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Budget Table ─── */}
        {!isEmpty && (
          <div className="overflow-x-auto w-full">
            <div className="bg-white relative rounded-[20px] shrink-0 min-w-[1120px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
              <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] w-full">

                {/* Table Header */}
                <div className="bg-[#fafaf9] h-[41.5px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[#e8e5e0] border-b border-solid inset-0 pointer-events-none" />
                  <div
                    className="gap-x-[8px] grid pb-[13px] pl-[16px] pr-[56px] pt-[12px] relative size-full items-center"
                    style={{ gridTemplateColumns: GRID_COLS }}
                  >
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap`} style={wdth}>Line Item</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>Budget</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>$/GSF</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>$/NSF</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>Drawn</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>Remaining</p>
                    <p className={`${sfMed} leading-[16.5px] text-[#8c8780] text-[11px] tracking-[0.6145px] uppercase whitespace-nowrap text-right`} style={wdth}>Actual</p>
                  </div>
                </div>

                {/* Categories */}
                {budget.categories.map(cat => {
                  const catBudget = cat.items.reduce((s, i) => s + i.budget, 0);
                  const catActual = cat.items.reduce((s, i) => s + i.actual, 0);
                  const catDrawn = getDrawnForCategory(cat.id, property.draws);
                  const catRemaining = catBudget - catDrawn;
                  const isOpen = collapsed[cat.id] !== true;
                  const budgetPct = totalBudget > 0 ? Math.round((catBudget / totalBudget) * 100) : 0;
                  const catDrawnPct = catBudget > 0 ? Math.min(100, Math.round((catDrawn / catBudget) * 100)) : 0;

                  return (
                    <div key={cat.id} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                      {/* Category header row — h-[45px] */}
                      <div className="content-stretch flex flex-col items-start pt-px relative shrink-0 w-full">
                        <div aria-hidden="true" className="absolute border-[#e8e5e0] border-solid border-t inset-0 pointer-events-none" />
                        <div className="bg-white h-[45px] relative shrink-0 w-full hover:bg-[#fafaf9] transition-colors cursor-pointer group/cat" onClick={() => toggleCollapse(cat.id)}>
                          {/* Line item cell (chevron + name + pct) */}
                          <div className="absolute content-stretch flex gap-[8px] h-[21px] items-center left-[16px] top-[12px] w-[253.5px]">
                            {isOpen ? <ChevronDown /> : <ChevronRight />}
                            <div className="flex-1 h-[21px] min-w-0">
                              <input
                                type="text" value={cat.name}
                                onChange={e => { e.stopPropagation(); updateCatName(cat.id, e.target.value); }}
                                onClick={e => e.stopPropagation()}
                                className={`${intBold} leading-[21px] text-[#3e2d1d] text-[14px] tracking-[-0.1504px] bg-transparent outline-none border-none p-0 m-0 w-full truncate cursor-text`}
                              />
                            </div>
                            {budgetPct > 0 && (
                              <div className="bg-[#f5f3ef] h-[20.5px] relative rounded-[4px] shrink-0 flex items-center px-[6px]">
                                <p className={`${intMed} leading-[16.5px] text-[#b5b0a8] text-[11px] tracking-[0.0645px] whitespace-nowrap`}>{budgetPct}%</p>
                              </div>
                            )}
                          </div>
                          {/* Budget */}
                          <div className="absolute h-[21px] left-[277.5px] top-[12px] w-[126.75px]">
                            <p className={`absolute right-0 ${intBold} leading-[21px] text-[#3e2d1d] text-[14px] text-right top-0 tracking-[-0.1504px] whitespace-nowrap`}>{catBudget > 0 ? formatCurrency(catBudget) : '—'}</p>
                          </div>
                          {/* $/GSF */}
                          <div className="absolute h-[19.5px] left-[412.25px] top-[12.75px] w-[126.75px]">
                            <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#b5b0a8] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{catBudget > 0 ? `$${(catBudget / gsf).toFixed(0)}` : '—'}</p>
                          </div>
                          {/* $/NSF */}
                          <div className="absolute h-[19.5px] left-[547px] top-[12.75px] w-[126.75px]">
                            <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#b5b0a8] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{catBudget > 0 ? `$${(catBudget / nsf).toFixed(0)}` : '—'}</p>
                          </div>
                          {/* Drawn */}
                          <div className="absolute h-[19.5px] left-[681.75px] top-[12.75px] w-[126.75px]">
                            <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#764d2f] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{catDrawn > 0 ? formatCurrency(catDrawn) : '—'}</p>
                          </div>
                          {/* Remaining */}
                          <div className="absolute h-[19.5px] left-[816.5px] top-[12.75px] w-[126.75px]">
                            <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#3e2d1d] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{catBudget > 0 ? formatCurrency(catRemaining) : '—'}</p>
                          </div>
                          {/* Actual */}
                          <div className="absolute h-[19.5px] left-[951.25px] top-[12.75px] w-[126.75px]">
                            <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#b5b0a8] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{catActual > 0 ? formatCurrency(catActual) : '—'}</p>
                          </div>
                        </div>
                      </div>

                      {/* Expanded content */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} className="w-full">

                            {/* Progress bar under category */}
                            {catBudget > 0 && (
                              <div className="bg-white h-[24.5px] relative shrink-0 w-full">
                                <div className="flex flex-row items-center size-full">
                                  <div className="content-stretch flex gap-[8px] items-center pl-[38px] pr-[16px] relative size-full">
                                    <div className="bg-[#e8e5e0] flex-1 h-[3px] min-h-px min-w-px relative rounded-[100px] overflow-hidden">
                                      <motion.div className="bg-[#764d2f] h-[3px] rounded-[100px]" initial={{ width: 0 }} animate={{ width: `${catDrawnPct}%` }} transition={{ duration: 0.4 }} />
                                    </div>
                                    <div className="h-[16.5px] relative shrink-0">
                                      <p className={`${sfMed} leading-[16.5px] text-[#b5b0a8] text-[11px] tracking-[0.0645px] whitespace-nowrap`} style={wdth}>{catDrawnPct}%</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Line items */}
                            {cat.items.map(item => (
                              <div key={item.id} className="bg-white h-[47px] relative shrink-0 w-full group">
                                <div aria-hidden="true" className="absolute border-[#f5f3ef] border-solid border-t inset-0 pointer-events-none" />
                                {/* Name */}
                                <div className="absolute left-[44px] top-[9px] w-[225.5px] h-[30px]">
                                  <EditableInput catId={cat.id} itemId={item.id} field="name" value={item.name} />
                                </div>
                                {/* Budget */}
                                <div className="absolute left-[277.5px] top-[9px] w-[126.75px] h-[30px]">
                                  <EditableInput catId={cat.id} itemId={item.id} field="budget" value={item.budget} numeric />
                                </div>
                                {/* $/GSF */}
                                <div className="absolute h-[19.5px] left-[412.25px] top-[14.25px] w-[126.75px]">
                                  <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#c5c0b9] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{item.budget > 0 ? `$${(item.budget / gsf).toFixed(0)}` : '—'}</p>
                                </div>
                                {/* $/NSF */}
                                <div className="absolute h-[19.5px] left-[547px] top-[14.25px] w-[126.75px]">
                                  <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#c5c0b9] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{item.budget > 0 ? `$${(item.budget / nsf).toFixed(0)}` : '—'}</p>
                                </div>
                                {/* Drawn */}
                                <div className="absolute h-[19.5px] left-[681.75px] top-[14.25px] w-[126.75px]">
                                  <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#c5c0b9] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>—</p>
                                </div>
                                {/* Remaining */}
                                <div className="absolute h-[19.5px] left-[816.5px] top-[14.25px] w-[126.75px]">
                                  <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#c5c0b9] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{item.budget > 0 ? formatCurrency(Math.max(0, item.budget - item.actual)) : '—'}</p>
                                </div>
                                {/* Actual */}
                                <div className="absolute left-[951.25px] top-[9px] w-[126.75px] h-[30px]">
                                  <EditableInput catId={cat.id} itemId={item.id} field="actual" value={item.actual} numeric />
                                </div>
                                {/* Delete */}
                                <button
                                  onClick={() => removeItem(cat.id, item.id)}
                                  className="absolute left-[1086px] top-[14px] cursor-pointer border-none bg-transparent p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                >
                                  <BinIcon />
                                </button>
                              </div>
                            ))}

                            {/* Add line item */}
                            <button onClick={() => addItem(cat.id)} className="h-[36.5px] relative shrink-0 w-full cursor-pointer border-none bg-transparent hover:bg-[#fafaf9] transition-colors">
                              <div aria-hidden="true" className="absolute border-[#f5f3ef] border-solid border-t inset-0 pointer-events-none" />
                              <div className="absolute left-[44px] top-[12px]">
                                <SmallPlusIcon />
                              </div>
                              <p className={`absolute ${sfMed} leading-[19.5px] left-[64px] text-[#c5c0b9] text-[13px] top-[10px] tracking-[-0.0762px] whitespace-nowrap`} style={wdth}>Add line item</p>
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}

                {/* Totals row — h-[51px] */}
                <div className="bg-[#fafaf9] h-[51px] relative shrink-0 w-full">
                  <div aria-hidden="true" className="absolute border-[#d0d0d0] border-solid border-t-2 inset-0 pointer-events-none" />
                  <div className="absolute h-[19.5px] left-[16px] top-[16.75px] w-[253.5px]">
                    <p className={`absolute ${sfBold} leading-[19.5px] left-[22px] text-[#3e2d1d] text-[13px] top-px tracking-[-0.0762px] whitespace-nowrap`} style={wdth}>TOTAL</p>
                  </div>
                  <div className="absolute h-[21px] left-[277.5px] top-[16px] w-[126.75px]">
                    <p className={`absolute right-0 ${intBold} leading-[21px] text-[#3e2d1d] text-[14px] text-right top-0 tracking-[-0.1504px] whitespace-nowrap`}>{formatCurrency(totalBudget)}</p>
                  </div>
                  <div className="absolute h-[19.5px] left-[412.25px] top-[16.75px] w-[126.75px]">
                    <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#8c8780] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>${(totalBudget / gsf).toFixed(0)}</p>
                  </div>
                  <div className="absolute h-[19.5px] left-[547px] top-[16.75px] w-[126.75px]">
                    <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#8c8780] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>${(totalBudget / nsf).toFixed(0)}</p>
                  </div>
                  <div className="absolute h-[19.5px] left-[681.75px] top-[16.75px] w-[126.75px]">
                    <p className={`absolute right-0 ${intBold} leading-[19.5px] text-[#764d2f] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{formatCurrency(totalDrawn)}</p>
                  </div>
                  <div className="absolute h-[19.5px] left-[816.5px] top-[16.75px] w-[126.75px]">
                    <p className={`absolute right-0 ${intBold} leading-[19.5px] text-[#3e2d1d] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{formatCurrency(totalRemaining)}</p>
                  </div>
                  <div className="absolute h-[19.5px] left-[951.25px] top-[16.75px] w-[126.75px]">
                    <p className={`absolute right-0 ${intMed} leading-[19.5px] text-[#8c8780] text-[13px] text-right top-px tracking-[-0.0762px] whitespace-nowrap`}>{formatCurrency(totalActual)}</p>
                  </div>
                </div>

              </div>
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            </div>
          </div>
        )}

        {/* Empty state */}
        {isEmpty && !showTemplates && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-[20px] border-[1.5px] border-dashed border-[#D0D0D0] p-[48px] text-center w-full">
            <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FCF6F0] flex items-center justify-center mx-auto mb-[16px]"><BoxIcon /></div>
            <p className={`${canela} text-[#3E2D1D] text-[18px] mb-[6px]`}>No budget categories yet</p>
            <p className={`${sfMed} text-[#8C8780] text-[14px] mb-[24px] max-w-[400px] mx-auto`} style={wdth}>Start by choosing a template or create your own custom budget categories</p>
            <div className="flex items-center justify-center gap-[12px]">
              <button onClick={() => setShowTemplates(true)} className="bg-[#3e2d1d] flex items-center gap-[8px] px-[24px] py-[10px] rounded-[8px] text-white text-[14px] hover:bg-[#2C1F14] transition-all cursor-pointer border-none" style={{ fontWeight: 590 }}><BoxIcon /> Use Template</button>
              <button onClick={addCategory} className="flex items-center gap-[8px] px-[24px] py-[10px] rounded-[8px] border border-[#D0D0D0] text-[#3E2D1D] text-[14px] hover:bg-[#FCF6F0] transition-all cursor-pointer bg-transparent" style={{ fontWeight: 510 }}><PlusIcon /> Create Custom</button>
            </div>
          </motion.div>
        )}

        {/* Info line */}
        {!isEmpty && (
          <div className="content-stretch flex gap-[6px] items-center relative shrink-0 w-full">
            <InfoIcon />
            <p className={`${sfMed} leading-[normal] relative text-[#764d2f] text-[14px]`} style={wdth}>Click any cell to edit inline. Drawn amounts auto-calculate from draw requests.</p>
          </div>
        )}

        {/* Add Category button */}
        {!isEmpty && (
          <button onClick={addCategory} className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer bg-transparent border-none">
            <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <PlusIcon />
            <p className={`${sfSemi} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap`} style={wdth}>Add Category</p>
          </button>
        )}
      </div>
    </div>
  );
}