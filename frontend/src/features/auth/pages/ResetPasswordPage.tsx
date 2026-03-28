import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { LoginSubmitChevronIcon } from '@/icons/login';
import imgChatGptImageMar22026014513Am2 from '@/assets/cb102759979e1c974bdf9fdc0ff442d0dff9352a.png';
import { AuthSideCarousel } from '../components/AuthSideCarousel';
import {
  forgotNewPasswordSchema,
  forgotVerifyCodeSchema,
  PASSWORD_POLICY_MESSAGE,
  type ForgotNewPasswordFormValues,
  type ForgotVerifyCodeFormValues,
} from '../schemas/auth.schemas';
import { useForgotPasswordChangeMutation, useValidateForgotPasswordCodeMutation } from '@/services/auth.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { OutlinedTextField } from '@/shared/components/form';

const carouselSlides = [
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
] as const;

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);

  const verifyMutation = useValidateForgotPasswordCodeMutation();
  const changeMutation = useForgotPasswordChangeMutation();

  const verifyForm = useForm<ForgotVerifyCodeFormValues>({
    resolver: zodResolver(forgotVerifyCodeSchema),
    defaultValues: { email: '', code: '' },
  });

  const passwordForm = useForm<ForgotNewPasswordFormValues>({
    resolver: zodResolver(forgotNewPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const { setValue: setVerifyEmail } = verifyForm;

  useEffect(() => {
    const fromQuery = searchParams.get('email')?.trim() ?? '';
    const fromState = (location.state as { email?: string } | null)?.email?.trim() ?? '';
    const email = fromQuery || fromState;
    if (email) setVerifyEmail('email', email);
  }, [searchParams, location.state, setVerifyEmail]);

  const verifyError =
    verifyMutation.isError && verifyMutation.error ? getApiErrorMessage(verifyMutation.error) : '';
  const changeError =
    changeMutation.isError && changeMutation.error ? getApiErrorMessage(changeMutation.error) : '';

  const onVerifySubmit = verifyForm.handleSubmit((values) => {
    verifyMutation.reset();
    verifyMutation.mutate(
      { email: values.email.trim(), code: values.code.trim() },
      {
        onSuccess: () => {
          setVerifiedEmail(values.email.trim());
        },
      },
    );
  });

  const onPasswordSubmit = passwordForm.handleSubmit((values) => {
    if (!verifiedEmail) return;
    changeMutation.reset();
    changeMutation.mutate(
      {
        email: verifiedEmail,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword,
      },
      {
        onSuccess: () => {
          navigate('/login?reset=success', { replace: true });
        },
      },
    );
  });

  const phasePassword = verifiedEmail != null;

  return (
    <div className="fixed inset-0 bg-[#fcf6f0] overflow-hidden [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative h-full w-full flex flex-col xl:flex-row">
        <AuthSideCarousel initialIndex={0} slides={[...carouselSlides]} />

        <div className="flex-1 h-full flex items-center justify-center px-[24px] py-[60px] xl:px-[clamp(24px,4vw,80px)] xl:py-[24px] xl:overflow-y-auto">
          <div className="w-full max-w-[590px]">
            {!phasePassword ? (
              <form
                onSubmit={onVerifySubmit}
                className="flex flex-col gap-[36px] p-[24px] md:p-[40px] rounded-[16px]"
                noValidate
              >
                <div className="flex flex-col gap-[24px] w-full">
                  <div className="flex flex-col items-center w-full">
                    <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic text-[#764d2f] text-[36px] md:text-[48px] w-full">
                      Reset Password
                    </p>
                  </div>
                  <p
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Enter the email you used and the 5-digit code from your message.
                  </p>
                </div>

                {verifyError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
                    {verifyError}
                  </div>
                )}

                <div className="flex flex-col gap-[24px] w-full">
                  <OutlinedTextField
                    control={verifyForm.control}
                    name="email"
                    id="reset-email"
                    label="Email Address"
                    type="email"
                    autoComplete="email"
                    placeholder="john@mail.com"
                  />
                  <OutlinedTextField
                    control={verifyForm.control}
                    name="code"
                    id="reset-code"
                    label="Verification code"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="12345"
                    maxLength={5}
                  />
                </div>

                <button
                  type="submit"
                  disabled={verifyMutation.isPending}
                  className="bg-[#764d2f] h-[50px] rounded-[8px] w-full hover:bg-[#8c5d3a] hover:-translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none"
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="flex gap-[10px] items-center justify-center px-[48px] py-[10px] size-full">
                      <p
                        className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[16px] text-white whitespace-nowrap"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                      >
                        {verifyMutation.isPending ? 'Verifying…' : 'Continue'}
                      </p>
                      <LoginSubmitChevronIcon />
                    </div>
                  </div>
                </button>

                <p
                  className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full text-center"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  <Link
                    to="/forgot-password"
                    className="[text-decoration-skip-ink:none] decoration-solid font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline hover:text-[#8c5d3a]"
                  >
                    Resend code
                  </Link>
                  {' · '}
                  <Link
                    to="/login"
                    className="[text-decoration-skip-ink:none] decoration-solid font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline hover:text-[#8c5d3a]"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            ) : (
              <form
                onSubmit={onPasswordSubmit}
                className="flex flex-col gap-[36px] p-[24px] md:p-[40px] rounded-[16px]"
                noValidate
              >
                <div className="flex flex-col gap-[24px] w-full">
                  <div className="flex flex-col items-center w-full">
                    <p className="font-['Canela_Text_Trial',sans-serif] font-medium leading-[50px] not-italic text-[#764d2f] text-[36px] md:text-[48px] w-full">
                      New password
                    </p>
                  </div>
                  <p
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Code verified for{' '}
                    <span className="font-['Figtree',sans-serif] font-semibold text-[#333]">{verifiedEmail}</span>. Choose
                    your new password.
                  </p>
                </div>

                {changeError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
                    {changeError}
                    <span className="block mt-2 text-[13px]">
                      If this keeps failing, request a new code from Forgot password.
                    </span>
                  </div>
                )}

                <div className="flex flex-col gap-[24px] w-full">
                  <OutlinedTextField
                    control={passwordForm.control}
                    name="newPassword"
                    id="reset-new-password"
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="*********"
                    footer={
                      <p className="font-['Figtree',sans-serif] text-[#8c8780] text-[12px] leading-[normal] w-full">
                        {PASSWORD_POLICY_MESSAGE}
                      </p>
                    }
                  />
                  <OutlinedTextField
                    control={passwordForm.control}
                    name="confirmPassword"
                    id="reset-confirm-password"
                    label="Confirm new password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="*********"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changeMutation.isPending}
                  className="bg-[#764d2f] h-[50px] rounded-[8px] w-full hover:bg-[#8c5d3a] hover:-translate-y-[1px] disabled:opacity-60 disabled:pointer-events-none"
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="flex gap-[10px] items-center justify-center px-[48px] py-[10px] size-full">
                      <p
                        className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[16px] text-white whitespace-nowrap"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                      >
                        {changeMutation.isPending ? 'Updating…' : 'Update password'}
                      </p>
                      <LoginSubmitChevronIcon />
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setVerifiedEmail(null);
                    verifyMutation.reset();
                    passwordForm.reset();
                  }}
                  className="font-['Figtree',sans-serif] font-semibold text-[14px] text-[#764d2f] underline hover:text-[#8c5d3a] [text-decoration-skip-ink:none] text-center w-full"
                >
                  Use a different email or code
                </button>

                <p
                  className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full text-center"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  <Link
                    to="/login"
                    className="[text-decoration-skip-ink:none] decoration-solid font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline hover:text-[#8c5d3a]"
                  >
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
