import { useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useApp, genId } from '../../context/AppContext';
import type { PropertyType, PropertyStatus } from '../../context/AppContext';
import svgPaths from '../../../imports/svg-2jpk391bzg';
import figmaSvg from '../../../imports/svg-e1pcjf8vsp';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const PROPERTY_TYPES: PropertyType[] = ['Single Family', 'Multi-Family', 'Commercial', 'Mixed Use', 'Land'];
const PROPERTY_STATUSES: PropertyStatus[] = ['Acquisition', 'Under Contract', 'Active', 'Closed'];
const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const sfMed = "font-['SF_Pro',sans-serif] font-[510]";
const sfReg = "font-['SF_Pro',sans-serif] font-normal";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1762758731316-419c3c283ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1656646424531-cc9041d3e5ca?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1582407947304-fd86f028f716?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1560518883-ce09059eeffa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
];

/* Breadcrumb chevron (rotate 90 from the expand-less icon) */
function BreadcrumbChevron() {
  return (
    <div className="flex items-center justify-center size-[24px]" style={{ transform: 'rotate(90deg)' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d={svgPaths.p7e66880} fill="#8C8780" />
      </svg>
    </div>
  );
}

/* Dropdown chevron arrow (the small filled triangle) */
function DropdownChevron() {
  return (
    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: 'translateY(-50%) rotate(180deg)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path clipRule="evenodd" d={figmaSvg.p22c4cb00} fill="#767676" fillRule="evenodd" />
      </svg>
    </div>
  );
}

/* Upload icon */
function UploadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3E2D1D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={figmaSvg.p27c29e0} />
    </svg>
  );
}

/* Checkmark for button */
function CheckIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d={figmaSvg.p3981cc70} fill="white" />
    </svg>
  );
}

