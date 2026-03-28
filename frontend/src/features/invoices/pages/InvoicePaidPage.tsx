import { useNavigate } from 'react-router';
import { Check, ArrowLeft } from 'lucide-react';
import svgPaths from '@/icons/invoice-paid';

const sf = { fontFamily: "'SF Pro', -apple-system, sans-serif", fontVariationSettings: "'wdth' 100" } as const;

export function InvoicePaidPage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-89px)] px-4 py-[40px]">
      <div className="w-full max-w-[626px]">
        <div className="bg-[#3E2D1D] rounded-[16px] overflow-hidden">
          <div className="flex flex-col items-center px-[36px] py-[64px]">
            {/* Check icon with rings */}
            <div className="relative w-[158.5px] h-[158.5px] mb-[24px]">
              {/* Outer ring */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[158.5px] h-[158.5px] rounded-full border-[1.361px] border-[#C4B29A] opacity-20" />
              {/* Middle ring */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[17.01px] w-[124.487px] h-[124.487px] rounded-full border-[1.361px] border-[#C4B29A] opacity-50" />
              {/* Inner circle with check */}
              <div className="absolute left-1/2 -translate-x-1/2 top-[31.97px] w-[94.556px] h-[94.556px]">
                <svg className="w-full h-full" viewBox="0 0 94.5558 94.5558" fill="none">
                  <rect fill="#764D2F" width="94.5558" height="94.5558" rx="47.2779" />
                  <path d={svgPaths.p355f5500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5.44206" />
                </svg>
              </div>
            </div>

            {/* Text */}
            <h2
              className="text-[28px] text-white text-center mb-[4px]"
              style={{ fontFamily: "'Canela Text Trial', serif" }}
            >
              Invoice Paid
            </h2>
            <p className="text-[16px] text-[#D3B597] text-center mb-[52px]" style={{ ...sf, fontWeight: 510 }}>
              Verify the transaction details for the architectural ledger.
            </p>

            {/* Amount box */}
            <div className="w-full bg-white/5 rounded-[8px] py-[32px] flex flex-col items-center mb-[52px]">
              <p className="text-[16px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>
                Total Amount
              </p>
              <p className="text-[48px] text-white leading-[50px]" style={{ ...sf, fontWeight: 510 }}>
                $14,850
              </p>
              <p className="text-[16px] text-[#D3B597] mt-[4px]" style={{ ...sf, fontWeight: 510 }}>
                Standard Net-30 Settlement
              </p>
            </div>

            {/* Details */}
            <div className="w-full space-y-[24px] mb-[52px]">
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#D3B597]" style={{ ...sf, fontWeight: 590 }}>Contractor</span>
                <span className="text-[16px] text-white" style={{ ...sf, fontWeight: 510 }}>Stirling & Sons Ltd.</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#D3B597]" style={{ ...sf, fontWeight: 590 }}>Project Reference</span>
                <span className="text-[16px] text-white" style={{ ...sf, fontWeight: 510 }}>#AL-9928-WEST</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#D3B597]" style={{ ...sf, fontWeight: 590 }}>Invoice Date</span>
                <span className="text-[16px] text-white" style={{ ...sf, fontWeight: 510 }}>Oct 24, 2025</span>
              </div>
            </div>

            {/* Return button */}
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full h-[50px] rounded-[8px] border-[1.5px] border-white text-white flex items-center justify-center gap-[10px] cursor-pointer hover:bg-white/10 transition-colors"
              style={{ ...sf, fontWeight: 590 }}
            >
              <ArrowLeft className="w-[16px] h-[16px]" />
              <span className="text-[16px]">Return To Dashboard</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
