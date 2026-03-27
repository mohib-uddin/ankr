import React, { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Check, CheckCircle, Send, Eye, Download, Trash2, Link2, Package } from 'lucide-react';
import { useApp, getDrawnForCategory, formatCurrency } from '../../../context/AppContext';
import type { DrawRequest } from '../../../context/AppContext';
import { DrawCompletionModal } from '../../draws/DrawCompletionModal';
import { getShareUrl } from '../../draws/PublicDrawView';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import svgPaths from '@/icons/property-draws-tab';

/* ─── Figma-exact style tokens ───────────────────────────────── */
const sfMed  = "font-['SF_Pro',sans-serif] font-[510]";
const sfBold = "font-['SF_Pro',sans-serif] font-bold";
const sfSemi = "font-['SF_Pro',sans-serif] font-[590]";
const sfReg  = "font-['SF_Pro',sans-serif] font-normal";
const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const intMed = "font-['Inter',sans-serif] font-medium not-italic";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };

/* ─── Figma SVG Icons ─────────────────────────────────────────── */
function WalletIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[8.33%_8.33%_16.67%_8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 15.75">
            <path d={svgPaths.pc6b3970} fill="#764D2F" />
            <path d={svgPaths.p4011680} fill="#764D2F" />
            <path clipRule="evenodd" d={svgPaths.p112cca80} fill="#764D2F" fillRule="evenodd" />
            <path d={svgPaths.p2a67df0} fill="#764D2F" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function LayersIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[14.03%_14.53%_15.02%_14.52%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.8994 14.8984">
            <path clipRule="evenodd" d={svgPaths.p74d3600} fill="#764D2F" fillRule="evenodd" />
            <path d={svgPaths.p292c4700} fill="#764D2F" />
            <path d={svgPaths.p72e8a00} fill="#764D2F" />
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
        <div className="absolute inset-[11.1%_11.82%_17.71%_34.38%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.2999 14.9501">
            <path d={svgPaths.p14d41f00} fill="#764D2F" />
            <path clipRule="evenodd" d={svgPaths.p385cc600} fill="#764D2F" fillRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <div className="bg-[#fcf6f0] content-stretch flex items-center p-[8.5px] relative rounded-[6px] shrink-0">
      <div className="overflow-clip relative shrink-0 size-[21px]">
        <div className="absolute inset-[8.33%]">
          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 17.5 17.5">
            <path d={svgPaths.p25df5100} fill="#764D2F" />
            <path clipRule="evenodd" d={svgPaths.pcf91480} fill="#764D2F" fillRule="evenodd" />
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

function PackageIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
      <g clipPath="url(#clip_pkg)">
        <path d={svgPaths.pceb8800} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        <path d="M5 9.16667V5" stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        <path d={svgPaths.p2b904a40} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
        <path d="M3.125 1.77917L6.875 3.925" stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.833333" />
      </g>
      <defs>
        <clipPath id="clip_pkg">
          <rect fill="white" height="10" width="10" />
        </clipPath>
      </defs>
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <div className="relative rounded-[4px] shrink-0 size-[22px]">
      <svg className="absolute left-[4px] top-[4px] size-[14px]" fill="none" viewBox="0 0 14 14">
        <path d="M5.25 10.5L8.75 7L5.25 3.5" stroke="#8C8780" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
      </svg>
    </div>
  );
}

/* ─── Donut chart colors ──────────────────────────────────────── */
const DONUT_COLORS = [
  '#3E2D1D', // Building Hard Costs
  '#764D2F', // Financing
  '#A67B5B', // Land
  '#C7AF97', // Site Work
  '#E8DFD4', // Soft Costs
];

