import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  Check, Hammer, Repeat, Home, ClipboardList, Building2,
  ArrowLeft,
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useApp, formatCurrency } from '@/app/context/AppContext';
import type { ProForma } from '@/app/context/AppContext';
import svgPaths from '@/icons/property-proforma-tab';

const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";

/* ─── Figma-exact colors for cost breakdown (matching legend order) ── */
const BREAKDOWN_COLORS = ['#764D2F', '#3E2D1D', '#E8DFD4', '#A67B5B', '#C7AF97'];

function compact(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return formatCurrency(n);
}

function isProFormaFilled(pf: ProForma) {
  return pf.purchasePrice > 0 || pf.afterRepairValue > 0 || pf.rehabCost > 0;
}

export function ProFormaTab({ propertyId }: { propertyId: string }) {
  const { state, updateProForma } = useApp();
  const navigate = useNavigate();
  const property = state.properties.find(p => p.id === propertyId)!;
  const filled = isProFormaFilled(property.proforma);

  const viewCalc = getCalcs(property.proforma);

  if (filled) {
    return <ProFormaView pf={property.proforma} calc={viewCalc} onEdit={() => navigate(`/dashboard/properties/${propertyId}/proforma/edit`)} />;
  }

  // If not filled, redirect to the edit page
  return (
    <div className="content-stretch flex flex-col gap-[24px] items-center justify-center py-[64px] relative shrink-0 w-full">
      <p className={`${canela} text-[28px] text-[#3E2D1D]`}>Set Up Pro Forma</p>
      <p className="text-[16px] text-[#764d2f]" style={{ fontWeight: 510 }}>Model your deal economics to get started.</p>
      <button
        onClick={() => navigate(`/dashboard/properties/${propertyId}/proforma/edit`)}
        className="bg-[#764d2f] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#5c3a22] transition-colors text-white"
        style={{ fontWeight: 590 }}
      >
        Set Up Pro Forma
      </button>
    </div>
  );
}

/* ─── Calculations ────────────────────────────────────────────────────── */

function getCalcs(pf: ProForma) {
  const totalInvestment = pf.purchasePrice + pf.rehabCost + pf.holdingCosts + pf.financingCosts + pf.softCosts;
  const grossProfit = pf.afterRepairValue - totalInvestment;
  const roi = totalInvestment > 0 ? (grossProfit / totalInvestment) * 100 : 0;
  const equityIn = totalInvestment - pf.loanAmount;
  const cocReturn = equityIn > 0 ? (grossProfit / equityIn) * 100 : roi;
  const ltvRatio = pf.afterRepairValue > 0 ? (pf.loanAmount / pf.afterRepairValue) * 100 : 0;
  const monthlyInterest = pf.loanAmount > 0 ? (pf.loanAmount * (pf.interestRate / 100)) / 12 : 0;
  const totalInterest = monthlyInterest * pf.loanTermMonths;
  const profitMargin = pf.afterRepairValue > 0 ? (grossProfit / pf.afterRepairValue) * 100 : 0;

  const costBreakdown = [
    { name: 'Purchase', value: pf.purchasePrice },
    { name: 'Rehab', value: pf.rehabCost },
    { name: 'Holding', value: pf.holdingCosts },
    { name: 'Financing', value: pf.financingCosts },
    { name: 'Soft Costs', value: pf.softCosts },
  ];

  const waterfallData = [
    { name: 'Purchase', amount: pf.purchasePrice },
    { name: 'Rehab', amount: pf.rehabCost },
    { name: 'Holding', amount: pf.holdingCosts },
    { name: 'Financing', amount: pf.financingCosts },
    { name: 'Soft Costs', amount: pf.softCosts },
  ];

  return { totalInvestment, grossProfit, roi, equityIn, cocReturn, ltvRatio, monthlyInterest, totalInterest, profitMargin, costBreakdown, waterfallData };
}

type Calcs = ReturnType<typeof getCalcs>;

const EXIT_STRATEGIES = [
  { id: 'Fix & Flip', label: 'Fix & Flip', icon: '🔨' },
  { id: 'BRRRR', label: 'BRRRR', icon: '🔁' },
  { id: 'Hold & Rent', label: 'Hold & Rent', icon: '🏠' },
  { id: 'Wholesale', label: 'Wholesale', icon: '📋' },
  { id: 'Development', label: 'Development', icon: '🏗️' },
];

