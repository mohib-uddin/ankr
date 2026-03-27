import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Eye, Plus, Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

const invoiceSelectTriggerBase =
  "!h-[46px] !rounded-[8px] !border !border-[#D0D0D0] !bg-white !px-[12px] !text-[14px] !shadow-none data-[placeholder]:!text-[#767676] focus-visible:!ring-0 focus-visible:!border-[#764D2F] [&_svg]:!text-[#767676] [&_svg]:!opacity-100";
const invoiceSelectContentBase =
  "!bg-white !border !border-[#D0D0D0] !rounded-[8px] !shadow-none !p-[4px]";
const invoiceSelectItemBase =
  "!text-[14px] !text-[#3E2D1D] !rounded-[6px] !px-[10px] !py-[8px] data-[highlighted]:!bg-[#FCF6F0] data-[highlighted]:!text-[#3E2D1D] data-[state=checked]:!bg-[#F3EFE6] data-[state=checked]:!text-[#764D2F]";

const INVOICES = [
  { id: 1, name: 'Structural Framing -Phase 1', code: 'INV-2024-001', contractor: 'Elite Carpentry Ltd', property: 'The Obsidian Heights', amount: '$24,500', status: 'Paid' },
  { id: 2, name: 'HVAC Installation', code: 'INV-2024-002', contractor: 'Arctic Flow Systems', property: 'South Shore Pavilion', amount: '$12,840', status: 'Pending' },
  { id: 3, name: 'Marble Flooring - Lobby', code: 'INV-2024-003', contractor: 'Carrara Masters', property: 'The Obsidian Heights', amount: '$45,000', status: 'Rejected' },
  { id: 4, name: 'Lighting Fixtures', code: 'INV-2024-004', contractor: 'Lumina Studio', property: 'North Wing Extension', amount: '$8,200', status: 'Paid' },
];

