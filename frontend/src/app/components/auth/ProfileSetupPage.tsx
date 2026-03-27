import React from 'react';
import { useNavigate } from 'react-router';
import svgPaths from '../../../imports/svg-83mjixczgf';

export function ProfileSetupPage() {
  const navigate = useNavigate();

  const handleUploadPFS = () => {
    // TODO: Open file picker and handle PDF upload
    console.log('Upload PFS clicked');
  };

  const handleBuildProfile = () => {
    // Navigate to profile builder form
    navigate('/onboarding');
  };

  return (
    <div className="bg-[#fcf6f0] fixed inset-0 overflow-auto [&_button]:cursor-pointer [&_button]:transition-all [&_button]:duration-200">
      <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-[24px] py-[60px]">
        {/* Main content container */}
        <div className="w-full max-w-[844px] flex flex-col items-center gap-[64px]">
          {/* Header section */}
          <div className="w-full max-w-[442px] flex flex-col items-center gap-[64px] text-center">
            {/* ANKR logo */}
            <p
              className="leading-[71.822px] not-italic text-[#764d2f] font-[700] text-[48px] md:text-[72px] tracking-[2.88px] whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              ANKR
            </p>

            {/* Title and subtitle */}
            <div className="flex flex-col gap-[12px] items-start w-full">
              <div
                className="font-bold leading-[50px] not-italic text-[#764d2f] text-[48px] tracking-[0] text-center w-full"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                <p className="mb-0">Build Your</p>
                <p>Financial Profile</p>
              </div>
              <p 
                className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[14px] md:text-[16px] w-full" 
                style={{ fontVariationSettings: "'wdth' 100" }}
              >
                Add it once. Use it across every deal.
              </p>
            </div>
          </div>

          {/* Option cards - Stack on mobile, side-by-side on md+ */}
          <div className="w-full flex flex-col md:flex-row gap-[24px] items-stretch">
            {/* Upload PFS Card */}
            <button
              onClick={handleUploadPFS}
              className="bg-white relative rounded-[16px] flex-1 group hover:shadow-lg hover:-translate-y-[1px]"
            >
              <div className="flex flex-col gap-[10px] items-start p-[28px] relative rounded-[inherit]">
                <div className="flex flex-col gap-[16px] items-start justify-end w-full">
                  {/* Upload icon */}
                  <div className="h-[39.444px] w-[40px] shrink-0">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 39.4444">
                      <rect fill="#F3EFE6" height="39.4444" rx="4.44444" width="40" />
                      <path 
                        d={svgPaths.p1ae0a380} 
                        stroke="#8B7357" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                      />
                    </svg>
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-[8px] items-start leading-[normal] w-full">
                    <p className="font-['Canela_Text_Trial',sans-serif] font-medium not-italic text-[#764d2f] text-[20px] md:text-[24px] w-full text-left">
                      Upload Existing PFS
                    </p>
                    <p 
                      className="font-['SF_Pro',sans-serif] font-[510] text-[#8c8780] text-[14px] md:text-[16px] w-full text-left leading-[normal]" 
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      Upload a PDF and we'll parse and extract your data automatically
                    </p>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px] group-hover:border-[#d0d0d0] transition-colors" />
            </button>

            {/* Build Profile Card */}
            <button
              onClick={handleBuildProfile}
              className="bg-[#764d2f] relative rounded-[16px] flex-1 group hover:bg-[#8c5d3a] hover:shadow-lg hover:-translate-y-[1px]"
            >
              <div className="flex flex-col items-start p-[28px] relative rounded-[inherit]">
                <div className="flex flex-col gap-[16px] items-start justify-end w-full">
                  {/* Plus icon */}
                  <div className="size-[40px] shrink-0">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 40 40">
                      <rect fill="#3E2D1D" height="40" rx="5.19481" width="40" />
                      <path 
                        d={svgPaths.p14e33580} 
                        stroke="white" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeMiterlimit="10" 
                        strokeWidth="2.33766" 
                      />
                    </svg>
                  </div>

                  {/* Text content */}
                  <div className="flex flex-col gap-[8px] items-start leading-[normal] text-white w-full">
                    <p className="font-['Canela_Text_Trial',sans-serif] font-medium not-italic text-[20px] md:text-[24px] w-full text-left">
                      Build Profile in Minutes
                    </p>
                    <p 
                      className="font-['SF_Pro',sans-serif] font-[510] text-[14px] md:text-[16px] w-full text-left leading-[normal]" 
                      style={{ fontVariationSettings: "'wdth' 100" }}
                    >
                      Step-by-step guided financial profile builder. Takes about 10 minutes
                    </p>
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px]" />
            </button>
          </div>
        </div>

        {/* Security message at bottom */}
        <div className="absolute bottom-[24px] md:bottom-[36px] left-1/2 -translate-x-1/2 max-w-[90%] md:max-w-none">
          <div className="bg-white flex gap-[10px] items-center justify-center px-[20px] md:px-[24px] py-[10px] rounded-[100px] relative">
            <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[100px]" />
            
            {/* Dot icon */}
            <div className="size-[9px] shrink-0">
              <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9 9">
                <circle cx="4.5" cy="4.5" fill="#764D2F" r="4.5" />
              </svg>
            </div>
            
            <p 
              className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] text-[#8c8780] text-[12px] md:text-[14px] text-center" 
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              Your data is encrypted and stored securely. You can update it at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