/* ═══════════════════════════════════════════════════════════════════ */
/*  Figma SVG Icons                                                   */
/* ═══════════════════════════════════════════════════════════════════ */

function WalletIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[13.54%_30.21%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.3125 15.3125">
            <path clipRule="evenodd" d={svgPaths.pd538a80} fill="#764D2F" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function MoneyBagIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[9.37%_12.48%_5.21%_12.48%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.759 17.9375">
            <g>
              <path clipRule="evenodd" d={svgPaths.p84139f0} fill="#764D2F" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p253c2900} fill="#764D2F" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartUpIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <g>
              <path d={svgPaths.p60ac100} fill="#764D2F" />
              <path clipRule="evenodd" d={svgPaths.p1f9e6d80} fill="#764D2F" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function ChartIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <g>
              <path d={svgPaths.p2cd74700} fill="#764D2F" />
              <path clipRule="evenodd" d={svgPaths.p1f9e6d80} fill="#764D2F" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function MoneyIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[16.67%_8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 14">
            <g>
              <path clipRule="evenodd" d={svgPaths.p253bfec0} fill="#764D2F" fillRule="evenodd" />
              <path clipRule="evenodd" d={svgPaths.p277fe4f0} fill="#764D2F" fillRule="evenodd" />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

function EditPenIcon() {
  return (
    <div className="relative shrink-0 size-[16.536px]">
      <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.5355 16.5355">
        <path clipRule="evenodd" d={svgPaths.p22c0000} fill="#3E2D1D" fillRule="evenodd" />
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  View Mode — Figma-exact layout                                    */
/* ═══════════════════════════════════════════════════════════════════ */

function ProFormaView({ pf, calc, onEdit }: { pf: ProForma; calc: Calcs; onEdit: () => void }) {
  const { totalInvestment, grossProfit, roi, cocReturn, ltvRatio, profitMargin, equityIn, costBreakdown, waterfallData, monthlyInterest } = calc;

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

  const BarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#3E2D1D] text-white px-[12px] py-[8px] rounded-[8px] text-[12px] shadow-lg" style={{ fontWeight: 510 }}>
          {payload[0].payload.name}: {formatCurrency(payload[0].value)}
        </div>
      );
    }
    return null;
  };

  const pieDataFiltered = costBreakdown.filter(c => c.value > 0);

  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-full">
      {/* ── Header: Title + Edit Button ── */}
      <div className="content-stretch flex flex-col sm:flex-row sm:items-end justify-between relative shrink-0 w-full gap-[16px] sm:gap-0">
        <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0">
          <p className={`${canela} relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px]`}>Pro Forma</p>
          <p className="relative shrink-0 text-[#764d2f] text-[14px] sm:text-[16px]" style={{ fontWeight: 510 }}>Upload a PDF and we'll extract your financial data.</p>
        </div>
        <button
          onClick={onEdit}
          className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#FCF6F0] transition-colors self-start sm:self-auto"
        >
          <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
          <EditPenIcon />
          <p className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontWeight: 590 }}>
            Edit Pro Forma
          </p>
        </button>
      </div>

      {/* ── KPI Cards Row ── */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
        <div className="content-stretch grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-[16px] items-start relative shrink-0 w-full">
          <KPICard icon={<WalletIcon />} label="Total Investment" value={compact(totalInvestment)} />
          <KPICard icon={<MoneyBagIcon />} label="After Repair Value" value={compact(pf.afterRepairValue)} />
          <KPICard icon={<ChartUpIcon />} label="Gross Profit" value={`+${compact(grossProfit)}`} />
          <KPICard icon={<ChartIcon />} label="ROI" value={`${roi.toFixed(1)}%`} />
          <KPICard icon={<MoneyIcon />} label="Cash-on-Cash" value={`${cocReturn.toFixed(1)}%`} />
        </div>

        {/* ── Row 2: Investment Breakdown + Financing ── */}
        <div className="content-stretch flex flex-col xl:flex-row gap-[16px] items-start relative shrink-0 w-full">
          {/* Investment Breakdown Card */}
          <div className="bg-white content-stretch flex flex-col items-end p-[24px] relative rounded-[20px] shrink-0 w-full xl:w-[636px]">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="content-stretch flex flex-col gap-[38px] items-center justify-center relative shrink-0 w-full">
              {/* Title */}
              <div className="content-stretch flex items-center relative shrink-0 w-full">
                <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Investment Breakdown</p>
              </div>

              {/* Donut Chart */}
              <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                <div className="overflow-clip relative shrink-0 size-[220px] sm:size-[274px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieDataFiltered.length > 0 ? pieDataFiltered : [{ name: 'Empty', value: 1 }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={82}
                        outerRadius={130}
                        paddingAngle={1}
                        dataKey="value"
                        stroke="none"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {(pieDataFiltered.length > 0 ? pieDataFiltered : [{ name: 'Empty', value: 1 }]).map((entry, i) => (
                          <Cell key={`pie-${entry.name}-${i}`} fill={pieDataFiltered.length > 0 ? BREAKDOWN_COLORS[costBreakdown.findIndex(c => c.name === entry.name) % BREAKDOWN_COLORS.length] : '#E8DFD4'} />
                        ))}
                      </Pie>
                      {pieDataFiltered.length > 0 && <Tooltip content={<PieTooltip />} />}
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Center text */}
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex flex-col items-center leading-[normal] left-[50%] text-center top-[50%]">
                    <p className="relative shrink-0 text-[#764d2f] text-[16px]" style={{ fontWeight: 510 }}>Total Investment</p>
                    <p className="relative shrink-0 text-[#3e2d1d] text-[35px]" style={{ fontWeight: 700 }}>{compact(totalInvestment)}</p>
                  </div>
                </div>
              </div>

              {/* Legend Row */}
              <div className="content-stretch flex flex-wrap gap-x-[16px] gap-y-[12px] sm:gap-[20px] items-center justify-center relative shrink-0 w-full">
                {costBreakdown.map((item, i) => (
                  <LegendItem key={item.name} color={BREAKDOWN_COLORS[i]} label={item.name} value={compact(item.value)} isLast={i === costBreakdown.length - 1} />
                ))}
              </div>
            </div>
          </div>

          {/* Financing Card */}
          <div className="bg-white w-full xl:flex-1 min-h-px min-w-px relative rounded-[20px]">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                {/* Title */}
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Financing</p>
                </div>

                {/* Rows */}
                <div className="content-stretch flex flex-col items-start leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
                  <FinancingRow label="Lender" value={pf.lenderName || '—'} />
                  <FinancingRow label="Lender Email" value={pf.lenderEmail || '—'} />
                  <FinancingRow label="Strategy" value={pf.exitStrategy} />
                  <FinancingRow label="Loan Amount" value={formatCurrency(pf.loanAmount)} />
                  <FinancingRow label="Term" value={`${pf.loanTermMonths} months`} />
                  <FinancingRow label="Interest Rate" value={`${pf.interestRate}%`} />
                  <FinancingRow label="Monthly Interest" value={compact(monthlyInterest)} />
                  <FinancingRow label="LTV Ratio" value={`${ltvRatio.toFixed(1)}%`} />
                  <FinancingRow label="Equity Required" value={compact(equityIn)} />
                  <FinancingRow label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 3: Deal Waterfall + Cost Comparison ── */}
        <div className="content-stretch flex flex-col xl:flex-row gap-[16px] min-h-0 xl:h-[509px] items-start relative shrink-0 w-full">
          {/* Deal Waterfall Card */}
          <div className="bg-white h-full relative rounded-[20px] shrink-0 w-full xl:w-[403px]">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
              <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">
                {/* Title */}
                <div className="content-stretch flex items-center relative shrink-0 w-full">
                  <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Deal Waterfall</p>
                </div>

                {/* Waterfall Rows */}
                <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">
                  {/* Cost items */}
                  <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
                    <div className="content-stretch flex flex-col items-start leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
                      {waterfallData.map(row => (
                        <WaterfallRow key={row.name} label={row.name} value={formatCurrency(row.amount)} />
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#d9d9d9] h-px shrink-0 w-full" />

                  {/* Totals section */}
                  <div className="bg-white content-stretch flex flex-col items-start relative rounded-[8px] shrink-0 w-full">
                    <div className="content-stretch flex flex-col items-start leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap">
                      <WaterfallRow label="Total Investment" value={formatCurrency(totalInvestment)} />
                      <WaterfallRow label="Loan Amount" value={formatCurrency(pf.loanAmount)} />
                      <WaterfallRow label="After Repair Value" value={formatCurrency(pf.afterRepairValue)} />
                    </div>
                  </div>

                  <div className="bg-[#d9d9d9] h-px shrink-0 w-full" />

                  {/* Gross Profit */}
                  <div className="content-stretch flex items-center justify-between leading-[normal] py-[10px] relative shrink-0 text-[#3e2d1d] w-full whitespace-nowrap">
                    <p className="relative shrink-0 text-[14px]" style={{ fontWeight: 510 }}>Gross Profit</p>
                    <p className="relative shrink-0 text-[18px]" style={{ fontWeight: 700 }}>+{formatCurrency(grossProfit)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cost Comparison Card (Bar Chart) */}
          <div className="bg-white w-full xl:flex-1 h-[400px] xl:h-full min-h-px min-w-px relative rounded-[20px]">
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            <div className="content-stretch flex flex-col items-start justify-between p-[24px] relative size-full">
              <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Cost Comparison</p>
              <div className="w-full flex-1 min-h-0 pt-[16px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterfallData} barCategoryGap="20%">
                    <CartesianGrid horizontal={true} vertical={false} stroke="rgba(34,34,34,0.12)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: 'rgba(34,34,34,0.9)', fontWeight: 510 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: 'rgba(34,34,34,0.9)', fontWeight: 510 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v: number) => compact(v)}
                      width={45}
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} fill="#764D2F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── KPI Card (Figma-exact) ──────────────────────────────────────── */

function KPICard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white min-h-px min-w-px relative rounded-[16px] self-stretch">
      <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start justify-center px-[28px] py-[20px] relative w-full">
          <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
            {icon}
            <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
              <p className="relative shrink-0 text-[#764d2f] text-[14px] w-full" style={{ fontWeight: 510 }}>{label}</p>
              <p className="relative shrink-0 text-[#3e2d1d] text-[28px] w-full" style={{ fontWeight: 700 }}>{value}</p>
            </div>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
    </div>
  );
}

