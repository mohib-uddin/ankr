import { useNavigate, useParams, Link } from 'react-router';
import { Check, X, Lightbulb } from 'lucide-react';

const INVOICE_DATA = {
  id: 'INV-2023-8842',
  vendor: 'Stirling & Sons Ltd.',
  vendorSubtitle: 'MASTER MASONRY & STONEWORK',
  status: 'Pending Review',
  issuedDate: 'Oct 24, 2025',
  dueDate: 'Nov 08, 2025',
  totalDue: '$31,471.20',
  subtotal: '$29,140.00',
  tax: '$2,331.20',
  taxRate: '8%',
  to: {
    name: 'The Heights Residential Project',
    address: ['4482 Skyline Drive', 'Portland, OR 97201'],
  },
  from: {
    name: 'Stirling & Sons Ltd.',
    address: ['88 Industrial Way', 'Beaverton, OR 97005'],
  },
  lineItems: [
    { desc: 'Hand-cut Limestone Cladding (Exterior)', qty: '450 sq ft', rate: '$42.00', amount: '$18,900.00' },
    { desc: 'Mortar Mix & Structural Reinforcement', qty: '12 units', rate: '$120.00', amount: '$1,440.00' },
    { desc: 'Labor: Specialized Masonry Team (4 days)', qty: '160 hrs', rate: '$55.00', amount: '$8,800.00' },
  ],
  details: {
    contractor: 'Stirling & Sons Ltd.',
    category: 'Exterior Masonry',
    property: 'The Heights Residential',
    projectCode: 'PRJ-HGT-09',
    invoiceNo: 'INV-2023-8842',
    issueDate: 'Oct 24, 2025',
    dueDate: 'Nov 08, 2025',
    poReference: 'PO-112',
    paymentTerms: 'Net 15',
  },
};

const sf = { fontFamily: "'SF Pro', -apple-system, sans-serif", fontVariationSettings: "'wdth' 100" } as const;

