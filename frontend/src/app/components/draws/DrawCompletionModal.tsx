import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, CheckCircle, Users, DollarSign, ChevronRight } from 'lucide-react';
import { formatCurrency, getBudgetTotals } from '../../context/AppContext';
import type { DrawRequest, DashboardProperty } from '../../context/AppContext';

// Mock lender data for the packet funding simulation
interface Lender {
  id: string;
  name: string;
  amount: number;
  confirmed: boolean;
  avatar: string;
}

function generateMockLenders(drawAmount: number): Lender[] {
  const names = ['Steve Phillips', 'Emily Harris', 'Michael Clark', 'David Ross', 'Brent Williams', 'Sarah Chen'];
  const colors = ['#764D2F', '#3E2D1D', '#D97706', '#8B5CF6', '#6366F1', '#06B6D4'];
  const numLenders = Math.min(names.length, Math.max(2, Math.floor(Math.random() * 3) + 3));
  const ownerContribPct = 0.2 + Math.random() * 0.15;
  const ownerContrib = Math.round(drawAmount * ownerContribPct);
  const lenderPool = drawAmount - ownerContrib;

  const lenders: Lender[] = [];
  let remaining = lenderPool;
  for (let i = 0; i < numLenders; i++) {
    const isLast = i === numLenders - 1;
    const share = isLast ? remaining : Math.round(lenderPool * (0.15 + Math.random() * 0.15));
    const amt = Math.min(share, remaining);
    remaining -= amt;
    lenders.push({
      id: `lender-${i}`,
      name: names[i],
      amount: amt,
      confirmed: true,
      avatar: colors[i],
    });
  }
  return lenders;
}

interface Props {
  draw: DrawRequest;
  property: DashboardProperty;
  onClose: () => void;
}

type View = 'summary' | 'packet';