/* ─── Legend Item ──────────────────────────────────────────────────── */

function LegendItem({ color, label, value, isLast }: { color: string; label: string; value: string; isLast: boolean }) {
  return (
    <>
      <div className="content-stretch flex items-center relative shrink-0 w-[82px]">
        <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
          <div className="content-stretch flex items-center py-[2px] relative shrink-0">
            <div className="rounded-[2.471px] shrink-0 size-[9.885px]" style={{ backgroundColor: color }} />
          </div>
          <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 text-center whitespace-nowrap">
            <p className="relative shrink-0 text-[#764d2f] text-[12px]" style={{ fontWeight: 510 }}>{label}</p>
            <p className="relative shrink-0 text-[#3e2d1d] text-[18px]" style={{ fontWeight: 700 }}>{value}</p>
          </div>
        </div>
      </div>
      {!isLast && <div className="bg-[#c4b29a] h-[38px] opacity-60 shrink-0 w-px" />}
    </>
  );
}

/* ─── Financing Row ──────────────────���────────────────────────────── */

function FinancingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
      <p className="relative shrink-0" style={{ fontWeight: 510 }}>{label}</p>
      <p className="relative shrink-0" style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}

/* ─── Waterfall Row ───────────────────────────────────────────────── */

function WaterfallRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="content-stretch flex items-center justify-between py-[10px] relative shrink-0 w-full">
      <p className="relative shrink-0" style={{ fontWeight: 510 }}>{label}</p>
      <p className="relative shrink-0" style={{ fontWeight: 700 }}>{value}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Edit Mode (Form) — preserved from original                       */