export function InvoiceDetailPage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams();

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] pb-[60px]">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-[16px]">
        <Link
          to="/dashboard/invoices"
          className="text-[14px] text-[#764D2F] hover:underline"
          style={{ ...sf, fontWeight: 510 }}
        >
          Invoices
        </Link>
        <span className="text-[14px] text-[#8C8780]" style={sf}>&gt;</span>
        <span className="text-[14px] text-[#3E2D1D]" style={{ ...sf, fontWeight: 510 }}>
          {INVOICE_DATA.id}
        </span>
      </div>

      {/* Title + Status */}
      <h1
        className="text-[28px] text-[#3E2D1D] mb-[8px]"
        style={{ fontFamily: "'Canela Text Trial', serif" }}
      >
        {INVOICE_DATA.vendor}
      </h1>
      <div className="inline-flex items-center gap-[6px] bg-[#FCF6F0] border border-[#D0D0D0] rounded-[100px] px-[14px] py-[6px] mb-[32px]">
        <div className="w-[8px] h-[8px] rounded-full bg-[#764D2F]" />
        <span className="text-[14px] text-[#3E2D1D]" style={{ ...sf, fontWeight: 510 }}>
          {INVOICE_DATA.status}
        </span>
      </div>

      {/* Content: Invoice + Sidebar */}
      <div className="flex flex-col xl:flex-row gap-[24px]">
        {/* Left: Invoice Document */}
        <div className="flex-1 flex flex-col gap-[24px]">
          {/* Invoice Preview card */}
          <div
            className="bg-[#F7EBE0] rounded-[16px] border border-[rgba(169,180,185,0.1)] p-[20px] sm:p-[33px]"
            style={{ boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.05)' }}
          >
            <div
              className="bg-white rounded-[12px] px-[18px] sm:px-[48px] pt-[28px] sm:pt-[48px] pb-[28px] sm:pb-[61px]"
              style={{ boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between border-b border-[#E1E9EE] pb-[22px] sm:pb-[33px] mb-[22px] sm:mb-[32px]">
                <div>
                  <h2
                    className="text-[20px] text-[#3E2D1D] mb-[4px]"
                    style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 700, letterSpacing: '0.2px' }}
                  >
                    STIRLING & SONS
                  </h2>
                  <p className="text-[12px] text-[#8C8780] uppercase tracking-[1.2px]" style={{ ...sf, fontWeight: 400 }}>
                    {INVOICE_DATA.vendorSubtitle}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className="text-[24px] text-[#764D2F]"
                    style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 800, letterSpacing: '-1.2px' }}
                  >
                    INVOICE
                  </p>
                  <p className="text-[12px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>
                    Issued: {INVOICE_DATA.issuedDate}
                  </p>
                </div>
              </div>

              {/* To / From */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[28px] sm:gap-[32px] mb-[22px] sm:mb-[32px]">
                <div>
                  <p className="text-[12px] text-[#8C8780] uppercase mb-[8px]" style={{ ...sf, fontWeight: 590 }}>TO:</p>
                  <p className="text-[14px] text-[#764D2F] mb-[2px]" style={{ ...sf, fontWeight: 590 }}>{INVOICE_DATA.to.name}</p>
                  {INVOICE_DATA.to.address.map((l, i) => (
                    <p key={i} className="text-[14px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{l}</p>
                  ))}
                </div>
                <div>
                  <p className="text-[12px] text-[#8C8780] uppercase mb-[8px]" style={{ ...sf, fontWeight: 590 }}>FROM:</p>
                  <p className="text-[14px] text-[#764D2F] mb-[2px]" style={{ ...sf, fontWeight: 590 }}>{INVOICE_DATA.from.name}</p>
                  {INVOICE_DATA.from.address.map((l, i) => (
                    <p key={i} className="text-[14px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{l}</p>
                  ))}
                </div>
              </div>

              {/* Line items table */}
              <div className="mb-[16px] sm:mb-[28px] overflow-x-auto">
                <div className="min-w-[560px]">
                  <div className="flex items-center border-b border-[#E1E9EE] pb-[12px]">
                    <div className="flex-1">
                      <span className="text-[12px] text-[#764D2F]" style={{ ...sf, fontWeight: 590 }}>Description</span>
                    </div>
                    <div className="w-[90px] text-right">
                      <span className="text-[12px] text-[#764D2F]" style={{ ...sf, fontWeight: 590 }}>Quantity</span>
                    </div>
                    <div className="w-[72px] text-right">
                      <span className="text-[12px] text-[#764D2F]" style={{ ...sf, fontWeight: 590 }}>Rate</span>
                    </div>
                    <div className="w-[88px] text-right">
                      <span className="text-[12px] text-[#764D2F]" style={{ ...sf, fontWeight: 590 }}>Amount</span>
                    </div>
                  </div>
                  {INVOICE_DATA.lineItems.map((item, i) => (
                    <div key={i} className="flex items-center border-b border-[rgba(225,233,238,0.3)] py-[16px]">
                      <div className="flex-1">
                        <span className="text-[12px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{item.desc}</span>
                      </div>
                      <div className="w-[90px] text-right">
                        <span className="text-[12px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{item.qty}</span>
                      </div>
                      <div className="w-[72px] text-right">
                        <span className="text-[12px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{item.rate}</span>
                      </div>
                      <div className="w-[88px] text-right">
                        <span className="text-[12px] text-[#8C8780]" style={{ ...sf, fontWeight: 510 }}>{item.amount}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end mb-[18px] sm:mb-[28px]">
                <div className="w-full sm:w-[264px] border-t border-[#E1E9EE] pt-[18px] sm:pt-[25px]">
                  <div className="flex items-center justify-between mb-[8px]">
                    <span className="text-[13px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>Subtotal</span>
                    <span className="text-[13px] text-[#764D2F]" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.subtotal}</span>
                  </div>
                  <div className="flex items-center justify-between mb-[8px]">
                    <span className="text-[13px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>Tax ({INVOICE_DATA.taxRate})</span>
                    <span className="text-[13px] text-[#764D2F]" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.tax}</span>
                  </div>
                  <div className="flex items-center justify-between pt-[8px]">
                    <span className="text-[18px] text-[#764D2F]" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>Total Due</span>
                    <span className="text-[18px] text-[#3E2D1D]" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 700 }}>{INVOICE_DATA.totalDue}</span>
                  </div>
                </div>
              </div>

              {/* Payment terms */}
              <p className="text-[10px] text-[#8C8780] border-t border-[#E1E9EE] pt-[14px] sm:pt-[17px]" style={{ ...sf, fontWeight: 400 }}>
                Payment terms: Net 15. Please make checks payable to Stirling & Sons Ltd.
              </p>
            </div>
          </div>

          {/* Budget Check */}
          <div
            className="bg-[#F5DECE] rounded-[16px] border border-[#764D2F] px-[20px] sm:px-[28px] py-[18px] sm:py-[28px] flex items-start gap-[16px]"
          >
            <div className="w-[37px] h-[42px] rounded-[4px] bg-[#F3EFE6] flex items-center justify-center shrink-0">
              <Lightbulb className="w-[18px] h-[18px] text-[#764D2F]" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[16px] text-[#3E2D1D] mb-[6px]" style={{ ...sf, fontWeight: 510 }}>
                Budget Check
              </p>
              <p className="text-[14px] text-[#764D2F]" style={{ ...sf, fontWeight: 510 }}>
                This invoice represents 12% of the remaining Exterior Masonry budget for Q4.
              </p>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="xl:w-[340px] flex flex-col gap-[24px]">
          {/* Amount Due card */}
          <div
            className="bg-[#3E2D1D] rounded-[20px] p-[28px]"
            style={{ boxShadow: '0px 10px 40px 0px rgba(62,45,29,0.3)' }}
          >
            <p className="text-[14px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>
              Amount Due
            </p>
            <p className="text-[36px] text-white mb-[4px]" style={{ ...sf, fontWeight: 700 }}>
              {INVOICE_DATA.totalDue}
            </p>
            <p className="text-[13px] text-[#D3B597] mb-[24px]" style={{ ...sf, fontWeight: 400 }}>
              Due by November 08, 2023
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-y-[16px] gap-x-[16px] mb-[28px]">
              <div>
                <p className="text-[12px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>Contractor</p>
                <p className="text-[14px] text-white" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.details.contractor}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>Category</p>
                <p className="text-[14px] text-white" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.details.category}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>Property</p>
                <p className="text-[14px] text-white" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.details.property}</p>
              </div>
              <div>
                <p className="text-[12px] text-[#D3B597] mb-[4px]" style={{ ...sf, fontWeight: 510 }}>Project Code</p>
                <p className="text-[14px] text-white" style={{ ...sf, fontWeight: 510 }}>{INVOICE_DATA.details.projectCode}</p>
              </div>
            </div>

            {/* Action buttons */}
            <button
              onClick={() => navigate('/dashboard/invoices/paid')}
              className="w-full h-[50px] rounded-[8px] bg-[#764D2F] text-white flex items-center justify-center gap-[8px] cursor-pointer hover:bg-[#5E3D25] transition-colors mb-[12px]"
              style={{ ...sf, fontWeight: 590 }}
            >
              <Check className="w-[18px] h-[18px]" />
              <span className="text-[16px]">Approve & Pay Invoice</span>
            </button>
            <button
              className="w-full h-[50px] rounded-[8px] border-[1.5px] border-white text-white flex items-center justify-center gap-[8px] cursor-pointer hover:bg-white/10 transition-colors"
              style={{ ...sf, fontWeight: 590 }}
            >
              <X className="w-[18px] h-[18px]" />
              <span className="text-[16px]">Reject Submission</span>
            </button>
          </div>

          {/* Invoice Details card */}
          <div
            className="bg-white rounded-[20px] border border-[#D0D0D0] p-[28px]"
            style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.25)' }}
          >
            <h3
              className="text-[20px] text-[#3E2D1D] mb-[24px]"
              style={{ fontFamily: "'Canela Text Trial', serif" }}
            >
              Invoice Details
            </h3>
            <div className="space-y-[20px]">
              {[
                ['Invoice No.', INVOICE_DATA.details.invoiceNo],
                ['Issue Date', INVOICE_DATA.details.issueDate],
                ['Due Date', INVOICE_DATA.details.dueDate],
                ['PO Reference', INVOICE_DATA.details.poReference],
                ['Payment Terms', INVOICE_DATA.details.paymentTerms],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between border-b border-[#F5F3EF] pb-[12px] last:border-0 last:pb-0">
                  <span className="text-[14px] text-[#8C8780]" style={{ ...sf, fontWeight: 400 }}>{label}</span>
                  <span className="text-[14px] text-[#3E2D1D]" style={{ ...sf, fontWeight: 590 }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
