import { z } from 'zod';

/**
 * Zod schema for creating a property.
 * Mirrors backend `CreatePropertyDto` in `backend/src/properties/dto/create-property.dto.ts`.
 */
export const propertyFormSchema = z.object({
  name: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  // Backend enum: PropertyTypeEnum (Single Family, Multi-Family, Commercial)
  propertyType: z.enum(['Single Family', 'Multi-Family', 'Commercial'] as const),
  // Backend enum: PropertyStatusEnum (Acquisition, Open, Closed, Under Contract)
  currentStatus: z
    .enum(['Acquisition', 'Open', 'Closed', 'Under Contract'] as const)
    .optional(),

  grossSqFt: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  unitsDoors: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  yearBuilt: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z
      .number()
      .int()
      .min(1000, 'Enter a valid year')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .optional(),
  ),
  lotSizeAcres: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  zoning: z.string().optional(),

  // Required numeric snapshot fields
  estimatedValue: z.preprocess(
    (v) => Number(v),
    z.number({ invalid_type_error: 'Estimated value is required' }),
  ),
  loanBalance: z.preprocess(
    (v) => Number(v),
    z.number({ invalid_type_error: 'Loan balance is required' }),
  ),
  monthlyRent: z.preprocess(
    (v) => Number(v),
    z.number({ invalid_type_error: 'Monthly rent is required' }),
  ),

  interestRate: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  monthlyPayment: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
  lender: z.string().optional(),
  maturityDate: z.string().optional(),
  ownershipPercentage: z.preprocess(
    (v) => (v === '' || v == null ? undefined : Number(v)),
    z.number().optional(),
  ),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