/* ═══════════════════════════════════════════════════════════════════ */

function ProFormaForm({ pf, calc, set, saved, dirty, onSave, onCancel, canCancel }: {
  pf: ProForma; calc: Calcs;
  set: (k: keyof ProForma, v: string | number) => void;
  saved: boolean; dirty: boolean;
  onSave: () => void; onCancel: () => void; canCancel: boolean;
}) {
  const { totalInvestment, grossProfit, roi, cocReturn, ltvRatio, monthlyInterest, profitMargin, equityIn } = calc;

  const costBreakdownEdit = [
    { label: 'Purchase', val: pf.purchasePrice, color: '#764D2F' },
    { label: 'Rehab', val: pf.rehabCost, color: '#3E2D1D' },
    { label: 'Holding', val: pf.holdingCosts, color: '#E8DFD4' },
    { label: 'Financing', val: pf.financingCosts, color: '#A67B5B' },
    { label: 'Soft', val: pf.softCosts, color: '#C7AF97' },
  ].filter(r => r.val > 0);

  return (
    <div className="flex gap-[32px] items-start">
      {/* Left column: Form */}
      <div className="flex-1 min-w-0 flex flex-col gap-[24px]">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[16px]">
            {canCancel && (
              <button
                onClick={onCancel}
                className="flex items-center gap-[6px] text-[14px] text-[#8C8780] hover:text-[#3E2D1D] transition-colors cursor-pointer"
                style={{ fontWeight: 510 }}
              >
                <ArrowLeft className="w-[14px] h-[14px]" />
              </button>
            )}
            <div>
              <p className={`${canela} text-[28px] text-[#3E2D1D]`}>
                {canCancel ? 'Edit Pro Forma' : 'Set Up Pro Forma'}
              </p>
              <p className="text-[14px] text-[#8C8780] mt-[2px]" style={{ fontWeight: 510 }}>
                {canCancel ? 'Update your deal economics' : 'Model your deal economics to get started'}
              </p>
            </div>
          </div>
          <button
            onClick={onSave}
            className={`flex items-center gap-[8px] h-[40px] px-[28px] rounded-[8px] text-[14px] transition-all cursor-pointer ${
              saved
                ? 'bg-[#FCF6F0] border border-[#764D2F] text-[#764D2F]'
                : dirty
                ? 'bg-[#3E2D1D] text-white hover:bg-[#2C1F14]'
                : 'bg-[#3E2D1D]/80 text-white/80 hover:bg-[#3E2D1D]'
            }`}
            style={{ fontWeight: 590 }}
          >
            {saved ? <><Check className="w-[14px] h-[14px]" /> Saved</> : 'Save Pro Forma'}
          </button>
        </div>

        {/* Strategy */}
        <FormSection title="Exit Strategy">
          <div className="flex flex-wrap gap-[8px]">
            {EXIT_STRATEGIES.map(s => {
              const isActive = pf.exitStrategy === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => set('exitStrategy', s.id)}
                  className={`flex items-center gap-[8px] px-[16px] py-[10px] rounded-[10px] border transition-all cursor-pointer text-[13px] ${
                    isActive
                      ? 'border-[#764D2F] bg-[#FCF6F0] text-[#764D2F]'
                      : 'border-[#E8E5E0] text-[#8C8780] hover:border-[#C7AF97] hover:text-[#3E2D1D]'
                  }`}
                  style={{ fontWeight: isActive ? 700 : 510 }}
                >
                  <span className={isActive ? 'text-[#764D2F]' : 'text-[#B5B0A8]'}>{s.icon}</span>
                  {s.label}
                  {isActive && (
                    <div className="w-[16px] h-[16px] rounded-full bg-[#764D2F] flex items-center justify-center ml-[2px]">
                      <Check className="w-[10px] h-[10px] text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </FormSection>

        {/* Acquisition */}
        <FormSection title="Acquisition">
          <div className="grid grid-cols-2 gap-[16px]">
            <Field label="Purchase Price" value={pf.purchasePrice} onChange={v => set('purchasePrice', v)} prefix="$" />
            <Field label="Rehab / Construction" value={pf.rehabCost} onChange={v => set('rehabCost', v)} prefix="$" />
          </div>
        </FormSection>

        {/* Carrying Costs */}
        <FormSection title="Carrying Costs">
          <div className="grid grid-cols-3 gap-[16px]">
            <Field label="Holding Costs" value={pf.holdingCosts} onChange={v => set('holdingCosts', v)} prefix="$" />
            <Field label="Financing Costs" value={pf.financingCosts} onChange={v => set('financingCosts', v)} prefix="$" />
            <Field label="Soft Costs" value={pf.softCosts} onChange={v => set('softCosts', v)} prefix="$" />
          </div>
        </FormSection>

        {/* Exit Value */}
        <FormSection title="Exit Value">
          <div className="grid grid-cols-2 gap-[16px]">
            <Field label="After Repair Value (ARV)" value={pf.afterRepairValue} onChange={v => set('afterRepairValue', v)} prefix="$" accent />
            <div className="flex flex-col justify-end pb-[2px]">
              {totalInvestment > 0 && pf.afterRepairValue > 0 && (
                <div className="bg-[#FAFAF9] rounded-[10px] border border-[#F0EEEA] px-[16px] py-[12px]">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>Projected Profit</span>
                    <span className="text-[16px]" style={{ color: grossProfit >= 0 ? '#3E2D1D' : '#EF4444', fontWeight: 700 }}>
                      {grossProfit >= 0 ? '+' : ''}{compact(grossProfit)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-[6px]">
                    <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>ROI</span>
                    <span className="text-[14px] text-[#764D2F]" style={{ fontWeight: 700 }}>{roi.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </FormSection>

        {/* Financing */}
        <FormSection title="Financing">
          <div className="grid grid-cols-2 gap-[16px]">
            <Field label="Lender Name" value={pf.lenderName} onChangeText={v => set('lenderName', v)} placeholder="e.g. First National Capital" />
            <Field label="Lender Email" value={pf.lenderEmail || ''} onChangeText={v => set('lenderEmail', v)} placeholder="draws@lender.com" />
          </div>
          <div className="grid grid-cols-3 gap-[16px] mt-[16px]">
            <Field label="Loan Amount" value={pf.loanAmount} onChange={v => set('loanAmount', v)} prefix="$" />
            <Field label="Interest Rate" value={pf.interestRate} onChangeNum={v => set('interestRate', v)} suffix="%" step={0.25} />
            <Field label="Loan Term" value={pf.loanTermMonths} onChangeNum={v => set('loanTermMonths', v)} suffix="months" step={1} />
          </div>
        </FormSection>
      </div>

      {/* Right column: Live Analysis */}
      <div className="w-[320px] shrink-0 sticky top-[24px] flex flex-col gap-[20px]">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
        >
          <p className={`${canela} text-[24px] text-[#3E2D1D] mb-[20px]`}>
            Live Analysis
          </p>
          <div className="grid grid-cols-2 gap-[12px]">
            <MetricCell label="Gross Profit" value={grossProfit >= 0 ? `+${compact(grossProfit)}` : compact(grossProfit)} positive={grossProfit >= 0} />
            <MetricCell label="ROI" value={`${roi.toFixed(1)}%`} positive={roi >= 0} />
            <MetricCell label="Cash-on-Cash" value={`${cocReturn.toFixed(1)}%`} positive={cocReturn >= 0} />
            <MetricCell label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} positive={profitMargin >= 0} />
          </div>
          {pf.loanAmount > 0 && (
            <div className="grid grid-cols-2 gap-[12px] mt-[12px]">
              <MetricCell label="LTV Ratio" value={`${ltvRatio.toFixed(1)}%`} positive={ltvRatio <= 75} warn={ltvRatio > 80} />
              <MetricCell label="Monthly Int." value={compact(monthlyInterest)} />
            </div>
          )}
        </motion.div>

        {/* Mini Donut */}
        {costBreakdownEdit.length > 1 && totalInvestment > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
          >
            <p className={`${canela} text-[24px] text-[#3E2D1D] mb-[16px]`}>
              Cost Mix
            </p>
            <div className="flex items-center gap-[20px]">
              <MiniDonut items={costBreakdownEdit} total={totalInvestment} />
              <div className="flex-1 flex flex-col gap-[8px]">
                {costBreakdownEdit.map(item => (
                  <div key={item.label} className="flex items-center gap-[8px]">
                    <div className="w-[8px] h-[8px] rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                    <span className="text-[12px] text-[#8C8780] flex-1" style={{ fontWeight: 510 }}>{item.label}</span>
                    <span className="text-[12px] text-[#3E2D1D] tabular-nums" style={{ fontWeight: 510 }}>
                      {Math.round((item.val / totalInvestment) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Quick Info */}
        {(pf.lenderName || pf.exitStrategy) && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#FAFAF9] rounded-[16px] border border-[#F0EEEA] px-[20px] py-[16px]"
          >
            <div className="flex flex-col gap-[10px]">
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>Strategy</span>
                <span className="text-[12px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{pf.exitStrategy}</span>
              </div>
              {pf.lenderName && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>Lender</span>
                  <span className="text-[12px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{pf.lenderName}</span>
                </div>
              )}
              {equityIn > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>Equity Required</span>
                  <span className="text-[12px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{compact(equityIn)}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ─── Form Sub-components ────────────────────────────────────────── */

function MetricCell({ label, value, positive, warn }: { label: string; value: string; positive?: boolean; warn?: boolean }) {
  return (
    <div className="bg-[#FAFAF9] rounded-[10px] border border-[#F0EEEA] px-[14px] py-[10px]">
      <p className="text-[11px] text-[#8C8780] mb-[3px]" style={{ fontWeight: 510 }}>{label}</p>
      <p className="text-[16px] tabular-nums" style={{ fontWeight: 700, color: warn ? '#C2410C' : (positive === false ? '#EF4444' : '#3E2D1D') }}>{value}</p>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
      <p className={`${canela} text-[16px] text-[#3E2D1D] mb-[16px]`}>
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, onChangeText, onChangeNum, prefix, suffix, placeholder, accent, step }: {
  label: string; value: number | string; onChange?: (v: number) => void; onChangeText?: (v: string) => void;
  onChangeNum?: (v: number) => void; prefix?: string; suffix?: string; placeholder?: string; accent?: boolean; step?: number;
}) {
  const parseMoney = (v: string) => parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
  const fmtInput = (n: number) => (n > 0 ? n.toLocaleString() : '');

  if (onChangeText) {
    return (
      <div className="flex flex-col gap-[5px]">
        <label className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{label}</label>
        <input type="text" value={value as string} onChange={e => onChangeText(e.target.value)} placeholder={placeholder}
          className="w-full h-[42px] px-[14px] rounded-[8px] border border-[#E8E5E0] bg-white text-[14px] text-[#3E2D1D] placeholder-[#C5C0B9] focus:outline-none focus:border-[#764D2F] focus:ring-[1.5px] focus:ring-[#764D2F]/10 transition-all"
          style={{ fontWeight: 510 }} />
      </div>
    );
  }

  if (onChangeNum) {
    return (
      <div className="flex flex-col gap-[5px]">
        <label className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{label}</label>
        <div className="relative">
          <input type="number" value={value || ''} onChange={e => onChangeNum(parseFloat(e.target.value) || 0)} step={step} placeholder="0"
            className="w-full h-[42px] px-[14px] pr-[60px] rounded-[8px] border border-[#E8E5E0] bg-white text-[14px] text-[#3E2D1D] focus:outline-none focus:border-[#764D2F] focus:ring-[1.5px] focus:ring-[#764D2F]/10 transition-all"
            style={{ fontWeight: 510 }} />
          {suffix && <span className="absolute right-[14px] top-1/2 -translate-y-1/2 text-[12px] text-[#B5B0A8]" style={{ fontWeight: 510 }}>{suffix}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[5px]">
      <label className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{label}</label>
      <div className="relative">
        {prefix && <span className={`absolute left-[14px] top-1/2 -translate-y-1/2 text-[13px] ${accent ? 'text-[#764D2F]' : 'text-[#B5B0A8]'}`} style={{ fontWeight: 510 }}>{prefix}</span>}
        <input type="text" value={fmtInput(value as number)} onChange={e => onChange?.(parseMoney(e.target.value))} placeholder="0"
          className={`w-full h-[42px] ${prefix ? 'pl-[28px]' : 'pl-[14px]'} pr-[14px] rounded-[8px] border text-[14px] focus:outline-none focus:ring-[1.5px] focus:ring-[#764D2F]/10 transition-all ${
            accent ? 'border-[#764D2F]/40 bg-[#FCF6F0] text-[#764D2F] focus:border-[#764D2F]' : 'border-[#E8E5E0] bg-white text-[#3E2D1D] focus:border-[#764D2F]'
          }`}
          style={{ fontWeight: 510 }} />
      </div>
    </div>
  );
}

function MiniDonut({ items, total }: { items: { label: string; val: number; color: string }[]; total: number }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  let accumulated = 0;
  return (
    <div className="w-[90px] h-[90px] shrink-0 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
        {items.map(item => {
          const pct = total > 0 ? item.val / total : 0;
          const dashLength = pct * circumference;
          const dashOffset = accumulated * circumference;
          accumulated += pct;
          return (
            <circle key={item.label} cx="50" cy="50" r={radius} fill="none" stroke={item.color} strokeWidth="10"
              strokeDasharray={`${dashLength} ${circumference - dashLength}`} strokeDashoffset={-dashOffset} />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[11px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{compact(total)}</span>
      </div>
    </div>
  );
}