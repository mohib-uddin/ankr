import { useMemo, useState, type CSSProperties } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDropzone } from 'react-dropzone';
import type { PropertyType } from '@/app/context/AppContext';
import svgPaths from '@/icons/dashboard-shared';
import figmaSvg from '@/icons/add-property';
import { OutlinedTextField } from '@/shared/components/form';
import { OutlinedSelect, type OutlinedSelectOption } from '@/shared/components/form/OutlinedSelect';
import { useCreatePropertyMutation } from '@/services/properties.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { propertyFormSchema } from '@/features/properties/schemas/property.schemas';

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY',
];

const PROPERTY_TYPES: PropertyType[] = ['Single Family', 'Multi-Family', 'Commercial'];
const PROPERTY_STATUSES = ['Acquisition', 'Open', 'Under Contract', 'Closed'] as const;
const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const sfMed = "font-['SF_Pro',sans-serif] font-[510]";
const sfReg = "font-['SF_Pro',sans-serif] font-normal";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };

const DEFAULT_IMAGES = [
  'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
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
  const navigate = useNavigate();
  const createPropertyMutation = useCreatePropertyMutation();
  const [files, setFiles] = useState<File[]>([]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      state: 'TX',
      zipCode: '',
      propertyType: 'Multi-Family',
      currentStatus: 'Acquisition',
      grossSqFt: undefined,
      unitsDoors: undefined,
      yearBuilt: undefined,
      lotSizeAcres: undefined,
      zoning: '',
      estimatedValue: undefined,
      loanBalance: undefined,
      monthlyRent: undefined,
      interestRate: undefined,
      monthlyPayment: undefined,
      lender: '',
      maturityDate: '',
      ownershipPercentage: 100,
    },
  });

  const onDrop = (acceptedFiles: File[]) => {
    setFiles(prev => {
      const next = [...prev, ...acceptedFiles].slice(0, 5);
      return next;
    });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxFiles: 5,
    onDrop,
  });

  const imagePreviews = useMemo(
    () => files.map(file => Object.assign(file, { preview: URL.createObjectURL(file) })),
    [files],
  );

  const serverError =
    createPropertyMutation.isError && createPropertyMutation.error
      ? getApiErrorMessage(createPropertyMutation.error)
      : '';

  const onSubmit = handleSubmit((values) => {
    const formData = new FormData();
    if (values.name) formData.append('name', values.name);
    formData.append('address', values.address);
    if (values.city) formData.append('city', values.city);
    if (values.state) formData.append('state', values.state);
    if (values.zipCode) formData.append('zipCode', values.zipCode);
    formData.append('propertyType', values.propertyType);
    if (values.currentStatus) formData.append('currentStatus', values.currentStatus);
    if (values.grossSqFt != null) formData.append('grossSqFt', String(values.grossSqFt));
    if (values.unitsDoors != null) formData.append('unitsDoors', String(values.unitsDoors));
    if (values.yearBuilt != null) formData.append('yearBuilt', String(values.yearBuilt));
    if (values.lotSizeAcres != null) formData.append('lotSizeAcres', String(values.lotSizeAcres));
    if (values.zoning) formData.append('zoning', values.zoning);
    formData.append('estimatedValue', String(values.estimatedValue));
    formData.append('loanBalance', String(values.loanBalance));
    formData.append('monthlyRent', String(values.monthlyRent));
    if (values.interestRate != null) formData.append('interestRate', String(values.interestRate));
    if (values.monthlyPayment != null) formData.append('monthlyPayment', String(values.monthlyPayment));
    if (values.lender) formData.append('lender', values.lender);
    if (values.maturityDate) formData.append('maturityDate', values.maturityDate);
    if (values.ownershipPercentage != null) formData.append('ownershipPercentage', String(values.ownershipPercentage));

    files.forEach((file) => formData.append('images', file));

    createPropertyMutation.mutate(formData, {
      onSuccess: (res) => {
        reset();
        setFiles([]);
        const created = (res.data as unknown as { id?: string }) ?? null;
        if (created?.id) {
          navigate(`/dashboard/properties/${created.id}`);
        } else {
          navigate('/dashboard/properties');
        }
      },
    });
  });

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
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-[20px] border border-[#D0D0D0] p-4 sm:p-[32px] flex flex-col gap-[42px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
          noValidate
        >
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
              {serverError}
            </div>
          )}

          {/* ── Property Identity Section ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Property Identity</p>

            {/* Property Name */}
            <OutlinedTextField
              control={control}
              name="name"
              id="property-name"
              label="Property Name"
              type="text"
              placeholder="e.g Westlake Commons"
            />

            {/* Street Address */}
            <OutlinedTextField
              control={control}
              name="address"
              id="property-address"
              label="Street Address"
              type="text"
              placeholder="123 main st"
            />

            {/* City / State / Zip */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="city"
                  id="property-city"
                  label="City"
                  type="text"
                  placeholder="Austin"
                />
              </div>
              <div className="flex-1">
                <Controller
                  control={control}
                  name="state"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        State
                      </p>
                      <OutlinedSelect
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                        options={US_STATES.map(
                          (s): OutlinedSelectOption => ({ value: s, label: s }),
                        )}
                        placeholder="Select state"
                        error={fieldState.error?.message}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="zipCode"
                  id="property-zip"
                  label="Zip Code"
                  type="text"
                  placeholder="78701"
                  maxLength={10}
                />
              </div>
            </div>
          </div>

          {/* ── Property Specs Section ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Property Specs</p>

            {/* Property Type / Current Status */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <Controller
                  control={control}
                  name="propertyType"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        Property Type
                      </p>
                      <OutlinedSelect
                        value={field.value}
                        onValueChange={field.onChange}
                        options={PROPERTY_TYPES.map(
                          (t): OutlinedSelectOption => ({ value: t, label: t === 'Multi-Family' ? 'Multi Family' : t }),
                        )}
                        placeholder="Select type"
                        error={fieldState.error?.message}
                      />
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller
                  control={control}
                  name="currentStatus"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        Current Status
                      </p>
                      <OutlinedSelect
                        value={field.value ?? ''}
                        onValueChange={field.onChange}
                        options={PROPERTY_STATUSES.map(
                          (s): OutlinedSelectOption => ({ value: s, label: s }),
                        )}
                        placeholder="Select status"
                        error={fieldState.error?.message}
                      />
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Gross Sq.Ft / Units */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="grossSqFt"
                  id="property-gross-sqft"
                  label="Gross Sq.Ft"
                  type="number"
                  placeholder="20000"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="unitsDoors"
                  id="property-units"
                  label="Units / Doors"
                  type="number"
                  placeholder="1"
                />
              </div>
            </div>

            {/* Year Built / Lot Size */}
            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="yearBuilt"
                  id="property-year-built"
                  label="Year Built"
                  type="number"
                  placeholder="2005"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="lotSizeAcres"
                  id="property-lot-size"
                  label="Lot Size (Acres)"
                  type="number"
                  placeholder="0.5"
                />
              </div>
            </div>

            {/* Zoning */}
            <OutlinedTextField
              control={control}
              name="zoning"
              id="property-zoning"
              label="Zoning"
              type="text"
              placeholder="e.g R1, MF-4, C-2"
            />
          </div>

          {/* ── Financing & Income Snapshot ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Financing & Income Snapshot</p>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="estimatedValue"
                  id="property-estimated-value"
                  label="Estimated Value"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="loanBalance"
                  id="property-loan-balance"
                  label="Loan Balance"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="monthlyRent"
                  id="property-monthly-rent"
                  label="Monthly Rent"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="interestRate"
                  id="property-interest-rate"
                  label="Interest Rate"
                  type="number"
                  placeholder="6.5"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="monthlyPayment"
                  id="property-monthly-payment"
                  label="Monthly Payment"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="lender"
                  id="property-lender"
                  label="Lender"
                  type="text"
                  placeholder="First National Bank"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="maturityDate"
                  id="property-maturity"
                  label="Maturity Date"
                  type="date"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField
                  control={control}
                  name="ownershipPercentage"
                  id="property-ownership"
                  label="Ownership %"
                  type="number"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* ── Upload Property Photos ── */}
          <div className="flex flex-col gap-[12px]">
            <p className={`${canela} text-[20px] text-[#3E2D1D]`}>Property Photos</p>

            <div
              {...getRootProps()}
              className="bg-[#fffdf8] min-h-[120px] relative rounded-[12px] w-full hover:bg-[#faf7f0] transition-colors cursor-pointer"
            >
              <div
                aria-hidden="true"
                className={`absolute border-[1.5px] border-dashed inset-0 pointer-events-none rounded-[12px] ${
                  isDragActive ? 'border-[#764d2f]' : 'border-[#d0d0d0]'
                }`}
              />
              <div className="flex flex-col items-center justify-center gap-[10px] px-[24px] py-[18px] text-center">
                <input {...getInputProps()} />
                <UploadIcon />
                <span className={`${sfMed} text-[14px] text-[#3E2D1D]`} style={wdth}>
                  {isDragActive ? 'Drop photos here…' : 'Upload or drag in property photos'}
                </span>
                <span className={`${sfReg} text-[12px] text-[#8C8780]`} style={wdth}>
                  Up to 5 images. JPG, PNG, or WebP. First image will be used as the cover.
                </span>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-[12px] mt-[8px]">
                {imagePreviews.map((file, index) => (
                  <div
                    key={file.name}
                    className="relative rounded-[10px] overflow-hidden border border-[#D0D0D0] bg-[#FAFAF9]"
                  >
                    <img
                      src={file.preview as string}
                      alt={file.name}
                      className="h-[120px] w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-2 py-1 flex items-center justify-between gap-1">
                      <p className="text-[11px] text-white truncate">{file.name}</p>
                      {index === 0 ? (
                        <span className="text-[10px] text-white/90 bg-black/40 rounded-[999px] px-2 py-[1px]">
                          Cover
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Create Property Button ── */}
          <div className="flex justify-end pt-[8px]">
            <button
              type="submit"
              disabled={isSubmitting || createPropertyMutation.isPending}
              className="bg-[#764d2f] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[48px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer border-none hover:bg-[#5c3a22] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ fontWeight: 590, fontFamily: "'SF Pro', -apple-system, sans-serif", fontVariationSettings: "'wdth' 100" }}
            >
              <CheckIcon />
              <span className="text-[16px] text-white leading-[normal]">
                {createPropertyMutation.isPending || isSubmitting ? 'Creating Property…' : 'Create Property'}
              </span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* Subcomponents retained above for icons */