export function DrawCompletionModal({ draw, property, onClose }: Props) {
  const [view, setView] = useState<View>('summary');
  const [lenders] = useState(() => generateMockLenders(draw.totalAmount));

  const totals = getBudgetTotals(property.budget, property.draws);
  const totalDrawn = property.draws
    .filter(d => d.status !== 'Draft')
    .reduce((s, d) => s + d.totalAmount, 0);

  const lenderTotal = lenders.reduce((s, l) => s + l.amount, 0);
  const ownerContribution = draw.totalAmount - lenderTotal;
  const confirmedCount = lenders.filter(l => l.confirmed).length;
  const contrPct = draw.totalAmount > 0 ? ((ownerContribution / draw.totalAmount) * 100).toFixed(2) : '0';

  // Donut chart calculations
  const packetPct = draw.totalAmount > 0 ? (lenderTotal / draw.totalAmount) * 100 : 0;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] border border-[#D0D0D0] w-full max-w-[760px] max-h-[92vh] overflow-hidden flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E5E0] shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] text-[#8C8780] mb-0.5" style={{ fontWeight: 510 }}>
              <span>{property.name}</span>
            </div>
            <h2 className="text-[20px] text-[#3E2D1D] tracking-[-0.02em]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Draw Completion</h2>
            <p className="text-[13px] text-[#8C8780]" style={{ fontWeight: 510 }}>
              Review and finalize your draw.{' '}
              <button
                onClick={() => setView('packet')}
                className="text-[#764D2F] hover:underline cursor-pointer"
              >
                Packet Funding Summary
              </button>.
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FCF6F0] text-[#8C8780] cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* View toggle */}
        <div className="px-6 py-3 border-b border-[#E8E5E0] bg-[#FAFAF9] shrink-0">
          <div className="flex items-center gap-1 bg-[#F0EDE7] rounded-xl p-0.5 w-fit">
            <button
              onClick={() => setView('summary')}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer ${view === 'summary' ? 'bg-white text-[#3E2D1D] shadow-sm' : 'text-[#8C8780] hover:text-[#3E2D1D]'}`}
              style={{ fontWeight: 510 }}
            >
              Status
            </button>
            <button
              onClick={() => setView('packet')}
              className={`px-4 py-1.5 rounded-lg text-[12px] transition-colors cursor-pointer ${view === 'packet' ? 'bg-white text-[#3E2D1D] shadow-sm' : 'text-[#8C8780] hover:text-[#3E2D1D]'}`}
              style={{ fontWeight: 510 }}
            >
              Complete
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <AnimatePresence mode="wait">
            {view === 'summary' ? (
              <motion.div
                key="summary"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                {/* Progress Summary */}
                <div className="bg-[#FAFAF9] rounded-[14px] border border-[#F0EEEA] p-5">
                  <h3 className="text-[13px] text-[#8C8780] uppercase tracking-wider mb-4" style={{ fontWeight: 510 }}>Progress Summary</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-[11px] text-[#8C8780] mb-1" style={{ fontWeight: 510 }}>Total Loan Amount</p>
                      <p className="text-[22px] text-[#3E2D1D] tracking-[-0.02em]" style={{ fontWeight: 700 }}>{formatCurrency(property.proforma.loanAmount)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8C8780] mb-1" style={{ fontWeight: 510 }}>Total Collaborator Funding</p>
                      <p className="text-[22px] text-[#3E2D1D] tracking-[-0.02em]" style={{ fontWeight: 700 }}>{formatCurrency(totalDrawn)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#8C8780] mb-1" style={{ fontWeight: 510 }}>Current Draw Request</p>
                      <p className="text-[22px] text-[#764D2F] tracking-[-0.02em]" style={{ fontWeight: 700 }}>{formatCurrency(draw.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Sources */}
                <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>Sources</h3>
                    <button
                      onClick={() => setView('packet')}
                      className="flex items-center gap-1.5 text-[12px] text-[#764D2F] hover:text-[#3E2D1D] cursor-pointer"
                      style={{ fontWeight: 510 }}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Lenders Confirmed
                    </button>
                  </div>

                  <div className="flex items-start gap-8">
                    {/* Donut Chart */}
                    <div className="shrink-0">
                      <div className="relative w-32 h-32">
                        <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                          <circle cx="60" cy="60" r="50" fill="none" stroke="#E8E5E0" strokeWidth="14" />
                          <circle
                            cx="60" cy="60" r="50" fill="none"
                            stroke="#3E2D1D" strokeWidth="14"
                            strokeDasharray={`${packetPct * 3.14} ${(100 - packetPct) * 3.14}`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{formatCurrency(lenderTotal)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-[11px] text-[#8C8780]" style={{ fontWeight: 510 }}>Packet Funding</p>
                        <p className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{formatCurrency(lenderTotal)}</p>
                        <p className="text-[10px] text-[#8C8780]" style={{ fontWeight: 510 }}>Sources</p>
                      </div>
                    </div>

                    {/* Lender List */}
                    <div className="flex-1 space-y-2.5">
                      {lenders.map(lender => (
                        <div key={lender.id} className="flex items-center justify-between py-1.5">
                          <div className="flex items-center gap-2.5">
                            <div
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px]"
                              style={{ backgroundColor: lender.avatar, fontWeight: 510 }}
                            >
                              {lender.name.split(' ').map(w => w[0]).join('')}
                            </div>
                            <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{lender.name}</span>
                          </div>
                          <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{formatCurrency(lender.amount)}</span>
                        </div>
                      ))}
                      <div className="border-t border-[#E8E5E0] pt-2.5 flex items-center justify-between">
                        <span className="text-[13px] text-[#8C8780]" style={{ fontWeight: 510 }}>Owner Contribution</span>
                        <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{formatCurrency(Math.max(0, ownerContribution))}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="packet"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-5"
              >
                {/* Packet Funding Summary Header */}
                <div>
                  <h2 className="text-[20px] text-[#3E2D1D] tracking-[-0.02em] mb-1" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>Packet Funding Summary</h2>
                  <p className="text-[13px] text-[#8C8780]" style={{ fontWeight: 510 }}>Review and finalize your draw request packet.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <MetricCard label="Request Amount" value={formatCurrency(draw.totalAmount)} />
                  <MetricCard label="Sent to Lenders" value={`${lenders.length} Lenders`} />
                  <MetricCard
                    label="Confirmed"
                    value={`${confirmedCount} / ${lenders.length}`}
                    sub={`${lenders.length - confirmedCount} interested`}
                    color="#764D2F"
                  />
                  <MetricCard label="Contr Percentage" value={`${contrPct}%`} />
                </div>

                {/* Lenders Confirmed + Owner Contribution */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Lenders */}
                  <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>Lenders Confirmed</h3>
                      <span className="text-[12px] text-[#764D2F] bg-[#FCF6F0] px-2 py-0.5 rounded-full" style={{ fontWeight: 510 }}>
                        {formatCurrency(lenderTotal)}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {lenders.map(lender => (
                        <div key={lender.id} className="flex items-center gap-3 py-2 border-b border-[#F0EEEA] last:border-0">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] shrink-0"
                            style={{ backgroundColor: lender.avatar, fontWeight: 510 }}
                          >
                            {lender.name.split(' ').map(w => w[0]).join('')}
                          </div>
                          <span className="text-[13px] text-[#3E2D1D] flex-1" style={{ fontWeight: 510 }}>{lender.name}</span>
                          <span className="text-[13px] text-[#8C8780]" style={{ fontWeight: 510 }}>{formatCurrency(lender.amount)}</span>
                          {lender.confirmed && (
                            <CheckCircle className="w-4 h-4 text-[#764D2F] shrink-0" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Owner Contribution */}
                  <div className="space-y-4">
                    <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-5">
                      <h3 className="text-[13px] text-[#8C8780] mb-2" style={{ fontWeight: 510 }}>Owner Contribution</h3>
                      <div className="flex items-center justify-between py-2 border-b border-[#F0EEEA]">
                        <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{property.proforma.lenderName || 'Owner'}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{formatCurrency(Math.max(0, ownerContribution))}</span>
                          <Check className="w-3.5 h-3.5 text-[#764D2F]" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-5">
                      <h3 className="text-[13px] text-[#8C8780] mb-2" style={{ fontWeight: 510 }}>Packet Confirmed</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[18px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>100</p>
                        <span className="text-[12px] text-[#764D2F]" style={{ fontWeight: 510 }}>complete</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-[14px] border border-[#E8E5E0] p-5">
                      <h3 className="text-[13px] text-[#8C8780] mb-2" style={{ fontWeight: 510 }}>Owner Contribution</h3>
                      <p className="text-[18px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{formatCurrency(Math.max(0, ownerContribution))}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E8E5E0] shrink-0 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-[10px] border border-[#D0D0D0] text-[13px] text-[#8C8780] hover:bg-[#FCF6F0] transition-colors cursor-pointer"
            style={{ fontWeight: 510 }}
          >
            Close
          </button>
          <button
            className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#3E2D1D] text-white text-[13px] hover:bg-[#2C1F14] transition-colors cursor-pointer"
            style={{ fontWeight: 590 }}
          >
            Finalize Draw <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function MetricCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-[#FAFAF9] rounded-[12px] border border-[#F0EEEA] p-4">
      <p className="text-[10px] text-[#8C8780] mb-1" style={{ fontWeight: 510 }}>{label}</p>
      <p className="text-[18px] tracking-[-0.02em]" style={{ color: color || '#3E2D1D', fontWeight: 700 }}>{value}</p>
      {sub && <p className="text-[10px] text-[#8C8780] mt-0.5" style={{ fontWeight: 510 }}>{sub}</p>}
    </div>
  );
}