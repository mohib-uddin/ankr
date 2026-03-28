import svgPaths from '@/icons/dashboard-shared';

function FolderIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <g transform="translate(2.25,3.25)">
        <path clipRule="evenodd" d={svgPaths.p2ebf2a80} fill="#764D2F" fillRule="evenodd" />
      </g>
    </svg>
  );
}

export function DocumentsStub() {
  return (
    <div className="px-6 lg:px-[58px] py-[40px]">
      <p
        className="text-[36px] text-[#3E2D1D] mb-[4px]"
        style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
      >
        Document Vault
      </p>
      <p className="text-[16px] text-[#8C8780] mb-[36px]" style={{ fontWeight: 510 }}>
        Secure storage for all your financial documents.
      </p>

      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[60px] text-center">
        <div className="w-[60px] h-[60px] rounded-[12px] bg-[#F3EFE6] flex items-center justify-center mx-auto mb-[24px]">
          <FolderIcon />
        </div>
        <p
          className="text-[24px] text-[#3E2D1D] mb-[8px]"
          style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
        >
          Documents Coming Soon
        </p>
        <p className="text-[16px] text-[#8C8780] max-w-[420px] mx-auto mb-[32px]" style={{ fontWeight: 510 }}>
          Upload, organize, and securely share your identity, income, banking, and real estate documents with lenders.
        </p>
        <div className="flex items-center justify-center gap-[16px] flex-wrap">
          <div className="flex items-center gap-[8px] px-[24px] py-[12px] rounded-[8px] border border-[#D0D0D0] text-[16px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>
            Secure Upload
          </div>
          <div className="flex items-center gap-[8px] px-[24px] py-[12px] rounded-[8px] border border-[#D0D0D0] text-[16px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>
            Expiring Share Links
          </div>
        </div>
      </div>
    </div>
  );
}