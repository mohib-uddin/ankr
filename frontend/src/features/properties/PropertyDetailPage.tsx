import { useState, useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, getBudgetTotals, formatCurrency, getDrawnForCategory } from '@/app/context/AppContext';
import { ProFormaTab } from './tabs/ProFormaTab';
import { BudgetTab } from './tabs/BudgetTab';
import { DrawsTab } from './tabs/DrawsTab';
import { DocumentsTab } from './tabs/DocumentsTab';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import imgFrame792844 from '@/assets/e9d78759a04046f1991fda88e44b64c28f7e866d.png';
import svgPaths from '@/icons/property-detail';

type Tab = 'overview' | 'proforma' | 'budget' | 'draws' | 'documents';

const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";

/* ─── SVG Icons (Figma-exact) ───────────────────────────────────────── */

function BreadcrumbChevron() {
  return (
    <div className="flex items-center justify-center relative shrink-0 size-[24px]">
      <div className="flex-none rotate-90">
        <div className="relative size-[24px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
            <path d={svgPaths.p7e66880} fill="#8C8780" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ArrowRight() {
  return (
    <div className="flex h-[9.537px] items-center justify-center relative shrink-0 w-[12.999px]">
      <div className="flex-none rotate-90">
        <div className="h-[12.999px] relative w-[9.537px]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.53742 12.9993">
            <path d={svgPaths.pec28900} fill="#3E2D1D" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LocationIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[20px]">
      <div className="absolute inset-[8.33%_12.5%_9.64%_12.5%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 16.4049">
          <g>
            <path clipRule="evenodd" d={svgPaths.p36ed300} fill="white" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p12b38500} fill="white" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function UnitsIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[12.5%_11.25%_12.5%_10.83%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.4667 12">
          <g>
            <path clipRule="evenodd" d={svgPaths.p121b02f0} fill="white" fillRule="evenodd" />
            <path clipRule="evenodd" d={svgPaths.p298f780} fill="white" fillRule="evenodd" />
            <path d={svgPaths.p10ab0b00} fill="white" />
            <path d={svgPaths.p27bfbb80} fill="white" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function RulerIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[6.39%_6.38%_6.39%_6.39%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.9567 13.9567">
          <path clipRule="evenodd" d={svgPaths.p36d3700} fill="white" fillRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}

function HomeIcon() {
  return (
    <div className="overflow-clip relative shrink-0 size-[16px]">
      <div className="absolute inset-[13.01%_9.71%_8.33%_9.71%]">
        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8916 12.585">
          <g>
            <path d={svgPaths.p23f5ec00} fill="white" />
            <path clipRule="evenodd" d={svgPaths.p12d69a00} fill="white" fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}

function BuiltIcon() {
  return (
    <div className="relative shrink-0 size-[16px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16 16">
        <path d={svgPaths.p3d416ab0} fill="white" />
      </svg>
    </div>
  );
}

/* ─── Helpers ──────────────────────────────────────────────────────── */

function formatCompact(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
  return '$' + n.toLocaleString();
}

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'proforma', label: 'Pro Forma' },
  { id: 'budget', label: 'Budget' },
  { id: 'draws', label: 'Draws' },
  { id: 'documents', label: 'Documents' },
];

const BUDGET_PIE_COLORS = ['#3E2D1D', '#764D2F', '#A67B5B', '#C7AF97', '#E8DFD4'];

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Page                                                        */
/* ══════════════════════════════════════════════════════════════════ */

export function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  const property = state.properties.find(p => p.id === id);

  const measureUnderline = useCallback(() => {
    const idx = TABS.findIndex(t => t.id === activeTab);
    const el = tabRefs.current[idx];
    if (el) {
      const parent = el.parentElement;
      if (parent) {
        const parentRect = parent.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        setUnderline({ left: elRect.left - parentRect.left, width: elRect.width });
      }
    }
  }, [activeTab]);

  useLayoutEffect(() => { measureUnderline(); }, [measureUnderline]);
  useEffect(() => {
    window.addEventListener('resize', measureUnderline);
    return () => window.removeEventListener('resize', measureUnderline);
  }, [measureUnderline]);

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#8C8780]">Property not found.</p>
        <button onClick={() => navigate('/dashboard/properties')} className="mt-4 text-[#764D2F] text-[14px] cursor-pointer">← Back to Properties</button>
      </div>
    );
  }

  const totals = getBudgetTotals(property.budget, property.draws);
  const drawnPercent = totals.totalBudget > 0 ? Math.round((totals.totalDrawn / totals.totalBudget) * 100) : 0;
  const totalInvested = property.proforma.purchasePrice + property.proforma.rehabCost + property.proforma.holdingCosts + property.proforma.financingCosts + property.proforma.softCosts;
  const grossProfit = property.proforma.afterRepairValue - totalInvested;
  const roi = totalInvested > 0 ? ((grossProfit / totalInvested) * 100).toFixed(1) : '0';

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-[58px]">
      {/* ── Breadcrumb ── */}
      <div className="content-stretch flex items-center pt-[24px] sm:pt-[32px] pb-[20px]">
        <button
          onClick={() => navigate('/dashboard/properties')}
          className="cursor-pointer leading-[normal] relative shrink-0 text-[#8c8780] text-[16px] whitespace-nowrap hover:text-[#3E2D1D] transition-colors"
          style={{ fontWeight: 510 }}
        >
          Properties
        </button>
        <BreadcrumbChevron />
        <span className="leading-[normal] relative shrink-0 text-[#764d2f] text-[16px] whitespace-nowrap" style={{ fontWeight: 510 }}>
          {property.name}
        </span>
      </div>

      {/* ── Hero Section (Figma-exact) ── */}
      <div className="content-stretch flex items-start relative shrink-0 w-full">
        <div className="w-full min-h-[220px] relative rounded-[16px]">
          {/* Background image + gradient */}
          <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
            <div className="absolute inset-0 overflow-hidden rounded-[16px]">
              <img alt="" className="absolute h-full left-0 max-w-none top-0 w-full object-cover" src={property.coverImage || imgFrame792844} />
            </div>
            <div className="absolute bg-gradient-to-t from-[rgba(0,0,0,0.95)] inset-0 rounded-[16px] to-[rgba(0,0,0,0)]" />
          </div>

          {/* Content overlay */}
          <div className="flex flex-col justify-end w-full relative min-h-[220px]">
            <div className="content-stretch flex flex-col items-start justify-end p-4 sm:p-[28px] relative w-full">
              <div className="content-stretch flex flex-col xl:flex-row xl:items-end justify-between relative shrink-0 w-full gap-4 xl:gap-0">
                {/* Left: Property Info */}
                <div className="content-stretch flex flex-col gap-[16px] sm:gap-[24px] items-start relative shrink-0">
                  {/* Status + Name + Address */}
                  <div className="content-stretch flex flex-col gap-[12px] sm:gap-[16px] items-start justify-center relative shrink-0 w-full">
                    {/* Status badge */}
                    <div className="content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[26px] shrink-0">
                      <div aria-hidden="true" className="absolute border border-solid border-white inset-0 pointer-events-none rounded-[26px]" />
                      <p className="leading-[normal] relative shrink-0 text-[12px] text-white whitespace-nowrap" style={{ fontWeight: 510 }}>
                        {property.status}
                      </p>
                    </div>
                    {/* Name + Address */}
                    <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 w-full">
                      <p className={`${canela} leading-[normal] relative shrink-0 text-[22px] sm:text-[28px] text-white`}>
                        {property.name}
                      </p>
                      <div className="content-stretch flex gap-[4px] items-center relative shrink-0 w-full">
                        <LocationIcon />
                        <p className="leading-[normal] relative shrink-0 text-[14px] sm:text-[16px] text-white" style={{ fontWeight: 510 }}>
                          {property.address}, {property.city}, {property.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Property details row */}
                  <div className="content-stretch flex flex-wrap gap-x-[16px] gap-y-[8px] items-start relative shrink-0">
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <UnitsIcon />
                      <p className="leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontWeight: 510 }}>{property.units} Units</p>
                    </div>
                    <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                      <RulerIcon />
                      <p className="leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontWeight: 510 }}>{property.sqft.toLocaleString()} sq.ft</p>
                    </div>
                    <div className="content-stretch flex gap-[4px] items-end relative shrink-0">
                      <HomeIcon />
                      <p className="leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontWeight: 510 }}>{property.type === 'Multi-Family' ? 'Multi Family' : property.type}</p>
                    </div>
                    {property.yearBuilt && (
                      <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
                        <BuiltIcon />
                        <p className="leading-[normal] relative shrink-0 text-[14px] text-white whitespace-nowrap" style={{ fontWeight: 510 }}>Built {property.yearBuilt}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Stats Card */}
                <div className="bg-[#fafafa] content-stretch flex flex-col gap-[10px] items-start justify-center px-[14px] py-[16px] sm:py-[24px] relative rounded-[12px] shrink-0 w-full xl:w-[573px]">
                  {/* Stats row */}
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                    <div className="relative rounded-[8px] shrink-0 w-full">
                      <div className="flex flex-col justify-center size-full">
                        <div className="content-stretch flex flex-col items-start justify-center pb-[16px] sm:pb-[20px] px-[12px] relative w-full">
                          <div className="content-stretch grid grid-cols-2 sm:flex items-center justify-between relative shrink-0 w-full gap-y-[12px]">
                            <HeroStat label="Budget Drawn" value={formatCompact(totals.totalDrawn)} />
                            <div className="bg-[#c4b29a] h-[38px] opacity-60 shrink-0 w-px hidden sm:block" />
                            <HeroStat label="Total Budget" value={formatCompact(totals.totalBudget)} />
                            <div className="bg-[#c4b29a] h-[38px] opacity-60 shrink-0 w-px hidden sm:block" />
                            <HeroStat label="Exit ARV" value={formatCompact(property.proforma.afterRepairValue)} />
                            <div className="bg-[#c4b29a] h-[38px] opacity-60 shrink-0 w-px hidden sm:block" />
                            <HeroStat label="Gross ROI" value={`+${roi}%`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Draw Progress */}
                  <div className="relative shrink-0 w-full">
                    <div className="content-stretch flex flex-col items-start px-[12px] relative w-full">
                      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                        <p className="leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap" style={{ fontWeight: 510 }}>Draw Progress</p>
                        <div className="bg-[#d9d9d9] h-[7px] relative rounded-[100px] shrink-0 w-full">
                          <div className="h-full bg-[#764d2f] rounded-[100px] transition-all duration-500" style={{ width: `${drawnPercent}%` }} />
                        </div>
                        <div className="content-stretch flex flex-col sm:flex-row gap-[4px] sm:gap-[10px] items-start sm:items-center relative shrink-0 w-full">
                          <div className="content-stretch flex items-center relative">
                            <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[13px] sm:text-[14px]" style={{ fontWeight: 510 }}>
                              {formatCurrency(totals.totalDrawn)} of {formatCurrency(totals.totalBudget)} drawn ({drawnPercent}%)
                            </p>
                          </div>
                          <div className="content-stretch flex items-center sm:justify-end sm:flex-1 relative">
                            <p className="leading-[normal] relative shrink-0 text-[#8c8780] text-[13px] sm:text-[14px] sm:text-right" style={{ fontWeight: 510 }}>
                              Remaining: {formatCurrency(totals.remaining)}
                            </p>
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

      {/* ── Tabs (Figma-exact) ── */}
      <div className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-full mt-[32px] sm:mt-[64px]">
        <div className="content-stretch flex gap-[24px] sm:gap-[52px] items-center leading-[normal] px-[8px] sm:px-[20px] relative shrink-0 text-[16px] sm:text-[18px] text-center whitespace-nowrap overflow-x-auto">
          {TABS.map((tab, idx) => (
            <button
              key={tab.id}
              ref={el => { tabRefs.current[idx] = el; }}
              onClick={() => setActiveTab(tab.id)}
              className="cursor-pointer relative shrink-0 transition-colors"
              style={{
                fontWeight: activeTab === tab.id ? 700 : 510,
                color: activeTab === tab.id ? '#3e2d1d' : '#764d2f',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-[#d9d9d9] h-[3px] relative shrink-0 w-full">
          <motion.div
            className="h-full bg-[#3e2d1d] absolute top-0"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          />
        </div>
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="mt-[36px] pb-[60px]"
        >
          {activeTab === 'overview' && <OverviewTab propertyId={id!} onTabChange={setActiveTab} />}
          {activeTab === 'proforma' && <ProFormaTab propertyId={id!} />}
          {activeTab === 'budget' && <BudgetTab propertyId={id!} />}
          {activeTab === 'draws' && <DrawsTab propertyId={id!} />}
          {activeTab === 'documents' && <DocumentsTab propertyId={id!} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─── Hero Stat ────────────────────────────────────────────────────── */

function HeroStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-stretch flex flex-col gap-[4px] items-start leading-[normal] relative shrink-0 whitespace-nowrap">
      <p className="relative shrink-0 text-[#764d2f] text-[12px]" style={{ fontWeight: 400 }}>{label}</p>
      <p className="relative shrink-0 text-[#3e2d1d] text-[24px]" style={{ fontWeight: 510 }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Overview Tab                                                      */
/* ═══════════════════════════════════════════════════════════════════ */

function OverviewTab({ propertyId, onTabChange }: { propertyId: string; onTabChange: (t: Tab) => void }) {
  const { state } = useApp();
  const property = state.properties.find(p => p.id === propertyId)!;
  const totals = getBudgetTotals(property.budget, property.draws);

  const totalInvested = property.proforma.purchasePrice + property.proforma.rehabCost + property.proforma.holdingCosts + property.proforma.financingCosts + property.proforma.softCosts;
  const grossProfit = property.proforma.afterRepairValue - totalInvested;
  const roi = totalInvested > 0 ? ((grossProfit / totalInvested) * 100).toFixed(1) : '0';

  const budgetCategories = property.budget.categories.map(cat => {
    const catBudget = cat.items.reduce((s, i) => s + i.budget, 0);
    const catDrawn = getDrawnForCategory(cat.id, property.draws);
    const pct = catBudget > 0 ? Math.round((catDrawn / catBudget) * 100) : 0;
    return { id: cat.id, name: cat.name, budget: catBudget, drawn: catDrawn, pct };
  }).filter(c => c.budget > 0);

  const pieData = budgetCategories.map(c => ({ name: c.name, value: c.budget }));

  // Draw timeline data
  const sortedDraws = [...property.draws]
    .filter(d => d.status !== 'Draft')
    .sort((a, b) => new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime());

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const drawTimelineData: { month: string; cumulative: number }[] = [];
  let cumulative = 0;

  // Build monthly cumulative data
  const monthlyData: Record<string, number> = {};
  sortedDraws.forEach(d => {
    const date = new Date(d.requestDate);
    const key = months[date.getMonth()];
    monthlyData[key] = (monthlyData[key] || 0) + d.totalAmount;
  });

  months.forEach(m => {
    if (monthlyData[m]) cumulative += monthlyData[m];
    if (cumulative > 0 || monthlyData[m]) {
      drawTimelineData.push({ month: m, cumulative });
    }
  });

  const PieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#3E2D1D] text-white px-[12px] py-[8px] rounded-[8px] text-[12px] shadow-lg" style={{ fontWeight: 510 }}>
          {payload[0].name}: {formatCurrency(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  const ChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#3E2D1D] text-white px-[12px] py-[8px] rounded-[8px] text-[12px] shadow-lg" style={{ fontWeight: 510 }}>
          <p>{label}</p>
          <p className="mt-[2px]">Cumulative: {formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="content-stretch flex flex-col xl:flex-row items-start relative shrink-0 w-full gap-[16px]">
      {/* ── Left Column: Budget Summary + Draw Timeline ── */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative self-stretch w-full xl:w-[60%] xl:shrink-0">
        {/* Budget Summary Card */}
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
          <div className="bg-white relative rounded-[20px] shrink-0 w-full">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="flex flex-col items-end size-full">
              <div className="content-stretch flex flex-col items-end p-4 sm:p-[24px] relative w-full">
                <div className="content-stretch flex flex-col gap-[24px] sm:gap-[36px] items-start relative shrink-0 w-full">
                  {/* Header */}
                  <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                    <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[20px] sm:text-[24px] whitespace-nowrap`}>Budget Summary</p>
                    <button className="content-stretch flex gap-[6px] items-center relative shrink-0 cursor-pointer" onClick={() => onTabChange('budget')}>
                      <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] sm:text-[16px] whitespace-nowrap" style={{ fontWeight: 700 }}>Manage Budget</p>
                      <ArrowRight />
                    </button>
                  </div>

                  {/* Chart + Stats */}
                  <div className="content-stretch flex flex-col gap-[32px] sm:gap-[44px] items-end relative shrink-0 w-full">
                    {/* Donut + Legend + Stats Row */}
                    <div className="content-stretch flex flex-col md:flex-row gap-[24px] md:gap-[42px] lg:gap-[90px] items-center relative shrink-0 w-full">
                      {/* Donut + Legend */}
                      <div className="content-stretch flex flex-col sm:flex-row gap-[20px] sm:gap-[42px] items-center relative shrink-0">
                        {/* Donut chart */}
                        <div className="overflow-clip relative shrink-0 size-[200px] sm:size-[231px]">
                          <div className="w-full h-full">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie data={pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1 }]} cx="50%" cy="50%" innerRadius={70} outerRadius={110} paddingAngle={1} dataKey="value" stroke="none" startAngle={90} endAngle={-270}>
                                  {(pieData.length > 0 ? pieData : [{ name: 'Empty', value: 1 }]).map((entry, i) => (
                                    <Cell key={`pie-cell-${entry.name}-${i}`} fill={pieData.length > 0 ? BUDGET_PIE_COLORS[i % BUDGET_PIE_COLORS.length] : '#E8DFD4'} />
                                  ))}
                                </Pie>
                                {pieData.length > 0 && <Tooltip content={<PieTooltip />} />}
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                          {/* Center text */}
                          <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center leading-[normal] left-[50%] text-center top-[50%]">
                            <p className="relative shrink-0 text-[#764d2f] text-[13px] sm:text-[14px]" style={{ fontWeight: 510 }}>Total Budget</p>
                            <p className="relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[30px]" style={{ fontWeight: 700 }}>{formatCompact(totals.totalBudget)}</p>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="content-stretch flex flex-col gap-[17px] items-start justify-center relative shrink-0">
                          {(pieData.length > 0 ? pieData : budgetCategories.length === 0 ? [{ name: 'No budget data', value: 0 }] : []).map((item, i) => (
                            <div key={item.name} className="content-stretch flex gap-[7px] items-center relative shrink-0">
                              <div className="rounded-[2.5px] shrink-0 size-[10px]" style={{ backgroundColor: BUDGET_PIE_COLORS[i % BUDGET_PIE_COLORS.length] }} />
                              <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[12px] whitespace-nowrap" style={{ fontWeight: 400 }}>{item.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Stats column */}
                      <div className="content-stretch flex flex-row md:flex-col gap-[16px] sm:gap-[24px] items-start relative shrink-0">
                        <BudgetSummaryStatItem label="Total Drawn" value={formatCompact(totals.totalDrawn)} />
                        <BudgetSummaryStatItem label="Actual Spent" value={formatCompact(totals.totalActual)} />
                        <BudgetSummaryStatItem label="Remaining" value={formatCompact(totals.remaining)} />
                      </div>
                    </div>

                    {/* Category Progress Bars */}
                    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
                      {budgetCategories.map(cat => (
                        <BudgetCategoryRow key={cat.id} name={cat.name} budget={cat.budget} drawn={cat.drawn} pct={cat.pct} />
                      ))}
                      {budgetCategories.length === 0 && (
                        <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>No budget categories with items yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Draw Timeline Card */}
        <div className="bg-white relative rounded-[20px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          <div className="content-stretch flex flex-col gap-[21px] items-start p-[24px] relative w-full">
            <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Draw Timeline</p>
            {drawTimelineData.length > 1 ? (
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={drawTimelineData}>
                    <defs>
                      <linearGradient id="drawGradientOverview" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#C7AF97" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#C7AF97" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid horizontal={true} vertical={false} stroke="rgba(34,34,34,0.12)" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'rgba(34,34,34,0.9)', fontWeight: 400 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: 'rgba(34,34,34,0.9)', fontWeight: 400 }} axisLine={false} tickLine={false} tickFormatter={(v: number) => formatCompact(v)} width={45} />
                    <Tooltip content={<ChartTooltip />} />
                    <Area type="monotone" dataKey="cumulative" stroke="#764D2F" strokeWidth={2} fill="url(#drawGradientOverview)" dot={{ fill: 'white', stroke: '#764D2F', strokeWidth: 2, r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] w-full">
                <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>Not enough draw data for timeline</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Column: Pro Forma + Draw Requests ── */}
      <div className="content-stretch flex flex-col gap-[16px] items-start min-h-px min-w-0 relative w-full xl:flex-1">
        {/* Pro Forma Card */}
        <div className="bg-white relative rounded-[20px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Pro Forma</p>
                <button className="content-stretch flex gap-[6px] items-center relative shrink-0 cursor-pointer" onClick={() => onTabChange('proforma')}>
                  <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontWeight: 700 }}>Edit</p>
                  <ArrowRight />
                </button>
              </div>

              {/* Sections */}
              <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                {/* Acquisition */}
                <ProFormaSection title="Acquisition">
                  <ProFormaRow label="Purchase Price" value={formatCurrency(property.proforma.purchasePrice)} />
                  <ProFormaRow label="Rehab Cost" value={formatCurrency(property.proforma.rehabCost)} />
                </ProFormaSection>

                <div className="bg-[#d9d9d9] h-px shrink-0 w-full" />

                {/* Exit / Returns */}
                <ProFormaSection title="Exit / Returns">
                  <ProFormaRow label="Exit ARV" value={formatCurrency(property.proforma.afterRepairValue)} />
                  <ProFormaRow label="Gross Profit" value={formatCurrency(grossProfit)} />
                  <ProFormaRow label="Gross ROI" value={`${roi}%`} />
                </ProFormaSection>

                <div className="bg-[#d9d9d9] h-px shrink-0 w-full" />

                {/* Details */}
                <ProFormaSection title="Details">
                  <ProFormaRow label="Strategy" value={property.proforma.exitStrategy} />
                  <ProFormaRow label="Lender" value={property.proforma.lenderName || '—'} />
                </ProFormaSection>
              </div>
            </div>
          </div>
        </div>

        {/* Draw Requests Card */}
        <div className="bg-white relative rounded-[20px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
            <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
              {/* Header */}
              <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Draw Requests</p>
                <button className="content-stretch flex gap-[6px] items-center relative shrink-0 cursor-pointer" onClick={() => onTabChange('draws')}>
                  <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontWeight: 700 }}>Manage Draws</p>
                  <ArrowRight />
                </button>
              </div>

              {/* Draw Rows */}
              <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                {property.draws.map((draw, idx) => {
                  const isLast = idx === property.draws.length - 1;
                  const statusLabel = draw.status === 'Draft' ? 'Pending' : draw.status;
                  const dateStr = new Date(draw.requestDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  return (
                    <div key={draw.id} className="content-stretch flex items-center justify-between py-[20px] relative shrink-0 w-full">
                      {!isLast && <div aria-hidden="true" className="absolute border-[#d9d9d9] border-b border-solid inset-0 pointer-events-none" />}
                      <div className="content-stretch flex flex-[1_0_0] items-center justify-between min-h-px min-w-px relative">
                        {/* Left info */}
                        <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 whitespace-nowrap">
                          <p className="relative shrink-0 text-[#764d2f] text-[14px]" style={{ fontWeight: 510 }}>Draw #{idx + 1}</p>
                          <p className="relative shrink-0 text-[#3e2d1d] text-[16px]" style={{ fontWeight: 700 }}>{draw.title}</p>
                          <p className="relative shrink-0 text-[#764d2f] text-[14px]" style={{ fontWeight: 510 }}>{dateStr}</p>
                        </div>
                        {/* Right: amount + status */}
                        <div className="content-stretch flex flex-col gap-[8px] items-end relative shrink-0">
                          <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontWeight: 700 }}>
                            {formatCurrency(draw.totalAmount)}
                          </p>
                          <div className="bg-[#fcf6f0] content-stretch flex items-center justify-center px-[16px] py-[4px] relative rounded-[100px] shrink-0">
                            <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] whitespace-nowrap" style={{ fontWeight: 510 }}>
                              {statusLabel}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {property.draws.length === 0 && (
                  <p className="text-[#8C8780] text-[14px] py-[20px]" style={{ fontWeight: 510 }}>No draw requests yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Budget Summary Stat Item ────────────────────────────────────── */

function BudgetSummaryStatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-stretch flex flex-col items-start justify-center relative shrink-0">
      <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 text-center whitespace-nowrap">
        <p className="relative shrink-0 text-[#764d2f] text-[14px]" style={{ fontWeight: 510 }}>{label}</p>
        <p className="relative shrink-0 text-[#3e2d1d] text-[24px]" style={{ fontWeight: 700 }}>{value}</p>
      </div>
    </div>
  );
}

/* ─── Budget Category Row ──────────────────────────────────────────── */

function BudgetCategoryRow({ name, budget, drawn, pct }: { name: string; budget: number; drawn: number; pct: number }) {
  const drawnLabel = pct >= 100 ? 'Fully drawn' : `${pct}% drawn`;
  const barWidth = Math.min(pct, 100);

  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
      <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
        <div className="content-stretch flex items-center justify-between leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
          <p className="relative shrink-0" style={{ fontWeight: 510 }}>{name}</p>
          <p className="relative shrink-0" style={{ fontWeight: 510 }}>{formatCurrency(budget)}</p>
        </div>
        <div className="bg-[#d9d9d9] h-[7px] relative rounded-[100px] shrink-0 w-full">
          <div className="h-full bg-[#3e2d1d] rounded-[100px] transition-all duration-300" style={{ width: `${barWidth}%` }} />
        </div>
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
          <p className="leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap" style={{ fontWeight: 510 }}>{drawnLabel}</p>
          <div className="content-stretch flex items-center relative shrink-0">
            <p className="leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap" style={{ fontWeight: 510 }}>{formatCurrency(drawn)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Pro Forma Section ───────────────────────────────────────────── */

function ProFormaSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white content-stretch flex flex-col gap-[16px] items-start leading-[normal] relative rounded-[8px] shrink-0 w-full whitespace-nowrap">
      <p className="relative shrink-0 text-[#764d2f] text-[16px]" style={{ fontWeight: 700 }}>
        {title}
      </p>
      <div className="content-stretch flex flex-col items-start relative shrink-0 text-[#3e2d1d] text-[14px] w-full">
        {children}
      </div>
    </div>
  );
}

/* ─── Pro Forma Row ────────────────────────────────────────────────── */

function ProFormaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
      <p className="relative shrink-0" style={{ fontWeight: 510 }}>{label}</p>
      <p className="relative shrink-0" style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}