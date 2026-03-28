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
import { OutlinedTextField } from '@/shared/components/form';

export function SignupPage() {
  const navigate = useNavigate();
  const signupMutation = useSignupMutation();

  const { control, handleSubmit } = useForm<SignupFormValues>({
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
                  <div className="flex-1 w-full sm:w-auto">
                    <OutlinedTextField
                      control={control}
                      name="firstName"
                      id="signup-first"
                      label="First Name"
                      type="text"
                      autoComplete="given-name"
                      placeholder="John"
                    />
                  </div>
                  <div className="flex-1 w-full sm:w-auto">
                    <OutlinedTextField
                      control={control}
                      name="lastName"
                      id="signup-last"
                      label="Last Name"
                      type="text"
                      autoComplete="family-name"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <OutlinedTextField
                  control={control}
                  name="email"
                  id="signup-email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  placeholder="john@mail.com"
                />

                <OutlinedTextField
                  control={control}
                  name="password"
                  id="signup-password"
                  label="Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="*********"
                />

                <OutlinedTextField
                  control={control}
                  name="confirmPassword"
                  id="signup-confirm"
                  label="Confirm Password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="*********"
                />
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
