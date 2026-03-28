import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate, useNavigate } from 'react-router';
import { LoginSubmitChevronIcon } from '@/icons/login';
import imgChatGptImageMar22026014513Am2 from '@/assets/cb102759979e1c974bdf9fdc0ff442d0dff9352a.png';
import { AuthSideCarousel } from '../components/AuthSideCarousel';
import { OutlinedOtpField } from '@/shared/components/form';
import { useResendVerificationCodeMutation, useVerifyEmailMutation, useLogout } from '@/services/auth.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { getPostAuthRedirectPath } from '@/features/auth/utils/post-auth-redirect';
import { useSessionStore } from '@/store/session.store';

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

const RESEND_COOLDOWN_SEC = 60;

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain || !local) return email;
  const visible = local.slice(0, 1);
  return `${visible}***@${domain}`;
}

export function VerifyEmailPage() {
  const navigate = useNavigate();
  const user = useSessionStore((s) => s.user);
  const accessToken = useSessionStore((s) => s.accessToken);
  const logout = useLogout();

  const [otp, setOtp] = useState('');
  const otpRef = useRef('');
  const [fieldError, setFieldError] = useState('');
  const [resendSeconds, setResendSeconds] = useState(0);
  const verifyMutation = useVerifyEmailMutation();
  const resendMutation = useResendVerificationCodeMutation();

  const handleOtpChange = useCallback((value: string) => {
    otpRef.current = value;
    setOtp(value);
    if (fieldError) setFieldError('');
    verifyMutation.reset();
  }, [fieldError, verifyMutation]);

  useEffect(() => {
    if (resendSeconds <= 0) return;
    const t = window.setInterval(() => {
      setResendSeconds((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [resendSeconds]);

  const submitVerify = useCallback(
    (code: string) => {
      if (!user?.email || verifyMutation.isPending) return;
      const trimmed = code.trim();
      if (trimmed.length !== 5) return;

      verifyMutation.mutate(
        { email: user.email, code: trimmed },
        {
          onSuccess: () => {
            const updated = useSessionStore.getState().user;
            if (updated) navigate(getPostAuthRedirectPath(updated), { replace: true });
          },
          onError: (err) => {
            setFieldError(getApiErrorMessage(err));
            setOtp('');
            otpRef.current = '';
          },
        },
      );
    },
    [user, verifyMutation, navigate],
  );

  const handleComplete = useCallback(() => {
    submitVerify(otpRef.current);
  }, [submitVerify]);

  const handleResend = () => {
    if (!user?.email || resendMutation.isPending || resendSeconds > 0) return;
    resendMutation.reset();
    setFieldError('');
    resendMutation.mutate(
      { email: user.email },
      {
        onSuccess: () => setResendSeconds(RESEND_COOLDOWN_SEC),
        onError: (err) => setFieldError(getApiErrorMessage(err)),
      },
    );
  };

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (!user) {
    return null;
  }

  if (user.isVerified) {
    return <Navigate to={getPostAuthRedirectPath(user)} replace />;
  }

  return (
    <div className="fixed inset-0 overflow-hidden bg-[#fcf6f0] [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative flex h-full w-full flex-col xl:flex-row">
        <AuthSideCarousel initialIndex={0} slides={[...carouselSlides]} />

        <div className="flex h-full min-h-0 flex-1 flex-col xl:overflow-hidden">
          <header className="flex shrink-0 justify-end px-[24px] pt-5 pb-2 xl:px-[clamp(24px,4vw,80px)] xl:pt-6">
            <button
              type="button"
              onClick={() => {
                logout();
                navigate('/login', { replace: true });
              }}
              className="font-['SF_Pro',sans-serif] text-[14px] font-[510] text-[#767676] transition-colors hover:text-[#764d2f] active:text-[#5c3d25]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Log out
            </button>
          </header>

          <div className="flex flex-1 items-center justify-center overflow-y-auto px-[24px] pb-10 pt-2 xl:px-[clamp(24px,4vw,80px)] xl:pb-12 xl:pt-0">
            <div className="w-full max-w-[590px]">
              <div className="flex flex-col gap-[32px] rounded-[16px] p-[24px] md:gap-[36px] md:p-[40px]">
                <div className="flex w-full flex-col gap-[20px] md:gap-[24px]">
                  <div className="flex w-full flex-col items-center">
                    <p className="w-full font-['Canela_Text_Trial',sans-serif] text-[36px] font-medium not-italic leading-[50px] text-[#764d2f] md:text-[48px]">
                      Verify your email
                    </p>
                  </div>
                  <p
                    className="w-full font-['SF_Pro',sans-serif] text-[14px] font-[510] leading-[normal] text-[#8c8780] md:text-[16px]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Enter the 5-digit code we sent to{' '}
                    <span className="font-semibold text-[#333]">{maskEmail(user.email)}</span>. The code verifies
                    automatically when all digits are entered.
                  </p>
                </div>

                <div className="flex w-full flex-col gap-[14px]">
                  <OutlinedOtpField
                    id="verify-email-otp"
                    ariaLabel="Enter the 5-digit code from your email"
                    value={otp}
                    onChange={handleOtpChange}
                    onComplete={handleComplete}
                    disabled={verifyMutation.isPending}
                    error={fieldError}
                  />
                  <p
                    className="w-full font-['SF_Pro',sans-serif] text-[14px] font-[510] leading-[normal] text-[#8c8780]"
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Didn&apos;t get a code?{' '}
                    <button
                      type="button"
                      disabled={resendMutation.isPending || resendSeconds > 0}
                      onClick={handleResend}
                      className="font-['Figtree',sans-serif] font-semibold text-[#764d2f] underline decoration-solid underline-offset-2 [text-decoration-skip-ink:none] transition-colors hover:text-[#8c5d3a] disabled:cursor-not-allowed disabled:text-[#b0aba3] disabled:no-underline"
                    >
                      {resendMutation.isPending
                        ? 'Sending…'
                        : resendSeconds > 0
                          ? `Resend in ${resendSeconds}s`
                          : 'Resend'}
                    </button>
                  </p>
                </div>

                <button
                  type="button"
                  disabled={verifyMutation.isPending || otp.length !== 5}
                  onClick={() => submitVerify(otp)}
                  className="h-[50px] w-full rounded-[8px] bg-[#764d2f] hover:-translate-y-[1px] hover:bg-[#8c5d3a] disabled:pointer-events-none disabled:opacity-60"
                >
                  <div className="flex size-full flex-row items-center justify-center">
                    <div className="flex size-full items-center justify-center gap-[10px] px-[48px] py-[10px]">
                      <p
                        className="whitespace-nowrap font-['SF_Pro',sans-serif] text-[16px] font-[590] leading-[normal] text-white"
                        style={{ fontVariationSettings: "'wdth' 100" }}
                      >
                        {verifyMutation.isPending ? 'Verifying…' : 'Verify email'}
                      </p>
                      <LoginSubmitChevronIcon />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
