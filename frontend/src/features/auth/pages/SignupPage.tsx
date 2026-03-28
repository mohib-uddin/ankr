import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router';
import { SignupSubmitChevronIcon } from '@/icons/signup';
import imgChatGptImageMar22026014513Am2 from '@/assets/d4e288c194e513c6042ea3d990c5b1165f94f4b0.png';
import { AuthSideCarousel } from '../components/AuthSideCarousel';
import { signupSchema, type SignupFormValues } from '../schemas/auth.schemas';
import { useSignupMutation } from '@/services/auth.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { getPostAuthRedirectPath } from '@/features/auth/utils/post-auth-redirect';
import type { ApiMessageData, AuthCredentialsPayload } from '@/features/auth/types/auth.types';

const inputClassName =
  "font-['Figtree',sans-serif] font-normal leading-[21px] text-[#333] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]";

const labelClassName =
  "font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full";

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const serverError =
    signupMutation.isError && signupMutation.error ? getApiErrorMessage(signupMutation.error) : '';

  const onSubmit = handleSubmit((values) => {
    signupMutation.reset();
    const { confirmPassword: _c, ...payload } = values;
    signupMutation.mutate(payload, {
      onSuccess: (res: ApiMessageData<AuthCredentialsPayload>) => {
        navigate(getPostAuthRedirectPath(res.data.user), { replace: true });
      },
    });
  });

  return (
    <div className="fixed inset-0 bg-[#fcf6f0] overflow-hidden [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative h-full w-full flex flex-col xl:flex-row">
        <AuthSideCarousel
          initialIndex={1}
          slides={[
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 58.707,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 58.707,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 58.707,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 58.707,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
          ]}
        />

        <div className="flex-1 h-full flex items-center justify-center px-[24px] py-[60px] xl:px-[clamp(24px,4vw,80px)] xl:py-[24px] xl:overflow-y-auto">
          <div className="w-full max-w-[590px]">
            <form onSubmit={onSubmit} className="flex flex-col gap-[36px] p-[24px] md:p-[40px] rounded-[16px]" noValidate>
              <div className="flex flex-col gap-[24px] w-full">
                <div className="flex flex-col items-center w-full">
                  <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic text-[#764d2f] text-[36px] md:text-[48px] w-full">
                    Create Your Account
                  </p>
                </div>
                <p
                  className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Create an account to start your loan application and manage your portfolio with ease.
                </p>
              </div>

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-[24px] w-full">
                <div className="flex flex-col sm:flex-row gap-[24px] w-full">
                  <div className="flex flex-col gap-[6px] flex-1 w-full sm:w-auto">
                    <label htmlFor="signup-first" className={labelClassName} style={{ fontVariationSettings: "'wdth' 100" }}>
                      First Name
                    </label>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <input
                        id="signup-first"
                        type="text"
                        autoComplete="given-name"
                        aria-invalid={Boolean(errors.firstName)}
                        placeholder="John"
                        className={inputClassName}
                        {...register('firstName')}
                      />
                      <div
                        aria-hidden="true"
                        className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                          errors.firstName ? 'border-red-300' : 'border-[#d0d0d0]'
                        }`}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="text-red-600 text-[13px]">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-[6px] flex-1 w-full sm:w-auto">
                    <label htmlFor="signup-last" className={labelClassName} style={{ fontVariationSettings: "'wdth' 100" }}>
                      Last Name
                    </label>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <input
                        id="signup-last"
                        type="text"
                        autoComplete="family-name"
                        aria-invalid={Boolean(errors.lastName)}
                        placeholder="Doe"
                        className={inputClassName}
                        {...register('lastName')}
                      />
                      <div
                        aria-hidden="true"
                        className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                          errors.lastName ? 'border-red-300' : 'border-[#d0d0d0]'
                        }`}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="text-red-600 text-[13px]">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-[6px] w-full">
                  <label htmlFor="signup-email" className={labelClassName} style={{ fontVariationSettings: "'wdth' 100" }}>
                    Email Address
                  </label>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      id="signup-email"
                      type="email"
                      autoComplete="email"
                      aria-invalid={Boolean(errors.email)}
                      placeholder="john@mail.com"
                      className={inputClassName}
                      {...register('email')}
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                        errors.email ? 'border-red-300' : 'border-[#d0d0d0]'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="text-red-600 text-[13px]">{errors.email.message}</p>}
                </div>

                <div className="flex flex-col gap-[6px] w-full">
                  <label htmlFor="signup-password" className={labelClassName} style={{ fontVariationSettings: "'wdth' 100" }}>
                    Password
                  </label>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      id="signup-password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.password)}
                      placeholder="*********"
                      className={inputClassName}
                      {...register('password')}
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                        errors.password ? 'border-red-300' : 'border-[#d0d0d0]'
                      }`}
                    />
                  </div>
                  {errors.password && (
                    <p className="text-red-600 text-[13px]">{errors.password.message}</p>
                  )}
                </div>

                <div className="flex flex-col gap-[6px] w-full">
                  <label htmlFor="signup-confirm" className={labelClassName} style={{ fontVariationSettings: "'wdth' 100" }}>
                    Confirm Password
                  </label>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      id="signup-confirm"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(errors.confirmPassword)}
                      placeholder="*********"
                      className={inputClassName}
                      {...register('confirmPassword')}
                    />
                    <div
                      aria-hidden="true"
                      className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                        errors.confirmPassword ? 'border-red-300' : 'border-[#d0d0d0]'
                      }`}
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-[13px]">{errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={signupMutation.isPending}
                className="bg-[#764d2f] h-[50px] rounded-[8px] w-full hover:bg-[#8c5d3a] hover:-translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="flex gap-[10px] items-center justify-center px-[48px] py-[10px] size-full">
                    <p
                      className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[16px] text-white whitespace-nowrap"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      {signupMutation.isPending ? 'Creating account…' : 'Sign Up'}
                    </p>
                    <SignupSubmitChevronIcon />
                  </div>
                </div>
              </button>

              <p
                className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full text-center"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="[text-decoration-skip-ink:none] decoration-solid font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline hover:text-[#8c5d3a]"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
