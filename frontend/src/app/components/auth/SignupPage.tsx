import { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router';
import { SignupSubmitChevronIcon } from '@/icons/signup';
import imgChatGptImageMar22026014513Am2 from "@/assets/d4e288c194e513c6042ea3d990c5b1165f94f4b0.png";
import { AuthSideCarousel } from './AuthSideCarousel';

export function SignupPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    // Mock registration - in real app would call API
    // For now, just redirect to dashboard
    navigate('/profile-setup');
  };

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

        {/* Right side - Form - Full width on mobile, flex on desktop */}
        <div className="flex-1 h-full flex items-center justify-center px-[24px] py-[60px] xl:px-[clamp(24px,4vw,80px)] xl:py-[24px] xl:overflow-y-auto">
          <div className="w-full max-w-[590px]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-[36px] p-[24px] md:p-[40px] rounded-[16px]">
              {/* Header */}
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

              {/* Error message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[8px] text-[14px]">
                  {error}
                </div>
              )}

              {/* Form fields */}
              <div className="flex flex-col gap-[24px] w-full">
                {/* First and Last Name row */}
                <div className="flex flex-col sm:flex-row gap-[24px] w-full">
                  {/* First Name */}
                  <div className="flex flex-col gap-[6px] flex-1 w-full sm:w-auto">
                    <p 
                      className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" 
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      First Name
                    </p>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]"
                      />
                      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div className="flex flex-col gap-[6px] flex-1 w-full sm:w-auto">
                    <p 
                      className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" 
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      Last Name
                    </p>
                    <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]"
                      />
                      <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                    </div>
                  </div>
                </div>

                {/* Email field */}
                <div className="flex flex-col gap-[6px] w-full">
                  <p 
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" 
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Email Address
                  </p>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@mail.com"
                      className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]"
                    />
                    <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </div>
                </div>

                {/* Password field */}
                <div className="flex flex-col gap-[6px] w-full">
                  <p 
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" 
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Password
                  </p>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="*********"
                      className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]"
                    />
                    <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="flex flex-col gap-[6px] w-full">
                  <p 
                    className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#333] text-[14px] w-full" 
                    style={{ fontVariationSettings: "'wdth' 100" }}
                  >
                    Confirm Password
                  </p>
                  <div className="bg-white h-[46px] relative rounded-[8px] w-full">
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="*********"
                      className="font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent w-full h-full px-[12px] py-[10px] rounded-[8px] border-none outline-none focus:outline-none placeholder:text-[#767676]"
                    />
                    <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px]" />
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="bg-[#764d2f] h-[50px] rounded-[8px] w-full hover:bg-[#8c5d3a] hover:-translate-y-[1px]"
              >
                <div className="flex flex-row items-center justify-center size-full">
                  <div className="flex gap-[10px] items-center justify-center px-[48px] py-[10px] size-full">
                    <p 
                      className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] text-[16px] text-white whitespace-nowrap" 
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      Sign Up
                    </p>
                    <SignupSubmitChevronIcon />
                  </div>
                </div>
              </button>

              {/* Sign in link */}
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