function fmtShort(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* ═══════════════════════════════════════════════════════════════ */
/*  MAIN COMPONENT                                                */
/* ═══════════════════════════════════════════════════════════════ */

export function DrawsTab({ propertyId }: { propertyId: string }) {
  const { state, submitDraw, deleteDraw } = useApp();
  const navigate = useNavigate();
  const property = state.properties.find(p => p.id === propertyId)!;
  const [completionDraw, setCompletionDraw] = useState<DrawRequest | null>(null);
  const [selectedDraws, setSelectedDraws] = useState<Set<string>>(new Set());

  const totalDrawn = property.draws
    .filter(d => d.status !== 'Draft')
    .reduce((s, d) => s + d.totalAmount, 0);
  const funded = property.draws.filter(d => d.status === 'Funded').length;
  const pending = property.draws.filter(d => d.status === 'Submitted' || d.status === 'Approved').length;

  const totalBudget = property.budget.categories.reduce((s, c) => s + c.items.reduce((ss, i) => ss + i.budget, 0), 0);
  const drawPct = totalBudget > 0 ? Math.round((totalDrawn / totalBudget) * 100) : 0;

  const toggleSelect = (id: string) => {
    setSelectedDraws(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const handleBatchSubmit = () => {
    selectedDraws.forEach(id => {
      const draw = property.draws.find(d => d.id === id);
      if (draw?.status === 'Draft') submitDraw(propertyId, id);
    });
    setSelectedDraws(new Set());
  };

  const draftSelected = [...selectedDraws].some(id => {
    const d = property.draws.find(dr => dr.id === id);
    return d?.status === 'Draft';
  });

  /* Budget categories with amounts for the tracker */
  const catData = property.budget.categories
    .map(cat => {
      const budget = cat.items.reduce((s, i) => s + i.budget, 0);
      const drawn = getDrawnForCategory(cat.id, property.draws);
      return { id: cat.id, name: cat.name, budget, drawn };
    })
    .filter(c => c.budget > 0)
    .sort((a, b) => b.budget - a.budget);

  const hasBudgetData = catData.length > 0;

  return (
    <div className="content-stretch flex flex-col gap-[36px] items-start relative shrink-0 w-full">

      {/* ═══ HEADER ROW ═══ */}
      <div className="content-stretch flex flex-col sm:flex-row sm:items-end justify-between relative shrink-0 w-full gap-[16px] sm:gap-0">
        <div className="content-stretch flex flex-col gap-[9px] items-start relative shrink-0 w-full sm:w-[417px]">
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
            <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] sm:text-[28px] w-full`}>Draw Requests</p>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-start sm:justify-end relative shrink-0">
          <div className="flex items-center gap-[12px]">
            {selectedDraws.size > 0 && draftSelected && (
              <button
                onClick={handleBatchSubmit}
                className="flex items-center gap-[8px] px-[24px] py-[10px] bg-[#3E2D1D] text-white rounded-[8px] text-[14px] hover:bg-[#2C1F14] transition-colors cursor-pointer border-none"
                style={{ fontWeight: 590 }}
              >
                <Send className="w-[14px] h-[14px]" /> Submit Selected
              </button>
            )}
            <button
              onClick={() => navigate(`/dashboard/properties/${propertyId}/draws/new`)}
              className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer bg-transparent border-none"
            >
              <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <PlusIcon />
              <p className={`${sfSemi} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap`} style={wdth}>New Draw Request</p>
            </button>
          </div>
        </div>
      </div>

      {/* ═══ CONTENT ═══ */}
      <div className="content-stretch flex flex-col gap-[16px] items-start relative shrink-0 w-full">

        {/* ─── Stat Cards ─── */}
        <div className="content-stretch grid grid-cols-2 xl:grid-cols-4 gap-[16px] items-start relative shrink-0 w-full">
          {/* Total Drawn */}
          <div className="bg-white min-h-px min-w-px relative rounded-[16px] self-stretch">
            <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex items-center px-[28px] py-[20px] relative size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-center min-h-px min-w-px relative flex-1">
                  <WalletIcon />
                  <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                    <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[14px] w-full`} style={wdth}>Total Drawn </p>
                    <div className="content-stretch flex flex-wrap gap-[8px] items-center relative shrink-0 w-full">
                      <p className={`${sfBold} relative shrink-0 text-[#3e2d1d] text-[28px]`} style={wdth}>{fmtShort(totalDrawn)}</p>
                      <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[12px]`} style={wdth}>({drawPct}% of budget)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          </div>

          {/* Number of Draws */}
          <div className="bg-white min-h-px min-w-px relative rounded-[16px] self-stretch">
            <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-start justify-center px-[28px] py-[20px] relative size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
                  <LayersIcon />
                  <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                    <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[14px] w-full`} style={wdth}>Number of Draws </p>
                    <p className={`${sfBold} relative shrink-0 text-[#3e2d1d] text-[28px] w-full`} style={wdth}>{property.draws.length}</p>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          </div>

          {/* Funded */}
          <div className="bg-white min-h-px min-w-px relative rounded-[16px] self-stretch">
            <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-start justify-center px-[28px] py-[20px] relative size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
                  <MoneyIcon />
                  <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                    <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[14px] w-full`} style={wdth}>Funded</p>
                    <p className={`${sfBold} relative shrink-0 text-[#3e2d1d] text-[28px] w-full`} style={wdth}>{funded}</p>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          </div>

          {/* Pending */}
          <div className="bg-white min-h-px min-w-px relative rounded-[16px] self-stretch">
            <div className="flex flex-col justify-center overflow-clip rounded-[inherit] size-full">
              <div className="content-stretch flex flex-col items-start justify-center px-[28px] py-[20px] relative size-full">
                <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">
                  <ClockIcon />
                  <div className="content-stretch flex flex-col gap-[8px] items-start leading-[normal] relative shrink-0 w-full">
                    <p className={`${sfMed} relative shrink-0 text-[#764d2f] text-[14px] w-full`} style={wdth}>Pending</p>
                    <p className={`${sfBold} relative shrink-0 text-[#3e2d1d] text-[28px] w-full`} style={wdth}>{pending}</p>
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          </div>
        </div>

        {/* ─── Draws Table + Budget Tracker ─── */}
        <div className="content-stretch flex flex-col gap-[16px] items-start justify-center relative shrink-0 w-full">

          {/* Draw Table */}
          {property.draws.length === 0 ? (
            <div className="bg-white rounded-[20px] border-[1.5px] border-dashed border-[#D0D0D0] p-[60px] text-center w-full">
              <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FCF6F0] flex items-center justify-center mx-auto mb-[20px]">
                <LayersIcon />
              </div>
              <p className={`${canela} text-[#3E2D1D] text-[20px] mb-[8px]`}>No draw requests yet</p>
              <p className={`${sfMed} text-[#8C8780] text-[14px] mb-[24px] max-w-[360px] mx-auto`} style={wdth}>Create a draw request to request funds from your lender against your project budget.</p>
              <button
                onClick={() => navigate(`/dashboard/properties/${propertyId}/draws/new`)}
                className="inline-flex items-center gap-[10px] h-[44px] px-[32px] bg-[#3E2D1D] text-white rounded-[8px] text-[14px] hover:bg-[#2C1F14] transition-colors cursor-pointer border-none"
                style={{ fontWeight: 590 }}
              >
                <PlusIcon /> Create Draw Request
              </button>
            </div>
          ) : (
            <div className="w-full bg-white rounded-[20px] border border-[#d0d0d0] overflow-hidden shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
              <Table className="min-w-[980px]">
                <TableHeader className="bg-[#fafaf9] border-b border-[#d0d0d0]">
                  <TableRow className="hover:bg-transparent border-0">
                    <TableHead className="h-auto px-[16px] py-[12px] w-[92px] min-w-[92px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px]" style={wdth}>#</TableHead>
                    <TableHead className="h-auto px-0 py-[12px] w-[236px] min-w-[236px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px]" style={wdth}>Draw Title</TableHead>
                    <TableHead className="h-auto px-0 py-[12px] w-[140px] min-w-[140px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px]" style={wdth}>Lender</TableHead>
                    <TableHead className="h-auto px-0 py-[12px] w-[120px] min-w-[120px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px]" style={wdth}>Date</TableHead>
                    <TableHead className="h-auto px-0 py-[12px] w-[120px] min-w-[120px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px] text-right" style={wdth}>Amount</TableHead>
                    <TableHead className="h-auto px-0 py-[12px] w-[96px] min-w-[96px] text-[11px] text-[#8c8780] uppercase tracking-[0.6145px] text-center" style={wdth}>Status</TableHead>
                    <TableHead className="h-auto pl-0 pr-[16px] py-[12px] w-[34px] min-w-[34px]" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {property.draws.map((draw, i) => {
                    const isSelected = selectedDraws.has(draw.id);
                    const dateStr = draw.fundedDate || draw.approvedDate || draw.submittedDate || draw.requestDate;
                    const displayStatus = draw.status === 'Draft' ? 'Pending' : draw.status;

                    return (
                      <TableRow key={draw.id} className="border-b border-[#f5f3ef] last:border-b-0 hover:bg-[#FAFAF9]">
                        <TableCell className="px-[16px] py-[14px] w-[92px] min-w-[92px]">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="flex items-center gap-[24px]">
                            <button
                              onClick={() => toggleSelect(draw.id)}
                              className={`relative rounded-[4px] shrink-0 size-[16px] cursor-pointer border-none p-0 flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-[#3E2D1D]' : 'bg-transparent'
                              }`}
                            >
                              <div aria-hidden="true" className={`absolute border border-solid inset-0 pointer-events-none rounded-[4px] ${isSelected ? 'border-[#3E2D1D]' : 'border-[#d0d0d0]'}`} />
                              {isSelected && <Check className="w-[10px] h-[10px] text-white relative z-10" />}
                            </button>
                            <span className={`${intMed} text-[#8c8780] text-[14px] tracking-[-0.1504px] whitespace-nowrap`}>#{draw.number}</span>
                          </motion.div>
                        </TableCell>
                        <TableCell className="px-0 py-[14px] w-[236px] min-w-[236px]">
                          <p className={`${sfMed} text-[#3e2d1d] text-[14px] tracking-[-0.1504px] whitespace-nowrap`} style={wdth}>{draw.title}</p>
                          <p className={`${intMed} text-[#8c8780] text-[12px] leading-[18px] whitespace-nowrap`}>
                            {draw.lineItems.length} line item{draw.lineItems.length !== 1 ? 's' : ''}
                            {draw.attachments.length > 0 && ` · ${draw.attachments.length} doc${draw.attachments.length !== 1 ? 's' : ''}`}
                          </p>
                          {draw.documentPackageName && (
                            <div className="flex items-center gap-[2px]">
                              <PackageIcon />
                              <p className={`${intMed} text-[#764d2f] text-[12px] leading-[18px] whitespace-nowrap`}>{draw.documentPackageName}</p>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="px-0 py-[14px] w-[140px] min-w-[140px]">
                          <span className={`${intMed} text-[#8c8780] text-[14px] tracking-[-0.1504px] whitespace-nowrap`}>{draw.lenderName || '—'}</span>
                        </TableCell>
                        <TableCell className="px-0 py-[14px] w-[120px] min-w-[120px]">
                          <span className={`${intMed} text-[#8c8780] text-[14px] tracking-[-0.1504px] whitespace-nowrap`}>{dateStr}</span>
                        </TableCell>
                        <TableCell className="px-0 py-[14px] w-[120px] min-w-[120px] text-right">
                          <span className={`${sfBold} text-[#3e2d1d] text-[14px] tracking-[-0.1504px] whitespace-nowrap`} style={wdth}>{formatCurrency(draw.totalAmount)}</span>
                        </TableCell>
                        <TableCell className="px-0 py-[14px] w-[96px] min-w-[96px]">
                          <div className="flex justify-center">
                            <div className="bg-[#fcf6f0] rounded-[100px] px-[16px] py-[4px]">
                              <p className={`${sfMed} text-[#3e2d1d] text-[14px] whitespace-nowrap`} style={wdth}>{displayStatus}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="pl-0 pr-[16px] py-[14px] w-[34px] min-w-[34px]">
                          <DrawRowActions
                            draw={draw}
                            propertyId={propertyId}
                            onSubmit={() => submitDraw(propertyId, draw.id)}
                            onDelete={() => deleteDraw(propertyId, draw.id)}
                            onCompletion={() => setCompletionDraw(draw)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          {/* ─── Budget Tracker Card ─── */}
          {hasBudgetData && (
            <div className="content-stretch flex flex-col items-start relative shrink-0 w-full">
              <div className="bg-white relative rounded-[20px] shrink-0 w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
                <div className="flex flex-col items-end size-full">
                  <div className="content-stretch flex flex-col items-end p-[24px] relative w-full">
                    <div className="content-stretch flex flex-col gap-[24px] items-start relative shrink-0 w-full">

                      {/* Title */}
                      <div className="content-stretch flex items-center relative shrink-0 w-full">
                        <p className={`${canela} leading-[normal] relative shrink-0 text-[#3e2d1d] text-[24px] whitespace-nowrap`}>Budget Tracker </p>
                      </div>

                      {/* Chart + Breakdown */}
                      <div className="content-stretch flex items-center justify-center relative shrink-0 w-full">
                        <div className="content-stretch flex flex-col md:flex-row gap-[32px] md:gap-[44px] items-center relative shrink-0 w-full">

                          {/* Donut Chart */}
                          <div className="flex flex-col gap-[32px] md:gap-[42px] items-center justify-center shrink-0 w-full md:w-[280px]">
                              <DonutChart categories={catData} totalBudget={totalBudget} />
                              {/* Legend */}
                              <div className="flex gap-x-[17px] gap-y-[8px] items-center flex-wrap justify-center w-full">
                                {catData.map((cat, i) => (
                                  <div key={cat.id} className="flex gap-[7.414px] items-center shrink-0">
                                    <div className="rounded-[2.471px] shrink-0 size-[9.885px]" style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                                    <p className={`${sfReg} leading-[normal] text-[#3e2d1d] text-[12px] whitespace-nowrap`} style={wdth}>{cat.name}</p>
                                  </div>
                                ))}
                              </div>
                          </div>

                          {/* Category Breakdown */}
                          <div className="content-stretch flex flex-col flex-1 gap-[32px] items-start min-h-px min-w-px relative">
                            {catData.map(cat => {
                              const pct = cat.budget > 0 ? Math.min(100, Math.round((cat.drawn / cat.budget) * 100)) : 0;
                              const label = pct >= 100 ? 'Fully drawn' : `${pct}% drawn`;
                              return (
                                <div key={cat.id} className="content-stretch flex flex-col items-start relative shrink-0 w-full">
                                  <div className="content-stretch flex flex-col gap-[10px] items-start relative shrink-0 w-full">
                                    {/* Name + Budget */}
                                    <div className={`content-stretch flex ${sfMed} items-center justify-between leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] w-full whitespace-nowrap`}>
                                      <p className="relative shrink-0" style={wdth}>{cat.name} </p>
                                      <p className="relative shrink-0" style={wdth}>{formatCurrency(cat.budget)} </p>
                                    </div>
                                    {/* Progress bar */}
                                    <div className="bg-[#d9d9d9] h-[7px] relative rounded-[100px] shrink-0 w-full overflow-hidden">
                                      <motion.div
                                        className="bg-[#3e2d1d] h-full rounded-[100px]"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${pct}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                      />
                                    </div>
                                    {/* Drawn label + amount */}
                                    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
                                      <p className={`${sfMed} leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap`} style={wdth}>{label} </p>
                                      <div className="content-stretch flex items-center relative shrink-0">
                                        <p className={`${sfMed} leading-[normal] relative shrink-0 text-[#764d2f] text-[14px] whitespace-nowrap`} style={wdth}>{formatCurrency(cat.drawn)} </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {completionDraw && (
        <DrawCompletionModal draw={completionDraw} property={property} onClose={() => setCompletionDraw(null)} />
      )}
    </div>
  );
}

/* ─── Donut Chart Component ──────────────────────────────────── */
function DonutChart({ categories, totalBudget }: { categories: { id: string; name: string; budget: number; drawn: number }[]; totalBudget: number }) {
  const size = 280;
  const cx = size / 2;
  const cy = size / 2;
  const outerR = 130;
  const innerR = 85;
  const midR = (outerR + innerR) / 2; // 107.5
  const strokeW = outerR - innerR;    // 45
  const circumference = 2 * Math.PI * midR;

  // Build segments with cumulative percentage offsets
  let cumulativePct = 0;
  const segments = categories.map((cat, i) => {
    const pct = totalBudget > 0 ? (cat.budget / totalBudget) * 100 : 0;
    const seg = { ...cat, pct, offset: cumulativePct, color: DONUT_COLORS[i % DONUT_COLORS.length] };
    cumulativePct += pct;
    return seg;
  });

  return (
    <div className="overflow-clip relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        {/* Background ring */}
        <circle cx={cx} cy={cy} r={midR} fill="none" stroke="#E8E5E0" strokeWidth={strokeW} />
        {/* Render segments in reverse so first (largest) category paints on top */}
        {[...segments].reverse().map((seg) => {
          const dashLength = (seg.pct / 100) * circumference;
          const gapLength = circumference - dashLength;
          // Start from 12 o'clock: offset by circumference/4 (since SVG circles start at 3 o'clock)
          const rotationOffset = circumference * 0.25;
          const segmentOffset = (seg.offset / 100) * circumference;
          return (
            <circle
              key={seg.id}
              cx={cx}
              cy={cy}
              r={midR}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeW}
              strokeDasharray={`${dashLength} ${gapLength}`}
              strokeDashoffset={rotationOffset - segmentOffset}
              style={{ transition: 'stroke-dasharray 0.6s ease-out' }}
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="-translate-x-1/2 -translate-y-1/2 absolute flex flex-col items-center left-1/2 text-center top-1/2">
        <p className={`${sfMed} text-[#764d2f] text-[17px]`} style={wdth}>Total Budget </p>
        <p className={`${sfBold} text-[#3e2d1d] text-[36px]`} style={wdth}>{fmtShort(totalBudget)}</p>
      </div>
    </div>
  );
}

/* ─── Row Actions (Chevron + Dropdown) ────────────────────────── */
function DrawRowActions({ draw, propertyId, onSubmit, onDelete, onCompletion }: {
  draw: DrawRequest;
  propertyId: string;
  onSubmit: () => void;
  onDelete: () => void;
  onCompletion: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = () => {
    const url = getShareUrl(propertyId, draw.id);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => { setCopied(false); }, 1200);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer bg-transparent border-none p-0 hover:opacity-80 transition-opacity">
          <ChevronRightIcon />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="bg-white border border-[#D0D0D0] rounded-[12px] p-0 shadow-lg min-w-[190px] overflow-hidden">
        <DropdownMenuItem
          onSelect={() => navigate(`/dashboard/properties/${propertyId}/draws/${draw.id}`)}
          className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-[#3E2D1D] focus:bg-[#FCF6F0] focus:text-[#3E2D1D] cursor-pointer rounded-none ${sfMed}`}
          style={wdth}
        >
          <Eye className="w-[14px] h-[14px] text-[#8C8780]" /> View Details
        </DropdownMenuItem>
        {(draw.status === 'Submitted' || draw.status === 'Approved' || draw.status === 'Funded') && (
          <DropdownMenuItem
            onSelect={onCompletion}
            className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-[#3E2D1D] focus:bg-[#FCF6F0] focus:text-[#3E2D1D] cursor-pointer rounded-none ${sfMed}`}
            style={wdth}
          >
            <CheckCircle className="w-[14px] h-[14px] text-[#764D2F]" /> Draw Completion
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onSelect={handleCopyLink}
          className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-[#764D2F] focus:bg-[#FCF6F0] focus:text-[#764D2F] cursor-pointer rounded-none ${sfMed}`}
          style={wdth}
        >
          {copied ? <Check className="w-[14px] h-[14px]" /> : <Link2 className="w-[14px] h-[14px]" />}
          {copied ? 'Link Copied!' : 'Copy Public Link'}
        </DropdownMenuItem>
        {draw.status === 'Draft' && (
          <DropdownMenuItem
            onSelect={onSubmit}
            className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-[#764D2F] focus:bg-[#FCF6F0] focus:text-[#764D2F] cursor-pointer rounded-none ${sfMed}`}
            style={wdth}
          >
            <Send className="w-[14px] h-[14px]" /> Submit Draw
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-[#8C8780] focus:bg-[#FCF6F0] focus:text-[#8C8780] cursor-pointer rounded-none ${sfMed}`}
          style={wdth}
        >
          <Download className="w-[14px] h-[14px]" /> Export PDF
        </DropdownMenuItem>
        {draw.status === 'Draft' && (
          <>
            <DropdownMenuSeparator className="m-0 bg-[#D0D0D0]" />
            <DropdownMenuItem
              onSelect={onDelete}
              className={`flex items-center gap-[10px] px-[12px] py-[12px] text-[14px] text-red-500 focus:bg-red-50 focus:text-red-500 cursor-pointer rounded-none ${sfMed}`}
              style={wdth}
            >
              <Trash2 className="w-[14px] h-[14px]" /> Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}