const PROPERTY_FILTER_OPTIONS = [
  {
    value: 'obsidian-heights',
    label: 'The Obsidian Heights',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=96&q=60',
  },
  {
    value: 'south-shore',
    label: 'South Shore Pavilion',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=96&q=60',
  },
  {
    value: 'north-wing',
    label: 'North Wing Extension',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=96&q=60',
  },
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
  const [property, setProperty] = useState('obsidian');
  const [budgetCategory, setBudgetCategory] = useState('steel');

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
                <Select value={property} onValueChange={setProperty}>
                  <SelectTrigger
                    className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`}
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={invoiceSelectContentBase}>
                    <SelectItem value="obsidian" className={invoiceSelectItemBase}>Obsidian Villa</SelectItem>
                    <SelectItem value="heights" className={invoiceSelectItemBase}>The Obsidian Heights</SelectItem>
                    <SelectItem value="pavilion" className={invoiceSelectItemBase}>South Shore Pavilion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  className="block text-[14px] text-[#333] mb-[6px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 }}
                >
                  Budget Category
                </label>
                <Select value={budgetCategory} onValueChange={setBudgetCategory}>
                  <SelectTrigger
                    className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`}
                    style={{ fontFamily: "'Figtree', sans-serif" }}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className={invoiceSelectContentBase}>
                    <SelectItem value="steel" className={invoiceSelectItemBase}>Structural Steel</SelectItem>
                    <SelectItem value="masonry" className={invoiceSelectItemBase}>Exterior Masonry</SelectItem>
                    <SelectItem value="electrical" className={invoiceSelectItemBase}>Electrical</SelectItem>
                  </SelectContent>
                </Select>
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
  const [propertyFilter, setPropertyFilter] = useState<string | undefined>(undefined);
  const selectedPropertyOption = PROPERTY_FILTER_OPTIONS.find(option => option.value === propertyFilter);

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] py-[28px] sm:py-[40px]">
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
          className="flex items-center justify-center gap-[10px] h-[50px] w-full sm:w-auto px-[18px] sm:px-[48px] rounded-[8px] border-[1.5px] border-[#3E2D1D] text-[#3E2D1D] cursor-pointer hover:bg-[#3E2D1D] hover:text-white transition-colors shrink-0"
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
        <Select value={propertyFilter} onValueChange={setPropertyFilter}>
          <SelectTrigger
            className={`w-full max-w-[355px] !text-[#767676] ${invoiceSelectTriggerBase}`}
            style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}
          >
            <SelectValue placeholder="Select Property">
              {selectedPropertyOption && (
                <span className="flex items-center gap-[8px]">
                  <img
                    src={selectedPropertyOption.image}
                    alt={selectedPropertyOption.label}
                    className="w-[28px] h-[28px] rounded-[6px] object-cover shrink-0"
                  />
                  <span className="truncate text-[#3E2D1D]">{selectedPropertyOption.label}</span>
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className={invoiceSelectContentBase}>
            {PROPERTY_FILTER_OPTIONS.map(option => (
              <SelectItem
                key={option.value}
                value={option.value}
                className={invoiceSelectItemBase}
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, color: '#3E2D1D' }}
              >
                <span className="flex items-center gap-[10px]">
                  <img
                    src={option.image}
                    alt={option.label}
                    className="w-[28px] h-[28px] rounded-[6px] object-cover shrink-0"
                  />
                  <span className="truncate">{option.label}</span>
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div
        className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden mb-[24px]"
        style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.45)' }}
      >
        <Table className="min-w-[860px]">
          <TableHeader className="bg-[#FAFAF9] border-b border-[#D0D0D0]">
            <TableRow className="hover:bg-transparent border-0">
              <TableHead className="h-auto px-[30px] py-[12px] w-[48px] min-w-[48px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>#</TableHead>
              <TableHead className="h-auto px-0 py-[12px] w-[206px] min-w-[206px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>Invoice Name</TableHead>
              <TableHead className="h-auto px-0 py-[12px] w-[140px] min-w-[140px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>Contractor</TableHead>
              <TableHead className="h-auto px-0 py-[12px] w-[141px] min-w-[141px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>Property</TableHead>
              <TableHead className="h-auto px-0 py-[12px] w-[100px] min-w-[100px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px] text-right" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>Amount</TableHead>
              <TableHead className="h-auto px-0 py-[12px] w-[96px] min-w-[96px] text-[11px] text-[#8C8780] uppercase tracking-[0.6145px] text-center" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>Status</TableHead>
              <TableHead className="h-auto pl-0 pr-[30px] py-[12px] w-[30px] min-w-[30px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id} className="border-b border-[#F5F3EF] last:border-b-0 hover:bg-transparent">
                <TableCell className="px-[30px] py-[14px] w-[48px] min-w-[48px]">
                  <span className="text-[14px] text-[#8C8780] tracking-[-0.1504px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                    #{inv.id}
                  </span>
                </TableCell>
                <TableCell className="px-0 py-[14px] w-[206px] min-w-[206px]">
                  <p className="text-[14px] text-[#3E2D1D] tracking-[-0.1504px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>{inv.name}</p>
                  <p className="text-[12px] text-[#8C8780] mt-[2px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{inv.code}</p>
                </TableCell>
                <TableCell className="px-0 py-[14px] w-[140px] min-w-[140px]">
                  <span className="text-[14px] text-[#8C8780] tracking-[-0.1504px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{inv.contractor}</span>
                </TableCell>
                <TableCell className="px-0 py-[14px] w-[141px] min-w-[141px]">
                  <span className="text-[14px] text-[#8C8780] tracking-[-0.1504px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{inv.property}</span>
                </TableCell>
                <TableCell className="px-0 py-[14px] w-[100px] min-w-[100px] text-right">
                  <span className="text-[14px] text-[#3E2D1D] tracking-[-0.1504px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 700, fontVariationSettings: "'wdth' 100" }}>{inv.amount}</span>
                </TableCell>
                <TableCell className="px-0 py-[14px] w-[96px] min-w-[96px]">
                  <div className="flex justify-center">
                    <StatusBadge status={inv.status} />
                  </div>
                </TableCell>
                <TableCell className="pl-0 pr-[30px] py-[14px] w-[30px] min-w-[30px]">
                  <button className="cursor-pointer" onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}>
                    <EyeIcon />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
