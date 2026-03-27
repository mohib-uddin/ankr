import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import {
  ArrowLeft, FileText, CheckCircle, Clock, Download, Package,
  Link2, Check, X, Calendar, MapPin, Building2, Ruler,
  DollarSign, TrendingUp, Eye, Printer,
} from 'lucide-react';
import { useApp, formatCurrency, DOCUMENT_PACKAGES, getBudgetTotals, getDrawnForCategory } from '../../context/AppContext';
import type { DrawRequest, DashboardProperty } from '../../context/AppContext';
import { getShareUrl } from './PublicDrawView';
import svgPaths from '../../../imports/svg-2jpk391bzg';

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  Draft: { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', dot: 'bg-[#94A3B8]', label: 'Pending' },
  Submitted: { bg: 'bg-[#FFF7ED]', text: 'text-[#92400E]', dot: 'bg-[#D97706]', label: 'Submitted' },
  Approved: { bg: 'bg-[#FCF6F0]', text: 'text-[#764D2F]', dot: 'bg-[#764D2F]', label: 'Approved' },
  Funded: { bg: 'bg-[#F3EFE6]', text: 'text-[#3E2D1D]', dot: 'bg-[#3E2D1D]', label: 'Funded' },
  Rejected: { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', dot: 'bg-[#EF4444]', label: 'Rejected' },
};

const STATUS_TIMELINE: Record<string, { label: string; active: boolean; rejected?: boolean }[]> = {
  Draft: [
    { label: 'Created', active: true },
    { label: 'Submitted', active: false },
    { label: 'Approved', active: false },
    { label: 'Funded', active: false },
  ],
  Submitted: [
    { label: 'Created', active: true },
    { label: 'Submitted', active: true },
    { label: 'Approved', active: false },
    { label: 'Funded', active: false },
  ],
  Approved: [
    { label: 'Created', active: true },
    { label: 'Submitted', active: true },
    { label: 'Approved', active: true },
    { label: 'Funded', active: false },
  ],
  Funded: [
    { label: 'Created', active: true },
    { label: 'Submitted', active: true },
    { label: 'Approved', active: true },
    { label: 'Funded', active: true },
  ],
  Rejected: [
    { label: 'Created', active: true },
    { label: 'Submitted', active: true },
    { label: 'Rejected', active: true, rejected: true },
    { label: 'Funded', active: false },
  ],
};

export function DrawDetailPage() {
  const { id, drawId } = useParams<{ id: string; drawId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();
  const [linkCopied, setLinkCopied] = useState(false);

  const property = state.properties.find(p => p.id === id);
  const draw = property?.draws.find(d => d.id === drawId);

  if (!property || !draw) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#8C8780]">Draw request not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#764D2F] text-[14px] cursor-pointer">
          ← Go Back
        </button>
      </div>
    );
  }

  const handleCopyLink = () => {
    const url = getShareUrl(property.id, draw.id);
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const style = STATUS_STYLES[draw.status] || STATUS_STYLES.Draft;
  const timeline = STATUS_TIMELINE[draw.status] || STATUS_TIMELINE.Draft;
  const docPackage = draw.documentPackageId
    ? DOCUMENT_PACKAGES.find(p => p.id === draw.documentPackageId)
    : null;
  const totals = getBudgetTotals(property.budget, property.draws);
  const drawnPct = totals.totalBudget > 0 ? Math.round((totals.totalDrawn / totals.totalBudget) * 100) : 0;

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-[58px] pb-[60px]">
      {/* Breadcrumb + Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-[24px] sm:pt-[32px] pb-[24px] gap-[12px]">
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => navigate(`/dashboard/properties/${property.id}`)}
            className="flex items-center gap-[8px] text-[#8C8780] text-[14px] cursor-pointer hover:text-[#3E2D1D] transition-colors"
            style={{ fontWeight: 510 }}
          >
            <ArrowLeft className="w-[16px] h-[16px]" />
            {property.name}
          </button>
          <span className="text-[#D0D0D0]">/</span>
          <span className="text-[#764D2F] text-[14px]" style={{ fontWeight: 510 }}>Draw #{draw.number}</span>
        </div>
        <div className="flex items-center gap-[10px] flex-wrap">
          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] border text-[13px] cursor-pointer transition-colors ${
              linkCopied
                ? 'border-[#764D2F] bg-[#FCF6F0] text-[#764D2F]'
                : 'border-[#D0D0D0] text-[#8C8780] hover:bg-[#FCF6F0]'
            }`}
            style={{ fontWeight: 510 }}
          >
            {linkCopied ? <Check className="w-[14px] h-[14px]" /> : <Link2 className="w-[14px] h-[14px]" />}
            {linkCopied ? 'Link Copied!' : 'Share Public Link'}
          </button>
          <button
            className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] border border-[#D0D0D0] text-[13px] text-[#8C8780] hover:bg-[#FCF6F0] cursor-pointer transition-colors"
            style={{ fontWeight: 510 }}
          >
            <Download className="w-[14px] h-[14px]" /> Export PDF
          </button>
          <button
            className="flex items-center gap-[6px] px-[16px] py-[8px] rounded-[8px] border border-[#D0D0D0] text-[13px] text-[#8C8780] hover:bg-[#FCF6F0] cursor-pointer transition-colors"
            style={{ fontWeight: 510 }}
          >
            <Printer className="w-[14px] h-[14px]" /> Print
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden mb-[24px]"
      >
        <div className="p-[32px]">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[10px] mb-[12px]">
                <span className={`flex items-center gap-[6px] text-[12px] px-[12px] py-[4px] rounded-[100px] ${style.bg} ${style.text}`} style={{ fontWeight: 510 }}>
                  <span className={`w-[6px] h-[6px] rounded-full ${style.dot}`} />
                  {style.label}
                </span>
                <span className="text-[13px] text-[#8C8780]" style={{ fontWeight: 510 }}>Draw #{draw.number}</span>
              </div>
              <h1 className="text-[28px] text-[#3E2D1D] mb-[6px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                {draw.title}
              </h1>
              <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>
                {property.name} · {property.address}, {property.city}, {property.state} {property.zip}
              </p>
            </div>
            <div className="text-right shrink-0 hidden sm:block">
              <p className="text-[12px] text-[#8C8780] uppercase tracking-wider mb-[6px]" style={{ fontWeight: 510 }}>Total Draw Amount</p>
              <p className="text-[36px] text-[#3E2D1D] tracking-[-0.02em]" style={{ fontWeight: 700 }}>
                {formatCurrency(draw.totalAmount)}
              </p>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] mt-[28px]">
            <MetaCard icon={<Calendar className="w-[14px] h-[14px] text-[#8C8780]" />} label="Request Date" value={draw.requestDate} />
            <MetaCard icon={<Building2 className="w-[14px] h-[14px] text-[#8C8780]" />} label="Lender" value={draw.lenderName || '—'} />
            <MetaCard icon={<FileText className="w-[14px] h-[14px] text-[#8C8780]" />} label="Line Items" value={`${draw.lineItems.length} categories`} />
            <MetaCard icon={<DollarSign className="w-[14px] h-[14px] text-[#8C8780]" />} label="Budget Drawn" value={`${drawnPct}% of total`} />
          </div>
        </div>

        {/* Timeline Strip */}
        <div className="px-[32px] py-[24px] bg-[#FAFAF9] border-t border-[#F0EEEA]">
          <div className="flex items-center">
            {timeline.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center border-2 ${
                      step.rejected
                        ? 'border-[#EF4444] bg-[#FEF2F2]'
                        : step.active
                          ? 'border-[#3E2D1D] bg-[#3E2D1D]'
                          : 'border-[#E8E5E0] bg-white'
                    }`}
                  >
                    {step.rejected ? (
                      <X className="w-[14px] h-[14px] text-[#EF4444]" />
                    ) : step.active ? (
                      <CheckCircle className="w-[16px] h-[16px] text-white" />
                    ) : (
                      <Clock className="w-[14px] h-[14px] text-[#C5C0B9]" />
                    )}
                  </div>
                  <p className={`text-[12px] mt-[6px] ${step.active ? 'text-[#3E2D1D]' : 'text-[#C5C0B9]'}`} style={{ fontWeight: step.active ? 510 : 400 }}>
                    {step.label}
                  </p>
                  <p className="text-[10px] text-[#C5C0B9]">
                    {step.label === 'Created' ? draw.requestDate :
                     step.label === 'Submitted' ? draw.submittedDate || '' :
                     step.label === 'Approved' ? draw.approvedDate || '' :
                     step.label === 'Funded' ? draw.fundedDate || '' :
                     step.label === 'Rejected' ? draw.submittedDate || '' : ''}
                  </p>
                </div>
                {i < timeline.length - 1 && (
                  <div
                    className="flex-1 h-[2px] mx-[8px] mt-[-20px] rounded-full"
                    style={{ background: timeline[i + 1].active ? '#3E2D1D' : '#E8E5E0' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Two column layout */}
      <div className="flex flex-col xl:flex-row gap-[24px] items-start">
        {/* Left column - main content */}
        <div className="flex-1 min-w-0 flex flex-col gap-[24px]">
          {/* Draw Line Items */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden"
          >
            <div className="px-[24px] pt-[24px] pb-[16px]">
              <p className="text-[20px] text-[#3E2D1D]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                Draw Line Items
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div
                  className="grid px-[24px] py-[10px] bg-[#FCF6F0] border-y border-[#E8E5E0] text-[11px] text-[#8C8780] uppercase tracking-wider"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', fontWeight: 510 }}
                >
                  <span>Category</span>
                  <span className="text-right">Budget</span>
                  <span className="text-right">Prev. Drawn</span>
                  <span className="text-right">This Draw</span>
                  <span className="text-right">% Complete</span>
                </div>
                {draw.lineItems.map(li => {
                  const pctOfBudget = li.budgetAmount > 0 ? Math.round((li.requestedAmount / li.budgetAmount) * 100) : 0;
                  return (
                    <div
                      key={li.id}
                      className="grid px-[24px] py-[14px] border-b border-[#F0EEEA] last:border-0 items-center"
                      style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}
                    >
                      <div>
                        <span className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{li.categoryName}</span>
                        <span className="text-[11px] text-[#8C8780] ml-[8px]">({pctOfBudget}% of budget)</span>
                      </div>
                      <span className="text-[13px] text-[#8C8780] text-right" style={{ fontWeight: 510 }}>{formatCurrency(li.budgetAmount)}</span>
                      <span className="text-[13px] text-[#8C8780] text-right" style={{ fontWeight: 510 }}>{formatCurrency(li.previouslyDrawn)}</span>
                      <span className="text-[14px] text-[#764D2F] text-right" style={{ fontWeight: 700 }}>{formatCurrency(li.requestedAmount)}</span>
                      <span className="text-[13px] text-[#3E2D1D] text-right" style={{ fontWeight: 510 }}>{li.percentComplete}%</span>
                    </div>
                  );
                })}
                <div
                  className="grid px-[24px] py-[14px] bg-[#FCF6F0] border-t-2 border-[#E8E5E0] items-center"
                  style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}
                >
                  <span className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>Total</span>
                  <span /><span />
                  <span className="text-[16px] text-[#764D2F] text-right" style={{ fontWeight: 700 }}>{formatCurrency(draw.totalAmount)}</span>
                  <span />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Document Package */}
          {docPackage && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]"
            >
              <p className="text-[20px] text-[#3E2D1D] mb-[20px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                Document Package
              </p>
              <div className="bg-[#FCF6F0] border border-[#E8E5E0] rounded-[16px] p-[24px]">
                <div className="flex items-start gap-[16px] mb-[20px]">
                  <div className="w-[44px] h-[44px] rounded-[12px] bg-white border border-[#E8E5E0] flex items-center justify-center shrink-0">
                    <Package className="w-[20px] h-[20px] text-[#764D2F]" />
                  </div>
                  <div>
                    <p className="text-[16px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{docPackage.name}</p>
                    <p className="text-[13px] text-[#8C8780] mt-[4px]" style={{ fontWeight: 510 }}>{docPackage.description}</p>
                  </div>
                </div>
                <p className="text-[11px] text-[#8C8780] uppercase tracking-wider mb-[12px]" style={{ fontWeight: 510 }}>Required Documents</p>
                <div className="grid sm:grid-cols-2 gap-[8px]">
                  {docPackage.documents.map(d => (
                    <div key={d} className="flex items-center gap-[10px] bg-white rounded-[10px] px-[14px] py-[10px] border border-[#E8E5E0]">
                      <CheckCircle className="w-[14px] h-[14px] text-[#764D2F] shrink-0" />
                      <span className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{d}</span>
                      <button className="ml-auto p-[4px] rounded-[6px] hover:bg-[#FCF6F0] text-[#8C8780] cursor-pointer transition-colors">
                        <Eye className="w-[14px] h-[14px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Supporting Documents */}
          {draw.attachments.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]"
            >
              <p className="text-[20px] text-[#3E2D1D] mb-[20px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                Supporting Documents
                <span className="text-[14px] text-[#8C8780] ml-[8px]" style={{ fontWeight: 510 }}>({draw.attachments.length})</span>
              </p>
              <div className="flex flex-col gap-[8px]">
                {draw.attachments.map(att => (
                  <div key={att.id} className="flex items-center gap-[14px] bg-[#FAFAF9] rounded-[14px] px-[20px] py-[14px] border border-[#F0EEEA] hover:border-[#D0D0D0] transition-colors">
                    <div className="w-[40px] h-[40px] rounded-[10px] bg-[#FCF6F0] flex items-center justify-center shrink-0">
                      <FileText className="w-[18px] h-[18px] text-[#764D2F]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] text-[#3E2D1D] truncate" style={{ fontWeight: 510 }}>{att.name}</p>
                      <p className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{att.type} · {att.size} · Uploaded {att.uploadedAt}</p>
                    </div>
                    <div className="flex items-center gap-[8px]">
                      <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] border border-[#E8E5E0] bg-white text-[12px] text-[#8C8780] hover:bg-[#FCF6F0] cursor-pointer transition-colors" style={{ fontWeight: 510 }}>
                        <Eye className="w-[13px] h-[13px]" /> View
                      </button>
                      <button className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[8px] border border-[#E8E5E0] bg-white text-[12px] text-[#8C8780] hover:bg-[#FCF6F0] cursor-pointer transition-colors" style={{ fontWeight: 510 }}>
                        <Download className="w-[13px] h-[13px]" /> Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notes */}
          {draw.notes && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]"
            >
              <p className="text-[20px] text-[#3E2D1D] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                Notes
              </p>
              <p className="text-[14px] text-[#8C8780] bg-[#FAFAF9] rounded-[14px] p-[20px] border border-[#F0EEEA]" style={{ fontWeight: 510, lineHeight: '1.6' }}>
                {draw.notes}
              </p>
            </motion.div>
          )}
        </div>

        {/* Right column - property info & budget sidebar */}
        <div className="w-full xl:w-[340px] xl:shrink-0 flex flex-col gap-[24px] xl:sticky xl:top-[24px]">
          {/* Property Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden"
          >
            {/* Property image */}
            {property.coverImage && (
              <div className="h-[140px] relative">
                <img src={property.coverImage} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.05) 60%)' }} />
                <div className="absolute bottom-[12px] left-[16px]">
                  <p className="text-white text-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>{property.name}</p>
                </div>
              </div>
            )}
            <div className="p-[20px]">
              {!property.coverImage && (
                <p className="text-[16px] text-[#3E2D1D] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                  Property Details
                </p>
              )}
              <div className="flex flex-col gap-[14px]">
                <DetailRow icon={<MapPin className="w-[14px] h-[14px]" />} label="Address" value={`${property.address}, ${property.city}, ${property.state} ${property.zip || ''}`} />
                <DetailRow icon={<Building2 className="w-[14px] h-[14px]" />} label="Type" value={property.type} />
                <DetailRow icon={<Ruler className="w-[14px] h-[14px]" />} label="Size" value={`${property.sqft.toLocaleString()} sqft · ${property.units} units`} />
                <DetailRow icon={<DollarSign className="w-[14px] h-[14px]" />} label="Total Budget" value={formatCurrency(totals.totalBudget)} />
                <DetailRow icon={<TrendingUp className="w-[14px] h-[14px]" />} label="ARV" value={formatCurrency(property.proforma.afterRepairValue)} />
              </div>
            </div>
          </motion.div>

          {/* Budget Draw Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-[20px] border border-[#D0D0D0] p-[20px]"
          >
            <p className="text-[16px] text-[#3E2D1D] mb-[6px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Budget Tracker
            </p>
            <p className="text-[12px] text-[#8C8780] mb-[20px]" style={{ fontWeight: 510 }}>
              {formatCurrency(totals.totalDrawn)} drawn of {formatCurrency(totals.totalBudget)}
            </p>

            {/* Overall progress bar */}
            <div className="mb-[20px]">
              <div className="h-[6px] rounded-[100px] bg-[#E8E5E0] overflow-hidden">
                <div className="h-full rounded-[100px] bg-[#3E2D1D]" style={{ width: `${drawnPct}%` }} />
              </div>
              <div className="flex items-center justify-between text-[11px] text-[#8C8780] mt-[4px]" style={{ fontWeight: 510 }}>
                <span>{drawnPct}% drawn</span>
                <span>{formatCurrency(totals.remaining)} remaining</span>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="flex flex-col gap-[14px]">
              {property.budget.categories.map(cat => {
                const catBudget = cat.items.reduce((s, i) => s + i.budget, 0);
                const catDrawn = getDrawnForCategory(cat.id, property.draws);
                const pct = catBudget > 0 ? Math.min(100, Math.round((catDrawn / catBudget) * 100)) : 0;
                if (catBudget === 0) return null;

                // Highlight categories that are part of this draw
                const isInThisDraw = draw.lineItems.some(li => li.categoryId === cat.id);

                return (
                  <div key={cat.id} className={`${isInThisDraw ? 'bg-[#FCF6F0] rounded-[10px] px-[12px] py-[10px] -mx-[12px]' : ''}`}>
                    <div className="flex items-center justify-between text-[12px] mb-[5px]" style={{ fontWeight: 510 }}>
                      <span className={`truncate mr-[8px] ${isInThisDraw ? 'text-[#764D2F]' : 'text-[#3E2D1D]'}`}>
                        {cat.name}
                        {isInThisDraw && <span className="text-[10px] ml-[4px]">●</span>}
                      </span>
                      <span className="text-[#8C8780] shrink-0">{pct}%</span>
                    </div>
                    <div className="h-[4px] rounded-[100px] bg-[#E8E5E0] overflow-hidden">
                      <div
                        className={`h-full rounded-[100px] ${isInThisDraw ? 'bg-[#764D2F]' : 'bg-[#3E2D1D]'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#8C8780] mt-[3px]" style={{ fontWeight: 510 }}>
                      <span>{formatCurrency(catDrawn)}</span>
                      <span>{formatCurrency(catBudget)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Lender Info Card */}
          {(draw.lenderName || draw.lenderEmail) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[20px] border border-[#D0D0D0] p-[20px]"
            >
              <p className="text-[16px] text-[#3E2D1D] mb-[14px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
                Lender Information
              </p>
              <div className="flex flex-col gap-[12px]">
                {draw.lenderName && (
                  <div>
                    <p className="text-[11px] text-[#8C8780] mb-[2px]" style={{ fontWeight: 510 }}>Name</p>
                    <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{draw.lenderName}</p>
                  </div>
                )}
                {draw.lenderEmail && (
                  <div>
                    <p className="text-[11px] text-[#8C8780] mb-[2px]" style={{ fontWeight: 510 }}>Email</p>
                    <p className="text-[14px] text-[#764D2F]" style={{ fontWeight: 510 }}>{draw.lenderEmail}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper components

function MetaCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-[#FAFAF9] rounded-[12px] border border-[#F0EEEA] px-[16px] py-[12px]">
      <div className="flex items-center gap-[6px] mb-[4px]">
        {icon}
        <p className="text-[11px] text-[#8C8780] uppercase tracking-wider" style={{ fontWeight: 510 }}>{label}</p>
      </div>
      <p className="text-[14px] text-[#3E2D1D] truncate" style={{ fontWeight: 510 }}>{value}</p>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-[10px]">
      <div className="w-[28px] h-[28px] rounded-[8px] bg-[#FCF6F0] flex items-center justify-center shrink-0 text-[#764D2F] mt-[1px]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-[#8C8780]" style={{ fontWeight: 510 }}>{label}</p>
        <p className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{value}</p>
      </div>
    </div>
  );
}