export function AddPropertyPage() {
  const { addProperty } = useApp();
  const navigate = useNavigate();

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
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: string, val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => { const n = { ...p }; delete n[key]; return n; });
  };

  const handleSubmit = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Property name is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    setErrors(e);
    if (Object.keys(e).length > 0) return;

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
      status: form.status,
      coverImage: form.coverImage,
      proforma: {
        exitStrategy: 'Fix & Flip',
        purchasePrice: 0,
        rehabCost: 0,
        holdingCosts: 0,
        financingCosts: 0,
        softCosts: 0,
        afterRepairValue: 0,
        lenderName: '',
        loanAmount: 0,
        interestRate: 0,
        loanTermMonths: 12,
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
  };

  return (
    <div className="min-h-full px-4 sm:px-6 lg:px-[58px] pb-[48px]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-[960px] pt-[32px] flex flex-col gap-[32px]"
      >
        {/* Breadcrumb */}
        <div className="flex items-center">
          <button
            onClick={() => navigate('/dashboard/properties')}
            className="text-[#8C8780] text-[16px] cursor-pointer hover:text-[#3E2D1D] transition-colors"
            style={{ fontWeight: 510 }}
          >
            Properties
          </button>
          <BreadcrumbChevron />
          <span className="text-[#764D2F] text-[16px]" style={{ fontWeight: 510 }}>
            Add Property
          </span>
        </div>

        {/* Page Heading */}
        <div>
          <p className={`${canela} text-[28px] text-[#3E2D1D] mb-[8px]`}>Add Property</p>
          <p className={`${sfMed} text-[16px] text-[#764D2F]`} style={wdth}>
            Add your property profile details to start budgeting and tracking draws.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-4 sm:p-[32px] flex flex-col gap-[42px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">

          {/* ── Property Identity Section ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Property Identity</p>

            {/* Property Name */}
            <FormField label="Property Name" error={errors.name}>
              <input
                type="text"
                value={form.name}
                onChange={e => set('name', e.target.value)}
                placeholder="e.g Westlake Commons"
                className={inputCls(errors.name)}
              />
            </FormField>

            {/* Street Address */}
            <FormField label="Street Address" error={errors.address}>
              <div className="relative">
                <input
                  type="text"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                  placeholder="123 main st"
                  className={inputCls(errors.address)}
                />
                <DropdownChevron />
              </div>
            </FormField>

            {/* City / State / Zip */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <FormField label="City" className="flex-1" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={e => set('city', e.target.value)}
                  placeholder="Austin"
                  className={inputCls(errors.city)}
                />
              </FormField>
              <FormField label="State" className="flex-1">
                <div className="relative">
                  <select
                    value={form.state}
                    onChange={e => set('state', e.target.value)}
                    className={selectCls()}
                  >
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <DropdownChevron />
                </div>
              </FormField>
              <FormField label="Zip Code" className="flex-1">
                <input
                  type="text"
                  value={form.zip}
                  onChange={e => set('zip', e.target.value)}
                  placeholder="78701"
                  className={inputCls()}
                  maxLength={10}
                />
              </FormField>
            </div>
          </div>

          {/* ── Property Specs Section ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Property Specs</p>

            {/* Property Type / Current Status */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <FormField label="Property Type" className="flex-1">
                <div className="relative">
                  <select
                    value={form.type}
                    onChange={e => set('type', e.target.value)}
                    className={selectCls()}
                  >
                    {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t === 'Multi-Family' ? 'Multi Family' : t}</option>)}
                  </select>
                  <DropdownChevron />
                </div>
              </FormField>
              <FormField label="Current Status" className="flex-1">
                <div className="relative">
                  <select
                    value={form.status}
                    onChange={e => set('status', e.target.value)}
                    className={selectCls()}
                  >
                    {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <DropdownChevron />
                </div>
              </FormField>
            </div>

            {/* Gross Sq.Ft / Units */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <FormField label="Gross Sq.Ft" className="flex-1">
                <input
                  type="text"
                  value={form.sqft}
                  onChange={e => set('sqft', e.target.value)}
                  placeholder="20000"
                  className={inputCls()}
                />
              </FormField>
              <FormField label="Units / Doors" className="flex-1">
                <input
                  type="text"
                  value={form.units}
                  onChange={e => set('units', e.target.value)}
                  placeholder="1"
                  className={inputCls()}
                />
              </FormField>
            </div>

            {/* Year Built / Lot Size */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <FormField label="Year Built" className="flex-1">
                <input
                  type="text"
                  value={form.yearBuilt}
                  onChange={e => set('yearBuilt', e.target.value)}
                  placeholder="2005"
                  className={inputCls()}
                />
              </FormField>
              <FormField label="Lot Size (Acres)" className="flex-1">
                <input
                  type="text"
                  value={form.lotSize}
                  onChange={e => set('lotSize', e.target.value)}
                  placeholder="0.5"
                  className={inputCls()}
                />
              </FormField>
            </div>

            {/* Zoning */}
            <FormField label="Zoning">
              <input
                type="text"
                value={form.zoning}
                onChange={e => set('zoning', e.target.value)}
                placeholder="e.g R1, MF-4, C-2"
                className={inputCls()}
              />
            </FormField>
          </div>

          {/* ── Upload Cover Photo ── */}
          <button
            type="button"
            className="flex items-center justify-center gap-[10px] w-full h-[52px] rounded-[8px] border-[1.5px] border-dashed border-[#D0D0D0] bg-transparent text-[#3E2D1D] text-[14px] hover:bg-[#FAFAF9] hover:border-[#8C8780] transition-all cursor-pointer"
            style={{ fontWeight: 510 }}
          >
            <UploadIcon />
            Upload Cover Photo
          </button>
        </div>

        {/* ── Create Property Button ── */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#764d2f] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer border-none hover:bg-[#5c3a22] transition-colors"
            style={{ fontWeight: 590, fontFamily: "'SF Pro', -apple-system, sans-serif", fontVariationSettings: "'wdth' 100" }}
          >
            <CheckIcon />
            <span className="text-[16px] text-white leading-[normal]">Create Property</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────���─── */

function FormField({ label, children, className, error }: {
  label: string;
  children: React.ReactNode;
  className?: string;
  error?: string;
}) {
  return (
    <div className={`flex flex-col gap-[6px] ${className || ''}`}>
      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
        {label}
      </p>
      {children}
      {error && <p className="text-[12px] text-red-500" style={{ fontWeight: 510 }}>{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full h-[46px] px-[12px] py-[10px] rounded-[8px] border ${
    error ? 'border-red-300 bg-red-50/50' : 'border-[#D0D0D0] bg-white'
  } text-[14px] text-[#767676] placeholder-[#767676] focus:text-[#3E2D1D] focus:outline-none focus:border-[#764D2F] transition-all font-['Figtree',sans-serif]`;
}

function selectCls() {
  return `w-full h-[46px] px-[12px] py-[10px] rounded-[8px] border border-[#D0D0D0] bg-white text-[14px] text-[#767676] focus:text-[#3E2D1D] focus:outline-none focus:border-[#764D2F] transition-all appearance-none cursor-pointer pr-[36px] font-['Figtree',sans-serif]`;
}