import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, Plus, ChevronDown, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const INVOICES = [
  { id: 1, name: 'Structural Framing -Phase 1', code: 'INV-2024-001', contractor: 'Elite Carpentry Ltd', property: 'The Obsidian Heights', amount: '$24,500', status: 'Paid' },
  { id: 2, name: 'HVAC Installation', code: 'INV-2024-002', contractor: 'Arctic Flow Systems', property: 'South Shore Pavilion', amount: '$12,840', status: 'Pending' },
  { id: 3, name: 'Marble Flooring - Lobby', code: 'INV-2024-003', contractor: 'Carrara Masters', property: 'The Obsidian Heights', amount: '$45,000', status: 'Rejected' },
  { id: 4, name: 'Lighting Fixtures', code: 'INV-2024-004', contractor: 'Lumina Studio', property: 'North Wing Extension', amount: '$8,200', status: 'Paid' },
];

function StatusBadge({ status }: { status: string }) {
  return (
    <div className="bg-[#FCF6F0] rounded-[100px] px-[16px] py-[4px] inline-flex items-center justify-center">
      <span
        className="text-[#3E2D1D] text-[14px] whitespace-nowrap"
        style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
      >
        {status}
      </span>
    </div>
  );
}

function EyeIcon() {
  return (
    <div className="bg-white rounded-[6px] border border-[#D0D0D0] p-[6px] flex items-center justify-center cursor-pointer hover:bg-[#f5f5f5] transition-colors">
      <Eye className="w-[18px] h-[18px] text-[#764D2F]" strokeWidth={1.5} />
    </div>
  );
}

function NewInvoiceModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[16px] w-full max-w-[680px] p-[36px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-[28px]">
              <h2
                className="text-[24px] text-[#3E2D1D]"
                style={{ fontFamily: "'Canela Text Trial', serif" }}
              >
                New Invoice Entry
              </h2>
              <button onClick={onClose} className="text-[#8C8780] hover:text-[#3E2D1D] cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Upload area */}
            <div className="border-[1.5px] border-dashed border-[#D0D0D0] rounded-[12px] py-[40px] flex flex-col items-center justify-center mb-[24px]">
              <Upload className="w-[28px] h-[28px] text-[#8C8780] mb-[12px]" />
              <p
                className="text-[14px] text-[#3E2D1D] mb-[4px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}
              >
                Drag & drop your file here
              </p>
              <p
                className="text-[12px] text-[#8C8780]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
              >
                or click to browse | PDF, XLSX, DOCX, PNG, JPG, CSV
              </p>
            </div>

            {/* Fields */}
            <div className="space-y-[20px] mb-[28px]">
              <div>
                <label
                  className="block text-[14px] text-[#333] mb-[6px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
                >
                  Contractor Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sterling Masonry Ltd."
                  className="w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] text-[14px] text-[#333] placeholder-[#767676] outline-none focus:border-[#764D2F]"
                  style={{ fontFamily: "'Figtree', sans-serif" }}
                />
              </div>
              <div>
                <label
                  className="block text-[14px] text-[#333] mb-[6px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
                >
                  Property
                </label>
                <div className="relative">
                  <select
                    className="w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] text-[14px] text-[#333] outline-none appearance-none cursor-pointer focus:border-[#764D2F]"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                    defaultValue="obsidian"
                  >
                    <option value="obsidian">Obsidian Villa</option>
                    <option value="heights">The Obsidian Heights</option>
                    <option value="pavilion">South Shore Pavilion</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676] pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  className="block text-[14px] text-[#333] mb-[6px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
                >
                  Budget Category
                </label>
                <div className="relative">
                  <select
                    className="w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] text-[14px] text-[#333] outline-none appearance-none cursor-pointer focus:border-[#764D2F]"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                    defaultValue="steel"
                  >
                    <option value="steel">Structural Steel</option>
                    <option value="masonry">Exterior Masonry</option>
                    <option value="electrical">Electrical</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676] pointer-events-none" />
                </div>
              </div>
              <div>
                <label
                  className="block text-[14px] text-[#333] mb-[6px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
                >
                  Amount (USD)
                </label>
                <div className="relative">
                  <span
                    className="absolute left-[12px] top-1/2 -translate-y-1/2 text-[14px] text-[#767676]"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    $
                  </span>
                  <input
                    type="text"
                    defaultValue="50,000"
                    className="w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] pl-[28px] pr-[12px] text-[14px] text-[#333] outline-none focus:border-[#764D2F]"
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  />
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-[12px]">
              <button
                onClick={onClose}
                className="h-[46px] px-[32px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}
              >
                Cancel
              </button>
              <button
                className="h-[46px] px-[32px] rounded-[8px] bg-[#764D2F] text-white text-[14px] cursor-pointer hover:bg-[#5E3D25] transition-colors"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}
              >
                Create Invoice
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function InvoicesPage() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] pb-[40px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-[36px]">
        <div>
          <h1
            className="text-[28px] text-[#3E2D1D] mb-[8px]"
            style={{ fontFamily: "'Canela Text Trial', serif" }}
          >
            Invoices
          </h1>
          <p
            className="text-[16px] text-[#764D2F]"
            style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
          >
            Manage your architectural payment flow with clinical precision and total transparency.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-[10px] h-[50px] px-[48px] rounded-[8px] border-[1.5px] border-[#3E2D1D] text-[#3E2D1D] cursor-pointer hover:bg-[#3E2D1D] hover:text-white transition-colors shrink-0"
          style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590, fontVariationSettings: "'wdth' 100" }}
        >
          <Plus className="w-[15.5px] h-[15.5px]" />
          <span className="text-[16px]">Add Invoice</span>
        </button>
      </div>

      {/* Filter */}
      <div className="mb-[24px]">
        <p
          className="text-[14px] text-[#333] mb-[6px]"
          style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400, fontVariationSettings: "'wdth' 100" }}
        >
          Filter By Property
        </p>
        <div className="relative w-full max-w-[355px]">
          <select
            className="w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] text-[14px] text-[#767676] outline-none appearance-none cursor-pointer"
            style={{ fontFamily: "'Figtree', sans-serif" }}
          >
            <option>Select Property</option>
            <option>The Obsidian Heights</option>
            <option>South Shore Pavilion</option>
            <option>North Wing Extension</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#767676] pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden mb-[24px]"
        style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.45)' }}
      >
        {/* Table header */}
        <div className="bg-[#FAFAF9] border-b border-[#D0D0D0]">
          <div className="flex items-center gap-[62px] px-[30px] py-[12px] overflow-x-auto">
            <div className="shrink-0 w-[48px]">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                #
              </span>
            </div>
            <div className="shrink-0 w-[206px]">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                Invoice Name
              </span>
            </div>
            <div className="shrink-0 w-[140px]">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                Contractor
              </span>
            </div>
            <div className="shrink-0 w-[141px]">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                Property
              </span>
            </div>
            <div className="shrink-0 w-[100px] text-right">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                Amount
              </span>
            </div>
            <div className="shrink-0 w-[96px] text-center">
              <span
                className="text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]"
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
              >
                Status
              </span>
            </div>
            <div className="shrink-0 w-[30px]" />
          </div>
        </div>

        {/* Table rows */}
        {INVOICES.map((inv) => (
          <div key={inv.id} className="border-b border-[#F5F3EF] last:border-b-0">
            <div className="flex items-center gap-[62px] px-[30px] py-[14px] overflow-x-auto">
              <div className="shrink-0 w-[48px]">
                <span
                  className="text-[14px] text-[#8C8780] tracking-[-0.1504px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  #{inv.id}
                </span>
              </div>
              <div className="shrink-0 w-[206px]">
                <p
                  className="text-[14px] text-[#3E2D1D] tracking-[-0.1504px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
                >
                  {inv.name}
                </p>
                <p
                  className="text-[12px] text-[#8C8780] mt-[2px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {inv.code}
                </p>
              </div>
              <div className="shrink-0 w-[140px]">
                <span
                  className="text-[14px] text-[#8C8780] tracking-[-0.1504px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {inv.contractor}
                </span>
              </div>
              <div className="shrink-0 w-[141px]">
                <span
                  className="text-[14px] text-[#8C8780] tracking-[-0.1504px]"
                  style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                >
                  {inv.property}
                </span>
              </div>
              <div className="shrink-0 w-[100px] text-right">
                <span
                  className="text-[14px] text-[#3E2D1D] tracking-[-0.1504px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 700, fontVariationSettings: "'wdth' 100" }}
                >
                  {inv.amount}
                </span>
              </div>
              <div className="shrink-0 w-[96px] flex justify-center">
                <StatusBadge status={inv.status} />
              </div>
              <div className="shrink-0" onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}>
                <EyeIcon />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span
          className="text-[12px] text-[#717C82]"
          style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400, fontVariationSettings: "'wdth' 100" }}
        >
          Showing 4 of 128 recent invoices
        </span>
        <div className="flex items-center gap-[16px]">
          <button
            className="text-[12px] text-[#717C82] cursor-pointer"
            style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400, fontVariationSettings: "'wdth' 100" }}
          >
            Previous
          </button>
          <button
            className="text-[12px] text-[#717C82] cursor-pointer"
            style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400, fontVariationSettings: "'wdth' 100" }}
          >
            Next
          </button>
        </div>
      </div>

      {/* Modal */}
      <NewInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
