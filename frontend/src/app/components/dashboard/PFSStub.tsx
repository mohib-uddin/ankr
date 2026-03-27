import { useNavigate } from 'react-router';
import svgPaths from '../../../imports/svg-2jpk391bzg';

function DocumentIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <g transform="translate(4.25,2.25)">
        <path d={svgPaths.p21d23180} fill="#764D2F" />
        <path d={svgPaths.p919200 || ''} fill="#764D2F" />
        <path d={svgPaths.p33653100} fill="#764D2F" />
        <path clipRule="evenodd" d={svgPaths.p2f3a4040} fill="#764D2F" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function ChevronRightArrow() {
  return (
    <svg width="13" height="10" viewBox="0 0 9.53742 12.9993" fill="none" style={{ transform: 'rotate(90deg)' }}>
      <path d={svgPaths.pec28900} fill="white" />
    </svg>
  );
}

export function PFSStub() {
  const navigate = useNavigate();
  return (
    <div className="px-6 lg:px-[58px] py-[40px]">
      <p
        className="text-[36px] text-[#3E2D1D] mb-[4px]"
        style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
      >
        Personal Financial Statement
      </p>
      <p className="text-[16px] text-[#8C8780] mb-[36px]" style={{ fontWeight: 510 }}>
        Your standardized financial identity used across all deals.
      </p>

      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[60px] text-center">
        <div className="w-[60px] h-[60px] rounded-[12px] bg-[#F3EFE6] flex items-center justify-center mx-auto mb-[24px]">
          <DocumentIcon />
        </div>
        <p
          className="text-[24px] text-[#3E2D1D] mb-[8px]"
          style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
        >
          Your PFS is Active
        </p>
        <p className="text-[16px] text-[#8C8780] max-w-[420px] mx-auto mb-[32px]" style={{ fontWeight: 510 }}>
          Your financial profile was completed during onboarding. It's used across all deal applications and document packages.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="inline-flex items-center gap-[10px] h-[50px] px-[48px] py-[10px] bg-[#3E2D1D] text-white rounded-[8px] text-[16px] hover:bg-[#2C1F14] transition-colors cursor-pointer"
          style={{ fontWeight: 590 }}
        >
          Update PFS <ChevronRightArrow />
        </button>
      </div>
    </div>
  );
}