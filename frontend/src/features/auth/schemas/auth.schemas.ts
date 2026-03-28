import { z } from 'zod';

/** Matches backend `RegexConstants.PASSWORD` in `backend/src/common/constants/regex.constants.ts`. */
export const PASSWORD_REGEX =
  /^(?=.*[A-Z])(?=.*\d)(?=.*[.,@$!%*?&])[A-Za-z\d@$!%*?&.,]{8,30}$/;

export const PASSWORD_POLICY_MESSAGE =
  'Use 8–30 characters with at least one uppercase letter, one number, and one special character (.,@$!%*?&).';

export const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
    password: z.string().regex(PASSWORD_REGEX, PASSWORD_POLICY_MESSAGE),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
