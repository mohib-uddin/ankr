import { useEffect, type CSSProperties } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { PropertyType } from '@/app/context/AppContext';
import svgPaths from '@/icons/dashboard-shared';
import figmaSvg from '@/icons/add-property';
import { OutlinedTextField } from '@/shared/components/form';
import { OutlinedSelect, type OutlinedSelectOption } from '@/shared/components/form/OutlinedSelect';
import { usePropertyQuery, useUpdatePropertyMutation } from '@/services/properties.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { propertyFormSchema, type PropertyFormValues } from '@/features/properties/schemas/property.schemas';

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

function BreadcrumbChevron() {
  return (
    <div className="flex items-center justify-center size-[24px]" style={{ transform: 'rotate(90deg)' }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d={svgPaths.p7e66880} fill="#8C8780" />
      </svg>
    </div>
  );
}

function DropdownChevron() {
  return (
    <div className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ transform: 'translateY(-50%) rotate(180deg)' }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path clipRule="evenodd" d={figmaSvg.p22c4cb00} fill="#767676" fillRule="evenodd" />
      </svg>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
      <path d={figmaSvg.p3981cc70} fill="white" />
    </svg>
  );
}

export function EditPropertyPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const propertyQuery = usePropertyQuery(id);
  const updateMutation = useUpdatePropertyMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
  });

  useEffect(() => {
    if (propertyQuery.data?.data) {
      const p = propertyQuery.data.data;
      const defaults: PropertyFormValues = {
        name: p.name ?? '',
        address: p.address,
        city: p.city ?? '',
        state: p.state ?? 'TX',
        zipCode: p.zipCode ?? '',
        propertyType: p.propertyType,
        currentStatus: p.currentStatus ?? 'Acquisition',
        grossSqFt: p.grossSqFt ?? undefined,
        unitsDoors: p.unitsDoors ?? undefined,
        yearBuilt: p.yearBuilt ?? undefined,
        lotSizeAcres: p.lotSizeAcres != null ? Number(p.lotSizeAcres) : undefined,
        zoning: p.zoning ?? '',
        estimatedValue: Number(p.estimatedValue ?? 0),
        loanBalance: Number(p.loanBalance ?? 0),
        monthlyRent: Number(p.monthlyRent ?? 0),
        interestRate: p.interestRate != null ? Number(p.interestRate) : undefined,
        monthlyPayment: p.monthlyPayment != null ? Number(p.monthlyPayment) : undefined,
        lender: p.lender ?? '',
        maturityDate: p.maturityDate ?? '',
        ownershipPercentage: p.ownershipPercentage ?? 100,
      };
      reset(defaults);
    }
  }, [propertyQuery.data, reset]);

  const serverError =
    (propertyQuery.isError && propertyQuery.error) || (updateMutation.isError && updateMutation.error)
      ? getApiErrorMessage((updateMutation.error ?? propertyQuery.error) as unknown)
      : '';

  const onSubmit = handleSubmit((values) => {
    if (!id) return;
    const payload = {
      name: values.name || undefined,
      address: values.address,
      city: values.city || undefined,
      state: values.state || undefined,
      zipCode: values.zipCode || undefined,
      propertyType: values.propertyType,
      currentStatus: values.currentStatus || undefined,
      grossSqFt: values.grossSqFt,
      unitsDoors: values.unitsDoors,
      yearBuilt: values.yearBuilt,
      lotSizeAcres: values.lotSizeAcres,
      zoning: values.zoning || undefined,
      estimatedValue: values.estimatedValue,
      loanBalance: values.loanBalance,
      monthlyRent: values.monthlyRent,
      interestRate: values.interestRate,
      monthlyPayment: values.monthlyPayment,
      lender: values.lender || undefined,
      maturityDate: values.maturityDate || undefined,
      ownershipPercentage: values.ownershipPercentage,
    };

    updateMutation.mutate(
      { id, payload },
      {
        onSuccess: () => {
          navigate(`/dashboard/properties/${id}`);
        },
      },
    );
  });

  if (propertyQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className={`${sfMed} text-[#8C8780]`} style={wdth}>
          Loading property…
        </p>
      </div>
    );
  }

  if (propertyQuery.isError || !propertyQuery.data?.data) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-3">
        <p className={`${sfMed} text-[#8C8780]`} style={wdth}>
          Unable to load property.
        </p>
        <button
          onClick={() => navigate('/dashboard/properties')}
          className="text-[#764D2F] text-[14px] cursor-pointer"
        >
          ← Back to Properties
        </button>
      </div>
    );
  }

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
          <button
            onClick={() => navigate(`/dashboard/properties/${id}`)}
            className="text-[#8C8780] text-[16px] cursor-pointer hover:text-[#3E2D1D] transition-colors"
            style={{ fontWeight: 510 }}
          >
            Detail
          </button>
          <BreadcrumbChevron />
          <span className="text-[#764D2F] text-[16px]" style={{ fontWeight: 510 }}>
            Edit Property
          </span>
        </div>

        {/* Page Heading */}
        <div>
          <p className={`${canela} text-[28px] text-[#3E2D1D] mb-[8px]`}>Edit Property</p>
          <p className={`${sfMed} text-[16px] text-[#764D2F]`} style={wdth}>
            Update your property profile details.
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

            <OutlinedTextField<PropertyFormValues>
              control={control}
              name="name"
              id="edit-property-name"
              label="Property Name"
              type="text"
              placeholder="e.g Westlake Commons"
            />

            <OutlinedTextField<PropertyFormValues>
              control={control}
              name="address"
              id="edit-property-address"
              label="Street Address *"
              type="text"
              placeholder="123 main st"
            />

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="city"
                  id="edit-property-city"
                  label="City"
                  type="text"
                  placeholder="Austin"
                />
              </div>
              <div className="flex-1">
                <Controller<PropertyFormValues>
                  control={control}
                  name="state"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        State
                      </p>
                      <div className="relative">
                        <OutlinedSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={US_STATES.map(
                            (st): OutlinedSelectOption => ({ value: st, label: st }),
                          )}
                          placeholder="Select state"
                          error={fieldState.error?.message}
                        />
                        <DropdownChevron />
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="zipCode"
                  id="edit-property-zip"
                  label="ZIP Code"
                  type="text"
                  placeholder="78701"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <Controller<PropertyFormValues>
                  control={control}
                  name="propertyType"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        Property Type *
                      </p>
                      <div className="relative">
                        <OutlinedSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={PROPERTY_TYPES.map(
                            (t): OutlinedSelectOption => ({
                              value: t,
                              label: t === 'Multi-Family' ? 'Multi Family' : t,
                            }),
                          )}
                          placeholder="Select type"
                          error={fieldState.error?.message}
                        />
                        <DropdownChevron />
                      </div>
                    </div>
                  )}
                />
              </div>
              <div className="flex-1">
                <Controller<PropertyFormValues>
                  control={control}
                  name="currentStatus"
                  render={({ field, fieldState }) => (
                    <div className="flex flex-col gap-[6px]">
                      <p className={`${sfReg} text-[#333] text-[14px]`} style={wdth}>
                        Current Status
                      </p>
                      <div className="relative">
                        <OutlinedSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          options={PROPERTY_STATUSES.map(
                            (s): OutlinedSelectOption => ({ value: s, label: s }),
                          )}
                          placeholder="Select status"
                          error={fieldState.error?.message}
                        />
                        <DropdownChevron />
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>
          </div>

          {/* ── Snapshot Metrics & Financing ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Snapshot & Financing</p>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="estimatedValue"
                  id="edit-property-estimated-value"
                  label="Estimated Value *"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="loanBalance"
                  id="edit-property-loan-balance"
                  label="Loan Balance *"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="monthlyRent"
                  id="edit-property-monthly-rent"
                  label="Monthly Rent *"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="interestRate"
                  id="edit-property-interest-rate"
                  label="Interest Rate (%)"
                  type="number"
                  placeholder="e.g 6.5"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="monthlyPayment"
                  id="edit-property-monthly-payment"
                  label="Monthly Payment"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="lender"
                  id="edit-property-lender"
                  label="Lender"
                  type="text"
                  placeholder="Lender name"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="maturityDate"
                  id="edit-property-maturity-date"
                  label="Maturity Date"
                  type="date"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="ownershipPercentage"
                  id="edit-property-ownership"
                  label="Ownership (%)"
                  type="number"
                  placeholder="100"
                />
              </div>
            </div>
          </div>

          {/* ── Physical Details ── */}
          <div className="flex flex-col gap-[24px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Physical Details</p>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="grossSqFt"
                  id="edit-property-gross-sqft"
                  label="Gross Sq.Ft"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="unitsDoors"
                  id="edit-property-units"
                  label="Units / Doors"
                  type="number"
                  placeholder="0"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="yearBuilt"
                  id="edit-property-year-built"
                  label="Year Built"
                  type="number"
                  placeholder="2005"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[24px]">
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="lotSizeAcres"
                  id="edit-property-lot-size"
                  label="Lot Size (acres)"
                  type="number"
                  placeholder="0.5"
                />
              </div>
              <div className="flex-1">
                <OutlinedTextField<PropertyFormValues>
                  control={control}
                  name="zoning"
                  id="edit-property-zoning"
                  label="Zoning"
                  type="text"
                  placeholder="R1, MF-4, C-2"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row justify-end gap-[12px] mt-[8px]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-[44px] px-[20px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] bg-white hover:bg-[#F5F0E9] transition-colors cursor-pointer"
              style={{ fontWeight: 510 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || updateMutation.isPending}
              className="inline-flex items-center justify-center gap-[8px] h-[44px] px-[24px] rounded-[8px] bg-[#3E2D1D] text-white text-[14px] hover:bg-[#2C1F14] disabled:opacity-60 disabled:cursor-not-allowed transition-colors cursor-pointer"
              style={{ fontWeight: 590 }}
            >
              <CheckIcon />
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

