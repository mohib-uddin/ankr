import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, ChevronLeft, ChevronRight, Check, MapPin, DollarSign } from 'lucide-react';
import { useApp, genId } from '@/app/context/AppContext';
import { useNavigate } from 'react-router';
import type { PropertyType, PropertyStatus, ExitStrategy } from '@/app/context/AppContext';

const EXIT_STRATEGIES: ExitStrategy[] = ['Fix & Flip', 'BRRRR', 'Hold & Rent', 'Wholesale', 'Development'];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762758731316-419c3c283ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1656646424531-cc9041d3e5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
];

const STEPS = [
  { id: 1, label: 'Property Details', icon: MapPin },
  { id: 2, label: 'Financials', icon: DollarSign },
];

function parseMoney(v: string) {
  return parseFloat(v.replace(/[^0-9.]/g, '')) || 0;
}

export function AddPropertyModal({ onClose }: { onClose: () => void }) {
  const { addProperty } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const [form, setForm] = useState({
    name: '',
    address: '',
    city: '',
    state: 'TX',
    zip: '',
    type: 'Multi-Family' as PropertyType,
    status: 'Acquisition' as PropertyStatus,
    sqft: '',
    units: '',
    yearBuilt: '',
    lotSize: '',
    zoning: '',
    coverImage: DEFAULT_IMAGES[0],
    // Financials
    exitStrategy: 'Fix & Flip' as ExitStrategy,
    purchasePrice: '',
    afterRepairValue: '',
    rehabCost: '',
    holdingCosts: '',
    financingCosts: '',
    softCosts: '',
    lenderName: '',
    lenderEmail: '',
    loanAmount: '',
    interestRate: '',
    loanTermMonths: '12',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    setDirection(1);
    setStep(s => s + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStep(s => s - 1);
  };

  const handleSubmit = () => {
    const newProp = addProperty({
      name: form.name,
      address: form.address,
      city: form.city,
      state: form.state,
      zip: form.zip,
      type: form.type,
      sqft: parseInt(form.sqft) || 0,
      units: parseInt(form.units) || 1,
      yearBuilt: parseInt(form.yearBuilt) || undefined,
      lotSize: parseFloat(form.lotSize) || undefined,
      zoning: form.zoning || undefined,
      status: form.status,
      coverImage: form.coverImage,
      proforma: {
        exitStrategy: form.exitStrategy,
        purchasePrice: parseMoney(form.purchasePrice),
        rehabCost: parseMoney(form.rehabCost),
        holdingCosts: parseMoney(form.holdingCosts),
        financingCosts: parseMoney(form.financingCosts),
        softCosts: parseMoney(form.softCosts),
        afterRepairValue: parseMoney(form.afterRepairValue),
        lenderName: form.lenderName,
        lenderEmail: form.lenderEmail,
        loanAmount: parseMoney(form.loanAmount),
        interestRate: parseFloat(form.interestRate) || 0,
        loanTermMonths: parseInt(form.loanTermMonths) || 12,
      },
      budget: {
        grossSqft: parseInt(form.sqft) || 0,
        netSqft: Math.round((parseInt(form.sqft) || 0) * 0.75),
        categories: [
          { id: genId(), name: 'Site Work', items: [] },
          { id: genId(), name: 'Hard Costs', items: [] },
          { id: genId(), name: 'Soft Costs', items: [] },
          { id: genId(), name: 'Financing', items: [] },
          { id: genId(), name: 'Contingency', note: '5%', items: [] },
        ],
      },
    });
    navigate(`/dashboard/properties/${newProp.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl border border-[#E6E2DB] w-full max-w-[600px] max-h-[92vh] overflow-hidden flex flex-col shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E6E2DB] shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center">
                <Building2 className="w-4 h-4 text-[#22C55E]" />
              </div>
              <div>
                <h2 className="text-[15px] text-[#1A1A1A]">Add Property</h2>
                <p className="text-[12px] text-[#8C8780]">Step {step} of {STEPS.length}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F8F6F1] text-[#8C8780] cursor-pointer transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Step indicators */}
          <div className="px-6 py-3 border-b border-[#E6E2DB] bg-[#FAFAF9] shrink-0">
            <div className="flex items-center gap-2">
              {STEPS.map((s, i) => {
                const isDone = s.id < step;
                const isActive = s.id === step;
                return (
                  <div key={s.id} className="flex items-center gap-2">
                    {i > 0 && <div className={`h-px w-8 ${isDone ? 'bg-[#22C55E]' : 'bg-[#E6E2DB]'}`} />}
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] transition-colors ${
                        isDone ? 'bg-[#22C55E] text-white' : isActive ? 'bg-[#1A1A1A] text-white' : 'bg-[#E6E2DB] text-[#8C8780]'
                      }`}>
                        {isDone ? <Check className="w-3 h-3" /> : s.id}
                      </div>
                      <span className={`text-[12px] ${isActive ? 'text-[#1A1A1A]' : 'text-[#8C8780]'}`}>{s.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form content */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.18 }}
                className="px-6 py-5 space-y-5"
              >
                {step === 1 && (
                  <Step1Form form={form} set={set} errors={errors} />
                )}
                {step === 2 && (
                  <Step2Form form={form} set={set} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[#E6E2DB] shrink-0 flex items-center gap-3">
            {step > 1 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#E6E2DB] text-[13px] text-[#8C8780] hover:bg-[#F8F6F1] transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-[#E6E2DB] text-[13px] text-[#8C8780] hover:bg-[#F8F6F1] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
            <div className="flex-1" />
            {step < STEPS.length ? (
              <button
                onClick={goNext}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#22C55E] text-white text-[13px] hover:bg-[#16A34A] transition-colors cursor-pointer"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#22C55E] text-white text-[13px] hover:bg-[#16A34A] transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" /> Create Property
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── STEP 1: PROPERTY DETAILS ─────────────────────────────────────────────────

function Step1Form({ form, set, errors }: { form: any; set: (k: string, v: string) => void; errors: Record<string, string> }) {
  return (
    <div className="space-y-5">
      {/* Identity */}
      <Section title="Property Identity">
        <Field label="Property Name *" error={errors.name}>
          <input
            type="text"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            placeholder="e.g. Westlake Commons"
            className={inputCls(errors.name)}
          />
        </Field>
        <Field label="Street Address *" error={errors.address}>
          <input
            type="text"
            value={form.address}
            onChange={e => set('address', e.target.value)}
            placeholder="123 Main St"
            className={inputCls(errors.address)}
          />
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label="City *" error={errors.city} className="col-span-1">
            <input
              type="text"
              value={form.city}
              onChange={e => set('city', e.target.value)}
              placeholder="Austin"
              className={inputCls(errors.city)}
            />
          </Field>
          <Field label="State">
            <select
              value={form.state}
              onChange={e => set('state', e.target.value)}
              className={inputCls()}
            >
              {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="ZIP Code">
            <input
              type="text"
              value={form.zip}
              onChange={e => set('zip', e.target.value)}
              placeholder="78701"
              className={inputCls()}
              maxLength={10}
            />
          </Field>
        </div>
      </Section>

      {/* Property Specs */}
      <Section title="Property Specs">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Property Type">
            <select value={form.type} onChange={e => set('type', e.target.value)} className={inputCls()}>
              {['Single Family', 'Multi-Family', 'Commercial', 'Mixed Use', 'Land'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Current Status">
            <select value={form.status} onChange={e => set('status', e.target.value)} className={inputCls()}>
              {['Acquisition', 'Under Contract', 'Active', 'Closed'].map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </Field>
          <Field label="Gross Sq. Ft.">
            <input type="number" value={form.sqft} onChange={e => set('sqft', e.target.value)} placeholder="20,000" className={inputCls()} />
          </Field>
          <Field label="Units / Doors">
            <input type="number" value={form.units} onChange={e => set('units', e.target.value)} placeholder="1" className={inputCls()} min="1" />
          </Field>
          <Field label="Year Built">
            <input type="number" value={form.yearBuilt} onChange={e => set('yearBuilt', e.target.value)} placeholder="2005" className={inputCls()} />
          </Field>
          <Field label="Lot Size (acres)">
            <input type="number" value={form.lotSize} onChange={e => set('lotSize', e.target.value)} placeholder="0.5" step="0.01" className={inputCls()} />
          </Field>
        </div>
        <Field label="Zoning">
          <input type="text" value={form.zoning} onChange={e => set('zoning', e.target.value)} placeholder="e.g. R-1, MF-4, C-2" className={inputCls()} />
        </Field>
      </Section>

      {/* Cover Photo */}
      <Section title="Cover Photo">
        <div className="grid grid-cols-3 gap-2">
          {DEFAULT_IMAGES.map((img, i) => (
            <button
              key={i}
              onClick={() => set('coverImage', img)}
              className={`relative h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${form.coverImage === img ? 'border-[#22C55E]' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {form.coverImage === img && (
                <div className="absolute inset-0 bg-[#22C55E]/20 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-[#22C55E] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      </Section>
    </div>
  );
}

// ─── STEP 2: FINANCIALS ───────────────────────────────────────────────────────

function Step2Form({ form, set }: { form: any; set: (k: string, v: string) => void }) {
  const purchasePrice = parseMoney(form.purchasePrice);
  const rehabCost = parseMoney(form.rehabCost);
  const holdingCosts = parseMoney(form.holdingCosts);
  const financingCosts = parseMoney(form.financingCosts);
  const softCosts = parseMoney(form.softCosts);
  const arv = parseMoney(form.afterRepairValue);
  const totalInvestment = purchasePrice + rehabCost + holdingCosts + financingCosts + softCosts;
  const grossProfit = arv - totalInvestment;
  const roi = totalInvestment > 0 ? ((grossProfit / totalInvestment) * 100).toFixed(1) : '—';

  return (
    <div className="space-y-5">
      {/* Deal Structure */}
      <Section title="Deal Structure">
        <Field label="Exit Strategy">
          <select value={form.exitStrategy} onChange={e => set('exitStrategy', e.target.value)} className={inputCls()}>
            {EXIT_STRATEGIES.map(o => <option key={o} value={o}>{o}</option>)}
          </select>
        </Field>
      </Section>

      {/* Cost Inputs */}
      <Section title="Cost Inputs">
        <div className="grid grid-cols-2 gap-3">
          <MoneyField label="Purchase Price" value={form.purchasePrice} onChange={v => set('purchasePrice', v)} placeholder="1,500,000" />
          <MoneyField label="Rehab / Construction" value={form.rehabCost} onChange={v => set('rehabCost', v)} placeholder="500,000" />
          <MoneyField label="Holding Costs" value={form.holdingCosts} onChange={v => set('holdingCosts', v)} placeholder="30,000" />
          <MoneyField label="Financing Costs" value={form.financingCosts} onChange={v => set('financingCosts', v)} placeholder="65,000" />
          <MoneyField label="Soft Costs" value={form.softCosts} onChange={v => set('softCosts', v)} placeholder="40,000" />
          <MoneyField label="After Repair Value (ARV)" value={form.afterRepairValue} onChange={v => set('afterRepairValue', v)} placeholder="2,500,000" highlight />
        </div>

        {/* Live calc */}
        {totalInvestment > 0 && (
          <div className="mt-3 bg-[#F8F6F1] rounded-xl p-3 grid grid-cols-3 gap-3">
            <div>
              <p className="text-[10px] text-[#8C8780] mb-0.5">Total Invested</p>
              <p className="text-[13px] text-[#1A1A1A]">${totalInvestment.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#8C8780] mb-0.5">Gross Profit</p>
              <p className={`text-[13px] ${grossProfit >= 0 ? 'text-[#22C55E]' : 'text-red-500'}`}>
                {grossProfit >= 0 ? '+' : ''}{grossProfit.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-[#8C8780] mb-0.5">Gross ROI</p>
              <p className={`text-[13px] ${parseFloat(roi) >= 0 ? 'text-[#22C55E]' : 'text-red-500'}`}>{roi !== '—' ? `${roi}%` : '—'}</p>
            </div>
          </div>
        )}
      </Section>

      {/* Lender */}
      <Section title="Lender Details (optional)">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Lender Name">
            <input type="text" value={form.lenderName} onChange={e => set('lenderName', e.target.value)} placeholder="First National Capital" className={inputCls()} />
          </Field>
          <Field label="Lender Email">
            <input type="email" value={form.lenderEmail} onChange={e => set('lenderEmail', e.target.value)} placeholder="draws@lender.com" className={inputCls()} />
          </Field>
          <MoneyField label="Loan Amount" value={form.loanAmount} onChange={v => set('loanAmount', v)} placeholder="1,200,000" />
          <Field label="Interest Rate (%)">
            <div className="relative">
              <input
                type="number"
                value={form.interestRate}
                onChange={e => set('interestRate', e.target.value)}
                placeholder="7.5"
                step="0.25"
                className={`${inputCls()} pr-8`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#8C8780]">%</span>
            </div>
          </Field>
          <Field label="Loan Term (months)">
            <input type="number" value={form.loanTermMonths} onChange={e => set('loanTermMonths', e.target.value)} placeholder="12" className={inputCls()} />
          </Field>
        </div>
      </Section>
    </div>
  );
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function inputCls(error?: string) {
  return `w-full px-3 py-2 rounded-lg border ${error ? 'border-red-300 bg-red-50' : 'border-[#E6E2DB] bg-[#F8F6F1]'} text-[13px] text-[#1A1A1A] placeholder-[#C5C0B9] focus:outline-none focus:border-[#22C55E] focus:bg-white transition-colors`;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] text-[#8C8780] uppercase tracking-wider mb-3">{title}</p>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children, error, className }: { label: string; children: React.ReactNode; error?: string; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-[12px] text-[#8C8780] mb-1">{label}</label>
      {children}
      {error && <p className="text-[11px] text-red-500 mt-0.5">{error}</p>}
    </div>
  );
}

function MoneyField({ label, value, onChange, placeholder, highlight }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  highlight?: boolean;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[#8C8780]">$</span>
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full pl-6 pr-3 py-2 rounded-lg border text-[13px] focus:outline-none transition-colors placeholder-[#C5C0B9] ${
            highlight
              ? 'border-[#22C55E]/40 bg-[#F0FDF4] focus:border-[#22C55E] text-[#16A34A]'
              : 'border-[#E6E2DB] bg-[#F8F6F1] focus:border-[#22C55E] focus:bg-white text-[#1A1A1A]'
          }`}
        />
      </div>
    </Field>
  );
}