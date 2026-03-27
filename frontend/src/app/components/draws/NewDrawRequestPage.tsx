import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check, FileText, Sparkles, Package, Save, Link2,
  DollarSign,
} from 'lucide-react';
import { useApp, getDrawnForCategory, formatCurrency, genId, DOCUMENT_PACKAGES } from '../../context/AppContext';
import type { DrawLineItem, DrawAttachment, DocumentPackageId } from '../../context/AppContext';
import { getShareUrl } from './PublicDrawView';
import svgPaths from '../../../imports/svg-msusmqtedk';

/* ─── Font tokens ─────────────────────────────────────────────────────────── */
const FONT_HEADING: React.CSSProperties = {
  fontFamily: "'Canela_Text_Trial', sans-serif",
  fontWeight: 500,
};
const FONT_SF_REGULAR: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 510,
  fontVariationSettings: "'wdth' 100",
};
const FONT_SF_MEDIUM: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 510,
  fontVariationSettings: "'wdth' 100",
};
const FONT_SF_SEMIBOLD: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 590,
  fontVariationSettings: "'wdth' 100",
};
const FONT_SF_BOLD: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 700,
  fontVariationSettings: "'wdth' 100",
};
const FONT_FIGTREE: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 510,
  fontVariationSettings: "'wdth' 100",
};
const FONT_MONTSERRAT: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 510,
  fontVariationSettings: "'wdth' 100",
};
const FONT_INTER_MEDIUM: React.CSSProperties = {
  fontFamily: "'SF Pro', sans-serif",
  fontWeight: 510,
  fontVariationSettings: "'wdth' 100",
  fontStyle: 'normal',
};

function parseMoney(v: string) { return parseFloat(v.replace(/[^0-9.]/g, '')) || 0; }
function fmtInput(n: number) { return n > 0 ? n.toLocaleString() : ''; }

const STEPS = [
  { id: 'setup', label: 'Setup' },
  { id: 'items', label: 'Line Items' },
  { id: 'docs', label: 'Documents' },
  { id: 'review', label: 'Review' },
];

/* ─── SVG Icons ────────────────────────────────────────────────────────────── */

function ChevronBreadcrumb() {
  return (
    <div className="flex items-center justify-center shrink-0 size-[24px]">
      <div className="flex-none rotate-90">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d={svgPaths.p7e66880} fill="#764D2F" />
        </svg>
      </div>
    </div>
  );
}

function ArrowUpSvg({ color = '#3E2D1D' }: { color?: string }) {
  return (
    <svg width="9.537" height="13" viewBox="0 0 9.53742 12.9993" fill="none">
      <path d={svgPaths.pec28900} fill={color} />
    </svg>
  );
}

