import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Building2, ChevronRight, Download, MapPin, Edit2 } from 'lucide-react';
import { useApp, getBudgetTotals, formatCurrency } from '../../context/AppContext';

export function ProjectFinancialStatement() {
  const { id } = useParams<{ id: string }>();
  const { state } = useApp();
  const property = state.properties.find(p => p.id === id);

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#8C8780]">Property not found.</p>
      </div>
    );
  }

  const pf = property.proforma;
  const totals = getBudgetTotals(property.budget, property.draws);
  const totalDrawn = property.draws
    .filter(d => d.status !== 'Draft')
    .reduce((s, d) => s + d.totalAmount, 0);
  const remainingLoanCapital = pf.loanAmount - totalDrawn;
  const equityContribution = (pf.purchasePrice + pf.rehabCost + pf.holdingCosts + pf.financingCosts + pf.softCosts) - pf.loanAmount;

  // Group budget by high-level categories
  const landCats = property.budget.categories.filter(c => c.name.toLowerCase().includes('land'));
  const softCats = property.budget.categories.filter(c => c.name.toLowerCase().includes('soft'));
  const constructionCats = property.budget.categories.filter(
    c => !c.name.toLowerCase().includes('land') &&
         !c.name.toLowerCase().includes('soft') &&
         !c.name.toLowerCase().includes('financing') &&
         !c.name.toLowerCase().includes('contingency')
  );
  const financingCats = property.budget.categories.filter(c => c.name.toLowerCase().includes('financing'));
  const contingencyCats = property.budget.categories.filter(c => c.name.toLowerCase().includes('contingency'));

  const sumBudget = (cats: typeof property.budget.categories) =>
    cats.reduce((s, c) => s + c.items.reduce((ss, i) => ss + i.budget, 0), 0);

  const landTotal = sumBudget(landCats);
  const softTotal = sumBudget(softCats);
  const constructionTotal = sumBudget(constructionCats);
  const financingTotal = sumBudget(financingCats);
  const contingencyTotal = sumBudget(contingencyCats);

  return (
    <div className="min-h-full">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 pt-5 pb-0 flex items-center gap-1.5 text-[14px] text-[#8C8780] overflow-x-auto" style={{ fontWeight: 510 }}>
        <Link to="/dashboard" className="hover:text-[#3E2D1D] transition-colors">Dashboard</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/dashboard/properties" className="hover:text-[#3E2D1D] transition-colors">Properties</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/dashboard/properties/${id}`} className="hover:text-[#3E2D1D] transition-colors">{property.name}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#764D2F]">Project Financial Statement</span>
      </div>

      <div className="px-4 sm:px-6 py-5 max-w-[1000px]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-[16px]"
        >
          <div>
            <p className="text-[36px] text-[#3E2D1D]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Project Financial Statement
            </p>
            <p className="text-[16px] text-[#8C8780] mt-[4px]" style={{ fontWeight: 510 }}>Capital structure and use of funds overview</p>
          </div>
          <button className="flex items-center gap-[10px] h-[50px] px-[48px] py-[10px] border-[1.5px] border-[#3E2D1D] rounded-[8px] text-[16px] text-[#3E2D1D] hover:bg-[#FCF6F0] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>
            <Download className="w-[16px] h-[16px]" /> Download PFS
          </button>
        </motion.div>

        {/* Property Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden mb-[24px]"
        >
          <div className="flex items-start gap-[20px] p-[24px]">
            <div className="w-[112px] h-[80px] rounded-[12px] overflow-hidden shrink-0 bg-[#FCF6F0]">
              <img src={property.coverImage} alt={property.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[8px] mb-[4px]">
                <p className="text-[18px] text-[#3E2D1D]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>{property.name}</p>
                <button className="p-[4px] rounded-[4px] hover:bg-[#FCF6F0] text-[#8C8780] cursor-pointer">
                  <Edit2 className="w-[12px] h-[12px]" />
                </button>
              </div>
              <div className="flex items-center gap-[6px] text-[14px] text-[#8C8780] mb-[8px]" style={{ fontWeight: 510 }}>
                <MapPin className="w-[14px] h-[14px]" />
                <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
              </div>
              <div className="flex items-center gap-[12px] text-[14px]">
                <span className="px-[12px] py-[4px] rounded-[100px] bg-[#FCF6F0] text-[#764D2F]" style={{ fontWeight: 510 }}>{pf.exitStrategy}</span>
                <span className="text-[#8C8780]" style={{ fontWeight: 510 }}>{formatCurrency(pf.loanAmount)} Loan</span>
                <span className="text-[#C7AF97]" style={{ fontWeight: 510 }}>#{id?.replace('prop-', '0')}</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-[24px]">
          {/* Left: Capital Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="sm:col-span-2 space-y-[24px]"
          >
            {/* Capital Breakdown */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <div className="flex items-center gap-[8px] mb-[20px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#764D2F]" />
                <p className="text-[18px] text-[#3E2D1D]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Capital Breakdown</p>
              </div>
              <div className="space-y-[12px]">
                <CapitalRow label="Total Loan" value={formatCurrency(pf.loanAmount)} />
                <CapitalRow
                  label="Equity Contribution"
                  value={formatCurrency(Math.max(0, equityContribution))}
                />
                <div className="border-t border-[#D0D0D0] pt-3">
                  <CapitalRow
                    label="Total Project Cost"
                    value={formatCurrency(totals.totalBudget)}
                    bold
                  />
                </div>
              </div>
            </div>

            {/* Use of Funds */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <div className="flex items-center gap-[8px] mb-[20px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#C7AF97]" />
                <p className="text-[18px] text-[#3E2D1D]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Use of Funds</p>
              </div>
              <div className="space-y-[12px]">
                {landTotal > 0 && <UseOfFundsRow label="Land Acquisition" value={formatCurrency(landTotal)} />}
                {softTotal > 0 && <UseOfFundsRow label="Soft Costs" value={formatCurrency(softTotal)} />}
                {constructionTotal > 0 && <UseOfFundsRow label="Construction Costs" value={formatCurrency(constructionTotal)} />}
                {financingTotal > 0 && <UseOfFundsRow label="Financing Costs" value={formatCurrency(financingTotal)} />}
                {contingencyTotal > 0 && <UseOfFundsRow label="Contingency" value={formatCurrency(contingencyTotal)} />}
                <div className="border-t border-[#D0D0D0] pt-2 mt-2">
                  <UseOfFundsRow label="Total" value={formatCurrency(totals.totalBudget)} bold />
                </div>
              </div>
            </div>

            {/* Draw History */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <p className="text-[18px] text-[#3E2D1D] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Draw History</p>
              {property.draws.length === 0 ? (
                <p className="text-[14px] text-[#8C8780] text-center py-[16px]" style={{ fontWeight: 510 }}>No draws yet.</p>
              ) : (
                <div className="flex flex-col">
                  {property.draws.map(draw => (
                    <div key={draw.id} className="flex items-center justify-between py-[16px]" style={{ borderBottom: '1px solid #FCF6F0' }}>
                      <div>
                        <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{draw.title}</p>
                        <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>{draw.requestDate} · {draw.status}</p>
                      </div>
                      <span className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{formatCurrency(draw.totalAmount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right: Remaining Loan Capital + Summary */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="space-y-[24px]"
          >
            {/* Remaining Loan Capital */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <div className="flex items-center justify-between mb-[16px]">
                <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>Remaining</p>
                <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>Loan Capital</p>
              </div>
              <p className="text-[28px] text-[#3E2D1D] mb-[16px]" style={{ fontWeight: 700 }}>
                {formatCurrency(Math.max(0, remainingLoanCapital))}
              </p>
              {/* Progress bar */}
              <div className="h-[10px] rounded-[100px] bg-[#D9D9D9] overflow-hidden mb-[8px]">
                <motion.div
                  className="h-full bg-[#3E2D1D] rounded-[100px]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pf.loanAmount > 0 ? Math.min(100, Math.round((totalDrawn / pf.loanAmount) * 100)) : 0}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
              <div className="flex items-center justify-between text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>
                <span>{formatCurrency(totalDrawn)} drawn</span>
                <span>{pf.loanAmount > 0 ? Math.round((totalDrawn / pf.loanAmount) * 100) : 0}%</span>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <p className="text-[18px] text-[#3E2D1D] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Cost Summary</p>
              <div className="flex flex-col gap-[12px]">
                {landTotal > 0 && (
                  <CostRow label="Land Acquisition" value={formatCurrency(landTotal)} />
                )}
                {softTotal > 0 && (
                  <CostRow label="Soft Costs" value={formatCurrency(softTotal)} />
                )}
                {constructionTotal > 0 && (
                  <CostRow label="Construction costs" value={formatCurrency(constructionTotal)} />
                )}
                {financingTotal > 0 && (
                  <CostRow label="Financing" value={formatCurrency(financingTotal)} />
                )}
                {contingencyTotal > 0 && (
                  <CostRow label="Contingency" value={formatCurrency(contingencyTotal)} />
                )}
                <div className="border-t border-[#D0D0D0] pt-[8px]">
                  <CostRow label="Total" value={formatCurrency(totals.totalBudget)} bold />
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
              <p className="text-[18px] text-[#3E2D1D] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Loan Details</p>
              <div className="flex flex-col gap-[12px]">
                <CostRow label="Lender" value={pf.lenderName || '—'} />
                <CostRow label="Loan Amount" value={formatCurrency(pf.loanAmount)} />
                <CostRow label="Interest Rate" value={`${pf.interestRate}%`} />
                <CostRow label="Term" value={`${pf.loanTermMonths} months`} />
                <CostRow label="Exit Strategy" value={pf.exitStrategy} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function CapitalRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[14px] ${bold ? 'text-[#3E2D1D]' : 'text-[#8C8780]'}`} style={{ fontWeight: 510 }}>{label}</span>
      <span className="text-[16px] text-[#3E2D1D]" style={{ fontWeight: bold ? 700 : 510 }}>{value}</span>
    </div>
  );
}

function UseOfFundsRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-[4px]">
      <span className={`text-[14px] ${bold ? 'text-[#3E2D1D]' : 'text-[#8C8780]'}`} style={{ fontWeight: 510 }}>{label}</span>
      <span className="text-[16px] text-[#3E2D1D]" style={{ fontWeight: bold ? 700 : 510 }}>{value}</span>
    </div>
  );
}

function CostRow({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={`text-[14px] ${bold ? 'text-[#3E2D1D]' : 'text-[#8C8780]'}`} style={{ fontWeight: 510 }}>{label}</span>
      <span className="text-[16px] text-[#3E2D1D]" style={{ fontWeight: bold ? 700 : 510 }}>{value}</span>
    </div>
  );
}