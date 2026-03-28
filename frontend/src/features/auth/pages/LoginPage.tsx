import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link, useLocation, useSearchParams } from 'react-router';
import { LoginSubmitChevronIcon } from '@/icons/login';
import imgChatGptImageMar22026014513Am2 from '@/assets/cb102759979e1c974bdf9fdc0ff442d0dff9352a.png';
import { AuthSideCarousel } from '../components/AuthSideCarousel';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schemas';
import { useLoginMutation } from '@/services/auth.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { getPostAuthRedirectPath } from '@/features/auth/utils/post-auth-redirect';
import type { ApiMessageData, AuthCredentialsPayload } from '@/features/auth/types/auth.types';
import { OutlinedTextField } from '@/shared/components/form';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const loginMutation = useLoginMutation();

  const sessionExpired = searchParams.get('session') === 'expired';
  const passwordResetSuccess = searchParams.get('reset') === 'success';

  const { control, handleSubmit } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const serverError = loginMutation.isError && loginMutation.error ? getApiErrorMessage(loginMutation.error) : '';

  const onSubmit = handleSubmit((values) => {
    loginMutation.reset();
    loginMutation.mutate(values, {
      onSuccess: (res: ApiMessageData<AuthCredentialsPayload>) => {
        const from = (location.state as { from?: string } | null)?.from;
        navigate(getPostAuthRedirectPath(res.data.user, from ?? null), { replace: true });
      },
    });
  });

  return (
    <div className="fixed inset-0 bg-[#fcf6f0] overflow-hidden [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative h-full w-full flex flex-col xl:flex-row">
        <AuthSideCarousel
          initialIndex={0}
          slides={[
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 54.888,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 54.888,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 54.888,
              heading: "Track every property,\ndocument and draw request in one place.",
            },
            {
              image: imgChatGptImageMar22026014513Am2,
              overlayStop: 54.888,
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
                    Welcome Back
                  </p>
                </div>
                <p
                  className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  Sign in to continue your loan application or manage your portfolio.
                </p>
              </div>

              {sessionExpired && (
                <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-[8px] text-[14px]">
                  Your session expired. Please sign in again.
                </div>
              )}

              {passwordResetSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-[8px] text-[14px]">
                  Your password was updated. Sign in with your new password.
                </div>
              )}

              {serverError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
                  {serverError}
                </div>
              )}

              <div className="flex flex-col gap-[24px] w-full">
                <OutlinedTextField
                  control={control}
                  name="email"
                  id="login-email"
                  label="Email Address"
                  type="email"
                  autoComplete="email"
                  placeholder="john@mail.com"
                />
                <OutlinedTextField
                  control={control}
                  name="password"
                  id="login-password"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Password"
                />
                <div className="w-full flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="font-['Figtree',sans-serif] font-semibold text-[14px] text-[#764d2f] underline hover:text-[#8c5d3a] [text-decoration-skip-ink:none]"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="bg-[#764d2f] h-[50px] rounded-[8px] w-full hover:bg-[#8c5d3a] hover:-translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="flex gap-[10px] items-center justify-center px-[48px] py-[10px] size-full">
                    <p
                      className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[16px] text-white whitespace-nowrap"
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      {loginMutation.isPending ? 'Signing in…' : 'Sign In'}
                    </p>
                    <LoginSubmitChevronIcon />
                  </div>
                </div>
              </button>

              <p
                className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full text-center"
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="[text-decoration-skip-ink:none] decoration-solid font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline hover:text-[#8c5d3a]"
                >
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