function BoxIcon() {
  return (
    <div className="bg-[#fcf6f0] flex items-center p-[8.5px] rounded-[6px] shrink-0">
      <svg width="21" height="21" viewBox="0 0 17.0625 16.9298" fill="none">
        <path clipRule="evenodd" d="M6.5128 0.523034C7.76808 -0.174345 9.29442 -0.174344 10.5497 0.523034L14.9247 2.95359C16.2442 3.68662 17.0625 5.07739 17.0625 6.58681V10.343C17.0625 11.8524 16.2442 13.2432 14.9247 13.9762L10.5497 16.4068C9.29442 17.1041 7.76808 17.1041 6.5128 16.4068L2.1378 13.9762C0.818332 13.2432 0 11.8524 0 10.343V6.58681C0 5.07739 0.818333 3.68662 2.1378 2.95359L6.5128 0.523034ZM9.9123 1.67037C9.05342 1.19321 8.00908 1.19321 7.1502 1.67036L6.41732 2.07752L12.0529 5.60422L14.4398 4.19195C14.3901 4.16016 14.3393 4.1298 14.2873 4.10092L9.9123 1.67037ZM15.37 5.1666L10.6129 7.98119L10.6111 7.98228C10.166 8.24908 9.68293 8.42575 9.1875 8.51195V15.5406C9.43768 15.4813 9.68168 15.3875 9.9123 15.2594L14.2873 12.8289C15.1901 12.3273 15.75 11.3757 15.75 10.343V6.58681C15.75 6.07919 15.6147 5.59119 15.37 5.1666ZM7.875 8.5301C7.37722 8.4576 6.88933 8.29426 6.43682 8.03972L1.60842 5.32366C1.41697 5.70975 1.3125 6.1407 1.3125 6.58681V10.343C1.3125 11.3757 1.87241 12.3273 2.7752 12.8289L7.1502 15.2594C7.38082 15.3875 7.62482 15.4813 7.875 15.5406V8.5301ZM2.46574 4.30002L7.08031 6.89579C7.97079 7.3967 9.06155 7.38141 9.93765 6.85574L9.94111 6.85366L10.7811 6.35668L5.10669 2.80565L2.7752 4.10092C2.667 4.16103 2.56372 4.22761 2.46574 4.30002Z" fill="#764D2F" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 16.004V17C4 17.7956 4.31607 18.5587 4.87868 19.1213C5.44129 19.6839 6.20435 20 7 20H17C17.7956 20 18.5587 19.6839 19.1213 19.1213C19.6839 18.5587 20 17.7956 20 17V16M12 15.5V4.5M12 4.5L15.5 8M12 4.5L8.5 8" stroke="#3E2D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Stepper Circle ───────────────────────────────────────────────────────── */

function StepCircle({ index, state }: { index: number; state: 'completed' | 'active' | 'upcoming' }) {
  if (state === 'completed') {
    return (
      <div className="relative shrink-0 size-[44px]">
        <svg className="absolute block size-full" fill="none" viewBox="0 0 44 44">
          <circle cx="22" cy="22" fill="#3E2D1D" r="22" />
          <path d="M14.6094 22.4844L19.2031 27.0781L28.3906 17.2344" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.15625" />
        </svg>
      </div>
    );
  }
  const strokeColor = state === 'active' ? '#3E2D1D' : '#D3B597';
  const textColor = state === 'active' ? '#3e2d1d' : '#d3b597';
  return (
    <div className="relative shrink-0 size-[44px]">
      <svg className="absolute block size-full" fill="none" viewBox="0 0 44 44">
        <circle cx="22" cy="22" fill="#FAFAFA" r="21" stroke={strokeColor} strokeWidth="2" />
      </svg>
      <p
        className="absolute flex items-center justify-center inset-0 text-[16px] whitespace-nowrap"
        style={{ ...FONT_SF_BOLD, color: textColor }}
      >
        {index + 1}
      </p>
    </div>
  );
}

/* ─── Vertical Stepper ────────────────────────────────────────────────────── */

function VerticalStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex flex-col gap-[9px] items-start shrink-0 w-[154px]">
      {STEPS.map((s, idx) => {
        const stepState = idx < currentStep ? 'completed' : idx === currentStep ? 'active' : 'upcoming';
        const textColor = stepState === 'upcoming' ? '#d3b597' : '#3e2d1d';
        const lineColor = idx < currentStep ? '#3E2D1D' : '#D3B597';

        return (
          <div key={s.id}>
            {/* Step row */}
            <div className="flex gap-[8px] items-center justify-center w-[154px]">
              <StepCircle index={idx} state={stepState} />
              <p
                className="text-[14px] w-[102px]"
                style={{ ...FONT_MONTSERRAT, color: textColor }}
              >
                {s.label}
              </p>
            </div>
            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div className="flex items-center px-[22px]">
                <div className="h-[93.5px] shrink-0 w-0 relative">
                  <div className="absolute inset-[0_-1px]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2 93.5">
                      <path d="M1 0V93.5" stroke={lineColor} strokeDasharray="4 4" strokeWidth="2" />
                    </svg>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── MAIN COMPONENT ──────────────────────────────────────────────────────── */

export function NewDrawRequestPage() {
  const { id: propertyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, addDraw } = useApp();
  const property = state.properties.find(p => p.id === propertyId);

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [savedAsDraft, setSavedAsDraft] = useState(false);
  const [createdDrawId, setCreatedDrawId] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);

  // Step 1 fields
  const [title, setTitle] = useState(`Draw #${(property?.draws.length ?? 0) + 1}`);
  const [lenderName, setLenderName] = useState(property?.proforma.lenderName || '');
  const [lenderEmail, setLenderEmail] = useState(property?.proforma.lenderEmail || '');
  const [notes, setNotes] = useState('');
  const [requestDate] = useState(new Date().toISOString().split('T')[0]);

  // Step 2 - line items per category
  const [lineAmounts, setLineAmounts] = useState<Record<string, string>>({});

  // Step 3 - document package + attachments
  const [selectedPackageId, setSelectedPackageId] = useState<DocumentPackageId | null>(null);
  const [attachments, setAttachments] = useState<DrawAttachment[]>([]);

  if (!property || !propertyId) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#8C8780]">Property not found.</p>
        <button onClick={() => navigate('/dashboard/properties')} className="mt-4 text-[#764D2F] text-[14px] cursor-pointer">
          ← Back to Properties
        </button>
      </div>
    );
  }

  const categoriesWithBudget = property.budget.categories.filter(c =>
    c.items.reduce((s, i) => s + i.budget, 0) > 0
  );

  const lineItems: DrawLineItem[] = categoriesWithBudget
    .filter(c => parseMoney(lineAmounts[c.id] || '0') > 0)
    .map(c => {
      const catBudget = c.items.reduce((s, i) => s + i.budget, 0);
      const previouslyDrawn = getDrawnForCategory(c.id, property.draws);
      const requested = parseMoney(lineAmounts[c.id] || '0');
      const percentTakenToDate = catBudget > 0
        ? Math.min(100, Math.round(((previouslyDrawn + requested) / catBudget) * 100))
        : 0;
      return {
        id: genId(),
        categoryId: c.id,
        categoryName: c.name,
        budgetAmount: catBudget,
        previouslyDrawn,
        requestedAmount: requested,
        percentComplete: percentTakenToDate,
      };
    });

  const totalRequested = lineItems.reduce((s, l) => s + l.requestedAmount, 0);
  const selectedPackage = DOCUMENT_PACKAGES.find(p => p.id === selectedPackageId);

  const canProceed0 = title.trim().length > 0 && lenderName.trim().length > 0;
  const canProceed1 = lineItems.length > 0;

  const goNext = () => { if (step < STEPS.length - 1) setStep(step + 1); };
  const goBack = () => { if (step > 0) setStep(step - 1); };
  const canContinue = step === 0 ? canProceed0 : step === 1 ? canProceed1 : true;

  const addFakeAttachment = (name: string) => {
    if (attachments.find(a => a.name === name)) return;
    setAttachments(prev => [...prev, {
      id: genId(),
      name,
      type: name.endsWith('.pdf') ? 'PDF' : 'ZIP',
      size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
      uploadedAt: requestDate,
    }]);
  };

  const buildDrawPayload = (status: 'Draft' | 'Submitted') => ({
    propertyId,
    status,
    title,
    requestDate,
    submittedDate: status === 'Submitted' ? requestDate : undefined,
    totalAmount: totalRequested,
    lenderName,
    lenderEmail,
    notes,
    lineItems,
    attachments,
    documentPackageId: selectedPackageId ?? undefined,
    documentPackageName: selectedPackage?.name,
  });

  const handleSaveAsDraft = () => {
    const created = addDraw(propertyId, buildDrawPayload('Draft'));
    setCreatedDrawId(created.id);
    setSavedAsDraft(true);
  };

  const handleSubmit = () => {
    const created = addDraw(propertyId, buildDrawPayload('Submitted'));
    setCreatedDrawId(created.id);
    setSubmitted(true);
  };

  const handleCopyPublicLink = () => {
    if (!createdDrawId) return;
    const url = getShareUrl(propertyId, createdDrawId);
    navigator.clipboard.writeText(url).then(() => {
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    });
  };

  const goBackToDraws = () => navigate(`/dashboard/properties/${propertyId}`);

  // Success screen
  if (submitted || savedAsDraft) {
    return (
      <div className="min-h-full px-4 sm:px-6 lg:px-[58px] flex items-center justify-center py-[60px]">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-[20px] border border-[#D0D0D0] p-[48px] max-w-[520px] w-full text-center shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className={`w-[64px] h-[64px] rounded-full flex items-center justify-center mx-auto mb-[24px] ${savedAsDraft ? 'bg-[#FCF6F0]' : 'bg-[#3E2D1D]'}`}
          >
            {savedAsDraft ? <Save className="w-[28px] h-[28px] text-[#764D2F]" /> : <Check className="w-[28px] h-[28px] text-white" />}
          </motion.div>
          <h2 className="text-[28px] text-[#3E2D1D] mb-[8px]" style={FONT_HEADING}>
            {savedAsDraft ? 'Saved as Draft' : 'Draw Submitted!'}
          </h2>
          <p className="text-[16px] text-[#3E2D1D] mb-[4px]" style={FONT_SF_MEDIUM}>{title}</p>
          <p className="text-[24px] text-[#764D2F] mb-[16px]" style={{ ...FONT_SF_BOLD }}>{formatCurrency(totalRequested)}</p>
          {submitted ? (
            <p className="text-[14px] text-[#8C8780] mb-[32px]" style={FONT_SF_MEDIUM}>
              Your draw request has been submitted to <strong className="text-[#3E2D1D]">{lenderName}</strong>.
              {selectedPackage && ` Includes the ${selectedPackage.name}.`}
            </p>
          ) : (
            <p className="text-[14px] text-[#8C8780] mb-[32px]" style={FONT_SF_MEDIUM}>
              Your draw has been saved as a draft. You can review and submit it from the Draws tab.
            </p>
          )}
          {submitted && (
            <div className="bg-[#FCF6F0] border border-[#E8DFD4] rounded-[12px] p-[16px] mb-[20px] text-left">
              <p className="text-[13px] text-[#764D2F] flex items-start gap-[8px]" style={FONT_SF_MEDIUM}>
                <Sparkles className="w-[14px] h-[14px] mt-[2px] shrink-0" />
                <span>Share the public link below with your lender to give them read-only access to this draw package.</span>
              </p>
            </div>
          )}
          {createdDrawId && (
            <button
              onClick={handleCopyPublicLink}
              className={`w-full flex items-center justify-center gap-[8px] py-[12px] rounded-[10px] text-[14px] mb-[12px] transition-colors cursor-pointer ${
                linkCopied
                  ? 'bg-[#FCF6F0] border border-[#E8DFD4] text-[#764D2F]'
                  : 'bg-[#FAFAF9] border border-[#D0D0D0] text-[#3E2D1D] hover:bg-[#FCF6F0] hover:border-[#E8DFD4] hover:text-[#764D2F]'
              }`}
              style={FONT_SF_MEDIUM}
            >
              {linkCopied ? <Check className="w-[16px] h-[16px]" /> : <Link2 className="w-[16px] h-[16px]" />}
              {linkCopied ? 'Public Link Copied!' : 'Copy Public Link for Lender'}
            </button>
          )}
          <button
            onClick={goBackToDraws}
            className="w-full py-[14px] bg-[#3E2D1D] text-white rounded-[10px] text-[15px] hover:bg-[#2C1F14] transition-colors cursor-pointer"
            style={FONT_SF_SEMIBOLD}
          >
            Back to Property
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-[58px]">
      {/* Breadcrumb */}
      <div className="flex items-center pt-[24px] sm:pt-[32px] pb-[24px]">
        <div className="flex flex-1 flex-col gap-[24px]">
          {/* Breadcrumb row */}
          <div className="flex items-center w-full overflow-x-auto">
            <p className="text-[#764d2f] text-[16px] whitespace-nowrap" style={FONT_SF_MEDIUM}>Properties</p>
            <ChevronBreadcrumb />
            <p className="text-[#764d2f] text-[16px] whitespace-nowrap" style={FONT_SF_MEDIUM}>Draws</p>
            <ChevronBreadcrumb />
            <p className="text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_MEDIUM}>New Draw Request</p>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-[8px] w-full sm:w-[417px]">
            <p className="text-[#3e2d1d] text-[28px]" style={FONT_HEADING}>
              New Draw Request
            </p>
            <p className="text-[#764d2f] text-[16px]" style={FONT_SF_MEDIUM}>
              {property.name} · {property.address}, {property.city}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile horizontal step indicator */}
      <div className="md:hidden flex items-center gap-[8px] justify-center mb-[16px]">
        {STEPS.map((s, idx) => (
          <div key={s.id} className="flex items-center gap-[8px]">
            <div className={`w-[28px] h-[28px] rounded-full flex items-center justify-center text-[12px] ${
              idx < step ? 'bg-[#3E2D1D] text-white' :
              idx === step ? 'border-2 border-[#3E2D1D] text-[#3E2D1D]' :
              'border-2 border-[#D3B597] text-[#D3B597]'
            }`} style={FONT_SF_BOLD}>
              {idx < step ? '✓' : idx + 1}
            </div>
            <span className={`text-[12px] ${idx === step ? 'text-[#3E2D1D]' : 'text-[#D3B597]'} hidden sm:inline`} style={FONT_SF_MEDIUM}>{s.label}</span>
            {idx < STEPS.length - 1 && <div className="w-[16px] h-[2px] bg-[#D3B597] rounded-full" />}
          </div>
        ))}
      </div>

      {/* Main content: Stepper + Form */}
      <div className="flex gap-[32px] items-start">
        {/* Vertical stepper - hidden on mobile */}
        <div className="hidden md:block">
          <VerticalStepper currentStep={step} />
        </div>

        {/* Form content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <StepSetup
                  title={title} setTitle={setTitle}
                  lenderName={lenderName} setLenderName={setLenderName}
                  lenderEmail={lenderEmail} setLenderEmail={setLenderEmail}
                  notes={notes} setNotes={setNotes}
                  requestDate={requestDate}
                />
              )}
              {step === 1 && (
                <StepLineItems
                  categories={categoriesWithBudget}
                  draws={property.draws}
                  lineAmounts={lineAmounts}
                  setLineAmounts={setLineAmounts}
                />
              )}
              {step === 2 && (
                <StepDocuments
                  selectedPackageId={selectedPackageId}
                  setSelectedPackageId={setSelectedPackageId}
                  attachments={attachments}
                  onAddAttachment={addFakeAttachment}
                  onRemoveAttachment={(id: string) => setAttachments(prev => prev.filter(a => a.id !== id))}
                />
              )}
              {step === 3 && (
                <StepReview
                  lineItems={lineItems}
                  totalRequested={totalRequested}
                  title={title}
                  lenderName={lenderName}
                  lenderEmail={lenderEmail}
                  notes={notes}
                  attachments={attachments}
                  selectedPackage={selectedPackage}
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveAsDraft}
                  onEditDocuments={() => setStep(2)}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-start justify-between mt-[32px] pb-[60px] gap-[16px] sm:gap-0">
        {/* Back button */}
        <div className="flex items-center shrink-0">
          <button
            onClick={step === 0 ? goBackToDraws : goBack}
            className="relative flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] cursor-pointer"
          >
            <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="flex items-center justify-center shrink-0 -rotate-90">
              <ArrowUpSvg color="#3E2D1D" />
            </div>
            <p className="text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
              Back
            </p>
          </button>
        </div>

        {/* Right buttons */}
        <div className="flex gap-[24px] items-center shrink-0">
          {step < 3 ? (
            <>
              <button
                onClick={goBackToDraws}
                className="relative flex h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] cursor-pointer"
              >
                <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <p className="text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                  Cancel
                </p>
              </button>
              <button
                onClick={goNext}
                disabled={!canContinue}
                className="bg-[#764d2f] flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5E3A22] transition-colors"
              >
                <p className="text-[16px] text-white whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                  Continue
                </p>
                <div className="flex items-center justify-center shrink-0 rotate-90">
                  <ArrowUpSvg color="white" />
                </div>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSaveAsDraft}
                className="relative flex h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] cursor-pointer"
              >
                <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <p className="text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                  Save Draft
                </p>
              </button>
              <button
                onClick={handleSubmit}
                disabled={lineItems.length === 0}
                className="bg-[#764d2f] flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] rounded-[8px] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#5E3A22] transition-colors"
              >
                <p className="text-[16px] text-white whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                  Continue
                </p>
                <div className="flex items-center justify-center shrink-0 rotate-90">
                  <ArrowUpSvg color="white" />
                </div>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 1: SETUP ────────────────────────────────────────────────────────── */

function StepSetup({ title, setTitle, lenderName, setLenderName, lenderEmail, setLenderEmail, notes, setNotes, requestDate }: {
  title: string; setTitle: (v: string) => void;
  lenderName: string; setLenderName: (v: string) => void;
  lenderEmail: string; setLenderEmail: (v: string) => void;
  notes: string; setNotes: (v: string) => void;
  requestDate: string;
}) {
  return (
    <div className="bg-white rounded-[20px] relative">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="flex flex-col gap-[60px] p-[24px]">
        {/* Draw Details section */}
        <div className="flex flex-col gap-[24px] w-full">
          <p className="text-[#3e2d1d] text-[24px]" style={FONT_HEADING}>
            Draw Details
          </p>
          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] w-full">
            <div className="flex flex-1 flex-col gap-[6px]">
              <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Draw Title *</p>
              <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] focus:outline-none bg-transparent relative z-10"
                  style={FONT_FIGTREE}
                  placeholder="Draw #5"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[6px]">
              <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Request Date</p>
              <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <input
                  type="text"
                  value={requestDate}
                  disabled
                  className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#767676] focus:outline-none bg-transparent relative z-10"
                  style={FONT_FIGTREE}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Lender Information section */}
        <div className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[#3e2d1d] text-[24px]" style={FONT_HEADING}>
              Lender Information
            </p>
            <p className="text-[#764d2f] text-[14px]" style={FONT_SF_MEDIUM}>
              Pre-filled from your Pro Forma. Update if needed.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px] w-full">
            <div className="flex flex-1 flex-col gap-[6px]">
              <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Lender Name *</p>
              <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <input
                  type="text"
                  value={lenderName}
                  onChange={e => setLenderName(e.target.value)}
                  className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] focus:outline-none bg-transparent relative z-10"
                  style={FONT_FIGTREE}
                  placeholder="First National Capital"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-[6px]">
              <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Lender Email</p>
              <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                <input
                  type="email"
                  value={lenderEmail}
                  onChange={e => setLenderEmail(e.target.value)}
                  className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] focus:outline-none bg-transparent relative z-10"
                  style={FONT_FIGTREE}
                  placeholder="draws@firstnational.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notes section */}
        <div className="flex flex-col gap-[24px] w-full">
          <p className="text-[#3e2d1d] text-[24px]" style={FONT_HEADING}>
            Notes
          </p>
          <div className="flex flex-col gap-[6px]">
            <div className="bg-white relative rounded-[8px] w-full min-h-[89px]">
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Describe the work completed during draw period......"
                rows={3}
                className="w-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] placeholder-[#767676] focus:outline-none bg-transparent relative z-10 resize-none"
                style={FONT_FIGTREE}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 2: LINE ITEMS ───────────────────────────────────────────────────── */

function StepLineItems({ categories, draws, lineAmounts, setLineAmounts }: {
  categories: any[]; draws: any[];
  lineAmounts: Record<string, string>; setLineAmounts: (fn: any) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      {categories.length === 0 ? (
        <div className="bg-white rounded-[16px] border-[1.5px] border-dashed border-[#D0D0D0] p-[48px] text-center shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
          <div className="w-[56px] h-[56px] rounded-[16px] bg-[#FCF6F0] flex items-center justify-center mx-auto mb-[16px]">
            <DollarSign className="w-[24px] h-[24px] text-[#764D2F]" />
          </div>
          <p className="text-[18px] text-[#3E2D1D] mb-[6px]" style={FONT_HEADING}>
            No budget categories found
          </p>
          <p className="text-[14px] text-[#8C8780]" style={FONT_SF_MEDIUM}>
            Add budget categories with amounts in the Budget tab first.
          </p>
        </div>
      ) : (
        categories.map((cat: any) => {
          const catBudget = cat.items.reduce((s: number, i: any) => s + i.budget, 0);
          const catDrawn = getDrawnForCategory(cat.id, draws);
          const available = catBudget - catDrawn;
          const isFullyDrawn = available <= 0;
          const requestedAmount = parseMoney(lineAmounts[cat.id] || '0');
          const drawTakenPct = catBudget > 0
            ? Math.min(100, Math.round(((catDrawn + requestedAmount) / catBudget) * 100))
            : 0;

          return (
            <div
              key={cat.id}
              className={`bg-white rounded-[16px] relative ${isFullyDrawn ? 'opacity-75' : ''}`}
            >
              <div aria-hidden="true" className="absolute border-[#e8e5e0] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
              <div className="flex flex-col gap-[16px] p-[26px]">
                {/* Header row */}
                <div className="flex gap-[16px] items-start justify-end w-full">
                  <div className="flex-1 h-[24px]">
                    <div className="flex gap-[10px] items-center">
                      <div className="bg-[#d0d0d0] rounded-full shrink-0 size-[8px]" />
                      <p className="text-[#3e2d1d] text-[16px]" style={FONT_SF_BOLD}>
                        {cat.name}
                      </p>
                    </div>
                  </div>
                  {isFullyDrawn && (
                    <div className="bg-[#fcf6f0] flex items-center justify-center px-[16px] py-[4px] rounded-[100px] shrink-0">
                      <p className="text-[#3e2d1d] text-[14px] whitespace-nowrap" style={FONT_SF_MEDIUM}>
                        Fully Drawn
                      </p>
                    </div>
                  )}
                </div>

                {/* Budget/Drawn/Available info */}
                <div className="w-full">
                  <div className="flex gap-[20px] items-center pl-[18px]">
                    <p className="text-[13px] tracking-[-0.0762px]" style={FONT_INTER_MEDIUM}>
                      <span className="text-[#8c8780]">Budget: </span>
                      <span className="text-[#3e2d1d]">{formatCurrency(catBudget)}</span>
                    </p>
                    <p className="text-[13px] tracking-[-0.0762px]" style={FONT_INTER_MEDIUM}>
                      <span className="text-[#8c8780]">Drawn: </span>
                      <span className="text-[#3e2d1d]">{formatCurrency(catDrawn)}</span>
                    </p>
                    <p className="text-[13px] tracking-[-0.0762px]" style={FONT_INTER_MEDIUM}>
                      <span className="text-[#8c8780]">Available: </span>
                      <span className="text-[#764d2f]">{formatCurrency(Math.max(0, available))}</span>
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="pl-[18px]">
                  <div className="bg-[#e8e5e0] h-[5px] rounded-[100px] w-full overflow-hidden">
                    <div
                      className="bg-[#764d2f] h-[5px] rounded-[100px] transition-all"
                      style={{ width: `${Math.min(100, catBudget > 0 ? Math.round((catDrawn / catBudget) * 100) : 0)}%` }}
                    />
                  </div>
                </div>

                {/* Input fields */}
                <div className="flex gap-[16px] pl-[18px]">
                  <div className="flex-1 flex flex-col gap-[6px]">
                    <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Request Amount</p>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <input
                        type="text"
                        value={lineAmounts[cat.id] || ''}
                        onChange={e => setLineAmounts((prev: any) => ({ ...prev, [cat.id]: e.target.value }))}
                        disabled={isFullyDrawn}
                        placeholder={available > 0 ? fmtInput(available) : '0'}
                        className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] focus:outline-none bg-transparent relative z-10 disabled:opacity-40"
                        style={FONT_FIGTREE}
                      />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col gap-[6px]">
                    <p className="text-[#333] text-[14px]" style={FONT_SF_REGULAR}>Draw Taken To Date (%)</p>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <input
                        type="text"
                        value={`${drawTakenPct}%`}
                        disabled
                        className="w-full h-full px-[12px] py-[10px] rounded-[8px] text-[14px] text-[#3e2d1d] focus:outline-none bg-transparent relative z-10 disabled:opacity-40"
                        style={FONT_FIGTREE}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}

/* ─── STEP 3: DOCUMENTS ───────────────────────────────────────────────────── */

function StepDocuments({ selectedPackageId, setSelectedPackageId, attachments, onAddAttachment, onRemoveAttachment }: {
  selectedPackageId: DocumentPackageId | null;
  setSelectedPackageId: (v: DocumentPackageId | null) => void;
  attachments: DrawAttachment[];
  onAddAttachment: (name: string) => void;
  onRemoveAttachment: (id: string) => void;
}) {
  return (
    <div className="bg-white rounded-[20px] relative">
      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      <div className="flex flex-col gap-[60px] p-[24px]">
        {/* Document Package section */}
        <div className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[#3e2d1d] text-[24px]" style={FONT_HEADING}>
              Document Package
            </p>
            <p className="text-[#764d2f] text-[14px]" style={FONT_SF_MEDIUM}>
              Choose the package your lender requires, or skip and attach individual documents below.
            </p>
          </div>

          {/* Package cards grid */}
          <div className="flex flex-col gap-[16px]">
            {/* Row 1 */}
            <div className="flex gap-[16px]">
              {DOCUMENT_PACKAGES.slice(0, 2).map(pkg => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isSelected={selectedPackageId === pkg.id}
                  onSelect={() => setSelectedPackageId(selectedPackageId === pkg.id ? null : pkg.id)}
                />
              ))}
            </div>
            {/* Row 2 */}
            {DOCUMENT_PACKAGES.length > 2 && (
              <div className="flex gap-[16px]">
                {DOCUMENT_PACKAGES.slice(2, 4).map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={selectedPackageId === pkg.id}
                    onSelect={() => setSelectedPackageId(selectedPackageId === pkg.id ? null : pkg.id)}
                  />
                ))}
              </div>
            )}
            {/* Row 3 */}
            {DOCUMENT_PACKAGES.length > 4 && (
              <div className="flex gap-[16px]">
                {DOCUMENT_PACKAGES.slice(4).map(pkg => (
                  <PackageCard
                    key={pkg.id}
                    pkg={pkg}
                    isSelected={selectedPackageId === pkg.id}
                    onSelect={() => setSelectedPackageId(selectedPackageId === pkg.id ? null : pkg.id)}
                    halfWidth
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Additional Documents section */}
        <div className="flex flex-col gap-[24px] w-full">
          <div className="flex flex-col gap-[8px]">
            <p className="text-[#3e2d1d] text-[24px]" style={FONT_HEADING}>
              Additional Documents
            </p>
            <p className="text-[#764d2f] text-[14px]" style={FONT_SF_MEDIUM}>
              Attach invoices, photos, or any other supporting documents.
            </p>
          </div>

          {/* Attached files */}
          {attachments.length > 0 && (
            <div className="flex flex-col gap-[8px]">
              {attachments.map((att: DrawAttachment) => (
                <div key={att.id} className="flex items-center gap-[12px] py-[10px] px-[16px] bg-[#FAFAF9] rounded-[10px]">
                  <div className="w-[32px] h-[32px] rounded-[8px] bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <FileText className="w-[14px] h-[14px] text-[#4338CA]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] text-[#3E2D1D] truncate" style={FONT_SF_MEDIUM}>{att.name}</p>
                    <p className="text-[12px] text-[#8C8780]" style={FONT_SF_MEDIUM}>{att.type} · {att.size}</p>
                  </div>
                  <button onClick={() => onRemoveAttachment(att.id)} className="text-[#C5C0B9] hover:text-red-400 cursor-pointer p-[4px] rounded-[6px] hover:bg-red-50 transition-colors">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M1 13L13 1M13 13L1 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <div className="bg-[#fffdf8] h-[50px] relative rounded-[8px] w-full">
            <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
            <button
              onClick={() => onAddAttachment('Invoice_Contractor_001.pdf')}
              className="flex items-center gap-[10px] h-full pl-[24px] pr-[48px] py-[10px] w-full cursor-pointer"
            >
              <UploadIcon />
              <p className="text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_MEDIUM}>
                Upload Bank Statement to autofill
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Package Card ────────────────────────────────────────────────────────── */

function PackageCard({ pkg, isSelected, onSelect, halfWidth }: {
  pkg: any; isSelected: boolean; onSelect: () => void; halfWidth?: boolean;
}) {
  // Only show first 3 documents as pills (matching Figma)
  const displayDocs = pkg.documents.slice(0, 3);
  return (
    <div
      onClick={onSelect}
      className={`bg-white ${halfWidth ? 'shrink-0 w-[464px]' : 'flex-[1_0_0] min-w-0'} relative rounded-[16px] cursor-pointer`}
    >
      <div
        aria-hidden="true"
        className={`absolute ${isSelected ? 'border-[#764d2f]' : 'border-[#e8e5e0]'} border-[1.5px] border-solid inset-0 pointer-events-none rounded-[16px]`}
      />
      <div className="flex flex-col gap-[16px] items-start p-[26px] w-full">
        <BoxIcon />
        <div className="flex flex-col gap-[4px] items-start w-full">
          <p className="text-[#3e2d1d] text-[20px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
            {pkg.name}
          </p>
          <p className="text-[#8c8780] text-[13px] tracking-[-0.0762px] leading-[19.5px]" style={FONT_INTER_MEDIUM}>
            {pkg.description}
          </p>
        </div>
        <div className="content-start flex flex-wrap gap-[8px] items-start">
          {displayDocs.map((doc: string) => (
            <div key={doc} className="bg-[#fcf6f0] flex items-center justify-center px-[16px] py-[4px] rounded-[100px] shrink-0">
              <p className="text-[#764d2f] text-[14px] whitespace-nowrap" style={FONT_SF_MEDIUM}>
                {doc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── STEP 4: REVIEW ───────────────────────────────────────────────────────── */

function EditIcon() {
  return (
    <svg width="16.536" height="16.536" viewBox="0 0 16.5355 16.5355" fill="none">
      <path clipRule="evenodd" d="M0.292893 11.2426L10.5 1.03553C11.8807 -0.345178 14.1193 -0.345179 15.5 1.03553C16.8807 2.41625 16.8807 4.65482 15.5 6.03554L5.29289 16.2426C5.10536 16.4302 4.851 16.5355 4.58579 16.5355H1C0.447715 16.5355 0 16.0878 0 15.5355V11.9497C0 11.6845 0.105357 11.4302 0.292893 11.2426ZM14.4393 4.97488L4.37868 15.0355H1.5V12.1569L11.5607 2.0962C12.3556 1.30127 13.6444 1.30127 14.4393 2.09619C15.2343 2.89112 15.2343 4.17995 14.4393 4.97488Z" fill="#3E2D1D" fillRule="evenodd" />
    </svg>
  );
}

function StepReview({ lineItems, totalRequested, title, lenderName, lenderEmail, notes, attachments, selectedPackage, onSubmit, onSaveDraft, onEditDocuments }: {
  lineItems: DrawLineItem[]; totalRequested: number;
  title: string; lenderName: string; lenderEmail: string;
  notes: string; attachments: DrawAttachment[]; selectedPackage: any;
  onSubmit: () => void; onSaveDraft: () => void; onEditDocuments: () => void;
}) {
  const displayDocs = selectedPackage ? selectedPackage.documents.slice(0, 3) : [];
  return (
    <div className="flex flex-col gap-[16px]">
      {/* ── Brown summary header ── */}
      <div className="bg-[#764d2f] relative rounded-[16px] shrink-0 w-full">
        <div className="flex items-center justify-center overflow-clip rounded-[inherit]">
          <div className="flex gap-[10px] items-center justify-center p-[28px] w-full">
            {/* Left: title & lender */}
            <div className="flex-[1_0_0] flex flex-col gap-[10px] items-start min-w-0 text-white">
              <p className="text-[28px] w-full" style={FONT_SF_SEMIBOLD}>
                {title}
              </p>
              <p className="text-[16px] text-center whitespace-nowrap" style={FONT_SF_MEDIUM}>
                To: {lenderName}{lenderEmail ? ` · ${lenderEmail}` : ''}
              </p>
            </div>
            {/* Right: total */}
            <div className="flex-[1_0_0] flex flex-col items-end justify-center min-w-0 text-center text-white whitespace-nowrap">
              <p className="text-[16px]" style={FONT_SF_MEDIUM}>
                Total Request
              </p>
              <p className="text-[36px] leading-[50px]" style={FONT_SF_BOLD}>
                {formatCurrency(totalRequested)}
              </p>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      </div>

      {/* ── Line items table ── */}
      <div className="bg-white relative rounded-[20px] shrink-0 w-full">
        <div className="overflow-clip rounded-[inherit]">
          <div className="flex flex-col items-start p-px w-full">
            {/* Table header */}
            <div className="bg-[#fafaf9] shrink-0 w-full relative">
              <div aria-hidden="true" className="absolute border-[#e8e5e0] border-b border-solid inset-0 pointer-events-none" />
              <div className="flex items-center justify-between px-[16px] pt-[12px] pb-[13px] w-full">
                <div className="shrink-0 w-[253px]">
                  <p className="text-[#8c8780] text-[11px] uppercase tracking-[0.6145px] leading-[16.5px]" style={FONT_SF_MEDIUM}>
                    Category
                  </p>
                </div>
                <div className="shrink-0 w-[126px] text-right">
                  <p className="text-[#8c8780] text-[11px] uppercase tracking-[0.6145px] leading-[16.5px]" style={FONT_SF_MEDIUM}>
                    Budget
                  </p>
                </div>
                <div className="shrink-0 w-[126px] text-right">
                  <p className="text-[#8c8780] text-[11px] uppercase tracking-[0.6145px] leading-[16.5px]" style={FONT_SF_MEDIUM}>
                    prev. Drawn
                  </p>
                </div>
                <div className="shrink-0 w-[126px] text-center">
                  <p className="text-[#8c8780] text-[11px] uppercase tracking-[0.6145px] leading-[16.5px]" style={FONT_SF_MEDIUM}>
                    This draw
                  </p>
                </div>
                <div className="shrink-0 w-[126px] text-center">
                  <p className="text-[#8c8780] text-[11px] uppercase tracking-[0.6145px] leading-[16.5px]" style={FONT_SF_MEDIUM}>
                    % done
                  </p>
                </div>
              </div>
            </div>

            {/* Data rows */}
            {lineItems.map((li: DrawLineItem) => (
              <div key={li.id} className="bg-white shrink-0 w-full">
                <div className="flex items-center justify-between px-[16px] py-[12px] w-full">
                  <div className="flex items-center shrink-0 w-[253.5px]">
                    <p className="text-[#3e2d1d] text-[14px] leading-[21px] tracking-[-0.1504px]" style={FONT_SF_BOLD}>
                      {li.categoryName}
                    </p>
                  </div>
                  <div className="shrink-0 w-[126.75px] text-right">
                    <p className="text-[#3e2d1d] text-[14px] leading-[21px] tracking-[-0.1504px]" style={FONT_SF_BOLD}>
                      {formatCurrency(li.budgetAmount)}
                    </p>
                  </div>
                  <div className="shrink-0 w-[126.75px] text-right">
                    <p className="text-[#764d2f] text-[13px] leading-[19.5px] tracking-[-0.0762px]" style={FONT_SF_MEDIUM}>
                      {formatCurrency(li.previouslyDrawn)}
                    </p>
                  </div>
                  <div className="shrink-0 w-[126.75px] text-center">
                    <p className="text-[#3e2d1d] text-[13px] leading-[19.5px] tracking-[-0.0762px]" style={FONT_SF_MEDIUM}>
                      {formatCurrency(li.requestedAmount)}
                    </p>
                  </div>
                  <div className="shrink-0 w-[126.75px] text-right">
                    <p className="text-[#b5b0a8] text-[13px] leading-[19.5px] tracking-[-0.0762px]" style={FONT_SF_MEDIUM}>
                      {li.percentComplete}%
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {/* Total row */}
            <div className="bg-[#fafaf9] relative shrink-0 w-full">
              <div aria-hidden="true" className="absolute border-[#d0d0d0] border-solid border-t-2 inset-0 pointer-events-none" />
              <div className="flex items-center justify-between px-[16px] py-[14px] w-full">
                <div className="shrink-0 w-[253.5px]">
                  <p className="text-[#3e2d1d] text-[13px] leading-[19.5px] tracking-[-0.0762px] pl-[22px]" style={FONT_SF_BOLD}>
                    TOTAL
                  </p>
                </div>
                <div className="shrink-0 w-[126.75px]" />
                <div className="shrink-0 w-[126.75px]" />
                <div className="shrink-0 w-[126.75px] text-right">
                  <p className="text-[#3e2d1d] text-[13px] leading-[19.5px] tracking-[-0.0762px]" style={FONT_SF_BOLD}>
                    {formatCurrency(totalRequested)}
                  </p>
                </div>
                <div className="shrink-0 w-[126.75px]" />
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
      </div>

      {/* ── Document package card ── */}
      {selectedPackage && (
        <div className="bg-white relative rounded-[16px] shrink-0 w-full">
          <div aria-hidden="true" className="absolute border-[#764d2f] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          <div className="flex flex-col gap-[16px] items-start p-[26px] w-full">
            {/* Top row: icon + edit */}
            <div className="flex items-center justify-between shrink-0 w-full">
              <BoxIcon />
              <button
                onClick={onEditDocuments}
                className="flex gap-[8px] items-center justify-end shrink-0 cursor-pointer"
              >
                <EditIcon />
                <p className="underline decoration-solid text-[#3e2d1d] text-[16px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                  Edit
                </p>
              </button>
            </div>
            {/* Title + description */}
            <div className="flex flex-col gap-[4px] items-start w-full">
              <p className="text-[#3e2d1d] text-[20px] whitespace-nowrap" style={FONT_SF_SEMIBOLD}>
                {selectedPackage.name}
              </p>
              <p className="text-[#8c8780] text-[13px] tracking-[-0.0762px] leading-[19.5px]" style={FONT_INTER_MEDIUM}>
                {selectedPackage.description}
              </p>
            </div>
            {/* Document pills */}
            <div className="flex gap-[8px] items-start shrink-0">
              {displayDocs.map((doc: string) => (
                <div key={doc} className="bg-[#fcf6f0] flex items-center justify-center px-[16px] py-[4px] rounded-[100px] shrink-0">
                  <p className="text-[#764d2f] text-[14px] whitespace-nowrap" style={FONT_SF_MEDIUM}>
                    {doc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Warning if no line items */}
      {lineItems.length === 0 && (
        <div className="bg-[#FEF2F2] border border-[#FCA5A5] rounded-[16px] p-[20px] text-center">
          <p className="text-[14px] text-[#DC2626]" style={FONT_SF_MEDIUM}>No line items selected. Please go back and enter draw amounts.</p>
        </div>
      )}
    </div>
  );
}