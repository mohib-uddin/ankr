import { useState, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Search, FolderPlus, Link2, FileText, Shield,
  Trash2, Tag, Eye, Copy, Check, X,
  Clock, Lock, Download, MoreHorizontal,
  Package, ChevronRight, ArrowLeft, AlertCircle,
  CheckCircle, Circle, Plus, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router';
import { useApp } from '../../context/AppContext';
import type { VaultCategory, VaultDocument, VaultFolder, VaultShareLink } from '../../context/AppContext';
import svgPaths from '../../../imports/svg-2jpk391bzg';

/* ─── Font tokens (matching Budget/Draw tabs exactly) ─── */
const canela  = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const sfMed   = "font-['SF_Pro',sans-serif] font-[510]";

const figtree = "font-['Figtree',sans-serif] font-normal";
const wdth: React.CSSProperties = { fontVariationSettings: "'wdth' 100" };

/* ─── Constants ─── */
const DEFAULT_CATEGORIES: VaultCategory[] = ['Identity', 'Income', 'Banking', 'Real Estate', 'Debt', 'Tax', 'Entity'];

const CATEGORY_META: Record<VaultCategory, { icon: string; color: string; bg: string; description: string }> = {
  'Identity':    { icon: 'id',       color: '#764D2F', bg: '#F3EFE6', description: 'Passports, licenses, SSN cards' },
  'Income':      { icon: 'income',   color: '#3E6B3E', bg: '#EEF5EE', description: 'W-2s, pay stubs, 1099s' },
  'Banking':     { icon: 'bank',     color: '#2D5A8E', bg: '#EDF2F8', description: 'Bank statements, account records' },
  'Real Estate': { icon: 'property', color: '#8B5E3C', bg: '#F5EDE3', description: 'Deeds, titles, appraisals' },
  'Debt':        { icon: 'debt',     color: '#8E3B3B', bg: '#F8EDED', description: 'Loan agreements, credit reports' },
  'Tax':         { icon: 'tax',      color: '#5A5A2D', bg: '#F2F2E8', description: 'Tax returns, K-1s, 1040s' },
  'Entity':      { icon: 'entity',   color: '#5A3D8E', bg: '#F0ECF5', description: 'Operating agreements, articles of org' },
  'Custom':      { icon: 'custom',   color: '#8C8780', bg: '#F5F3EF', description: 'Custom folders and documents' },
};

/* ─── Enhanced Package Templates with Smart Matching ─── */
interface PackageRequiredDoc {
  id: string;
  name: string;
  category: VaultCategory;
  keywords: string[]; // keywords to match against doc name/tags
  description: string;
}

interface PackageTemplate {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji-like identifier
  color: string;
  bg: string;
  requiredDocs: PackageRequiredDoc[];
}

const PACKAGE_TEMPLATES: PackageTemplate[] = [
  {
    id: 'loan_app',
    name: 'Loan Application',
    description: 'Standard package for new loan applications including identity, income, banking, and tax documentation.',
    icon: 'loan',
    color: '#764D2F',
    bg: '#F3EFE6',
    requiredDocs: [
      { id: 'la-1', name: 'Government-Issued ID', category: 'Identity', keywords: ['id', 'passport', 'license', 'driver', 'government', 'identification'], description: 'Valid photo ID (passport, driver\'s license)' },
      { id: 'la-2', name: 'W-2 or 1099 Forms', category: 'Income', keywords: ['w-2', 'w2', '1099', 'wage', 'income'], description: 'Most recent tax year W-2s or 1099s' },
      { id: 'la-3', name: 'Bank Statements (3 months)', category: 'Banking', keywords: ['bank', 'statement', 'account', 'checking', 'savings'], description: 'Last 3 months of all bank account statements' },
      { id: 'la-4', name: 'Tax Returns (2 years)', category: 'Tax', keywords: ['tax', 'return', '1040', 'federal', 'irs'], description: 'Federal tax returns for the past 2 years' },
      { id: 'la-5', name: 'Personal Financial Statement', category: 'Banking', keywords: ['pfs', 'personal', 'financial', 'statement', 'net worth', 'balance sheet'], description: 'Current personal financial statement (PFS)' },
    ],
  },
  {
    id: 'refinance',
    name: 'Refinance Package',
    description: 'Required documents for refinancing an existing property loan with updated valuations.',
    icon: 'refi',
    color: '#2D5A8E',
    bg: '#EDF2F8',
    requiredDocs: [
      { id: 'rf-1', name: 'Current Loan Note', category: 'Debt', keywords: ['note', 'loan', 'mortgage', 'current', 'existing'], description: 'Copy of existing loan note and terms' },
      { id: 'rf-2', name: 'Property Appraisal', category: 'Real Estate', keywords: ['appraisal', 'valuation', 'arv', 'value', 'appraised'], description: 'Recent property appraisal report' },
      { id: 'rf-3', name: 'Title Report', category: 'Real Estate', keywords: ['title', 'report', 'deed', 'lien', 'search'], description: 'Current title search and report' },
      { id: 'rf-4', name: 'Income Verification', category: 'Income', keywords: ['income', 'verification', 'employment', 'salary', 'pay', 'stub'], description: 'Proof of income (pay stubs, employment letter)' },
      { id: 'rf-5', name: 'Existing Loan Documents', category: 'Debt', keywords: ['loan', 'document', 'agreement', 'closing', 'hud'], description: 'Original closing docs and loan agreement' },
    ],
  },
  {
    id: 'tax_pkg',
    name: 'Tax Returns Package',
    description: 'Complete tax return package for comprehensive lender financial review.',
    icon: 'tax',
    color: '#5A5A2D',
    bg: '#F2F2E8',
    requiredDocs: [
      { id: 'tx-1', name: 'Personal Tax Returns (2 years)', category: 'Tax', keywords: ['personal', 'tax', 'return', '1040', 'individual'], description: 'IRS Form 1040 with all schedules for 2 years' },
      { id: 'tx-2', name: 'Entity Tax Returns (2 years)', category: 'Tax', keywords: ['entity', 'corporate', 'business', 'llc', '1065', '1120'], description: 'Business/entity returns (1065, 1120S, etc.)' },
      { id: 'tx-3', name: 'K-1 Schedules', category: 'Tax', keywords: ['k-1', 'k1', 'schedule', 'partnership', 'distribution'], description: 'All K-1 schedules from partnerships/S-corps' },
      { id: 'tx-4', name: 'Extension Letters', category: 'Tax', keywords: ['extension', 'irs', 'form', '4868', '7004'], description: 'IRS extension confirmations (if applicable)' },
    ],
  },
  {
    id: 'audit_pkg',
    name: 'Audit / Compliance',
    description: 'Full documentation for compliance audits, due diligence, and regulatory review.',
    icon: 'audit',
    color: '#5A3D8E',
    bg: '#F0ECF5',
    requiredDocs: [
      { id: 'au-1', name: 'Financial Statements', category: 'Banking', keywords: ['financial', 'statement', 'balance', 'profit', 'loss', 'income', 'p&l'], description: 'Audited or prepared financial statements' },
      { id: 'au-2', name: 'Corporate Documents', category: 'Entity', keywords: ['corporate', 'operating', 'agreement', 'articles', 'bylaws', 'incorporation'], description: 'Operating agreement, articles of org/inc' },
      { id: 'au-3', name: 'Bank Records', category: 'Banking', keywords: ['bank', 'record', 'statement', 'transaction', 'ledger'], description: '12 months of complete bank records' },
      { id: 'au-4', name: 'Tax Filings', category: 'Tax', keywords: ['tax', 'filing', 'return', 'irs', 'state'], description: 'All federal and state tax filings' },
      { id: 'au-5', name: 'Insurance Certificates', category: 'Entity', keywords: ['insurance', 'certificate', 'coverage', 'policy', 'liability'], description: 'Current insurance certificates of coverage' },
      { id: 'au-6', name: 'Government ID', category: 'Identity', keywords: ['id', 'passport', 'license', 'government', 'identification'], description: 'Photo identification for all principals' },
    ],
  },
];

/* ─── Smart Document Matching Engine ─── */
function matchDocToRequirement(docs: VaultDocument[], req: PackageRequiredDoc): VaultDocument | null {
  // Pass 1: category match + keyword match (strongest)
  const categoryDocs = docs.filter(d => d.category === req.category);
  for (const doc of categoryDocs) {
    const docNameLower = doc.name.toLowerCase();
    const allText = [docNameLower, ...doc.tags.map(t => t.toLowerCase())].join(' ');
    const keywordMatch = req.keywords.some(kw => allText.includes(kw.toLowerCase()));
    if (keywordMatch) return doc;
  }
  // Pass 2: just category match (if we have docs in that category)
  if (categoryDocs.length > 0) {
    // Return first unmatched doc in category
    return categoryDocs[0];
  }
  // Pass 3: keyword match only across all docs (weakest)
  for (const doc of docs) {
    const allText = [doc.name.toLowerCase(), ...doc.tags.map(t => t.toLowerCase())].join(' ');
    if (req.keywords.some(kw => allText.includes(kw.toLowerCase()))) return doc;
  }
  return null;
}

function getPackageMatches(docs: VaultDocument[], template: PackageTemplate): { req: PackageRequiredDoc; matched: VaultDocument | null }[] {
  const usedDocIds = new Set<string>();
  const results: { req: PackageRequiredDoc; matched: VaultDocument | null }[] = [];
  
  // First pass: strict matching (category + keyword)
  for (const req of template.requiredDocs) {
    const categoryDocs = docs.filter(d => d.category === req.category && !usedDocIds.has(d.id));
    let match: VaultDocument | null = null;
    for (const doc of categoryDocs) {
      const allText = [doc.name.toLowerCase(), ...doc.tags.map(t => t.toLowerCase())].join(' ');
      if (req.keywords.some(kw => allText.includes(kw.toLowerCase()))) {
        match = doc;
        break;
      }
    }
    if (match) {
      usedDocIds.add(match.id);
      results.push({ req, matched: match });
    } else {
      results.push({ req, matched: null }); // temporary, try weak match next
    }
  }
  
  // Second pass: try category-only match for unmatched
  for (let i = 0; i < results.length; i++) {
    if (!results[i].matched) {
      const req = results[i].req;
      const categoryDoc = docs.find(d => d.category === req.category && !usedDocIds.has(d.id));
      if (categoryDoc) {
        usedDocIds.add(categoryDoc.id);
        results[i] = { req, matched: categoryDoc };
      }
    }
  }
  
  return results;
}

const FILE_TYPE_ICONS: Record<string, { color: string; bg: string }> = {
  'PDF':   { color: '#C53030', bg: '#FFF5F5' },
  'XLSX':  { color: '#276749', bg: '#F0FFF4' },
  'DOCX':  { color: '#2B6CB0', bg: '#EBF8FF' },
  'PNG':   { color: '#9C4221', bg: '#FFFAF0' },
  'JPG':   { color: '#9C4221', bg: '#FFFAF0' },
  'CSV':   { color: '#276749', bg: '#F0FFF4' },
};

function getFileTypeStyle(type: string) {
  return FILE_TYPE_ICONS[type.toUpperCase()] || { color: '#8C8780', bg: '#F5F3EF' };
}

/* ─── SVG Mini Icons ─── */
function FolderIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <g transform="translate(2.25,3.25)">
        <path clipRule="evenodd" d={svgPaths.p2ebf2a80} fill="currentColor" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Circular Progress ─── */
function CircularProgress({ value, size = 60, strokeWidth = 5, color = '#3E6B3E' }: { value: number; size?: number; strokeWidth?: number; color?: string }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#E8E4DD" strokeWidth={strokeWidth} />
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
    </svg>
  );
}

/* ─── Main Component ─── */
type Tab = 'documents' | 'packages' | 'shared';

export function DocumentVault() {
  const { state, addVaultDocument, updateVaultDocument, deleteVaultDocument, addVaultFolder, deleteVaultFolder, addVaultShareLink, revokeVaultShareLink } = useApp();
  const docs = state.vaultDocuments;
  const folders = state.vaultFolders;
  const shareLinks = state.vaultShareLinks;

  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [activeCategory, setActiveCategory] = useState<VaultCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [shareDocIds, setShareDocIds] = useState<string[]>([]);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [uploadPreset, setUploadPreset] = useState<{ category?: VaultCategory; nameHint?: string } | null>(null);

  // Filter documents
  const filteredDocs = useMemo(() => {
    let result = docs;
    if (activeCategory !== 'all') {
      result = result.filter(d => d.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [docs, activeCategory, searchQuery]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DEFAULT_CATEGORIES.forEach(c => { counts[c] = 0; });
    docs.forEach(d => { counts[d.category] = (counts[d.category] || 0) + 1; });
    return counts;
  }, [docs]);

  const totalStorage = useMemo(() => {
    let bytes = 0;
    docs.forEach(d => {
      const match = d.fileSize.match(/([\d.]+)\s*(MB|KB|GB)/i);
      if (match) {
        const val = parseFloat(match[1]);
        const unit = match[2].toUpperCase();
        if (unit === 'KB') bytes += val * 1024;
        else if (unit === 'MB') bytes += val * 1024 * 1024;
        else if (unit === 'GB') bytes += val * 1024 * 1024 * 1024;
      }
    });
    if (bytes === 0) return '0 MB';
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }, [docs]);

  const activeShareLinks = shareLinks.filter(l => l.isActive);

  const handleSelectDoc = (id: string) => {
    setSelectedDocs(prev =>
      prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
    );
  };

  const handleShareSelected = () => {
    setShareDocIds(selectedDocs);
    setShowShareModal(true);
  };

  const handleDeleteSelected = () => {
    selectedDocs.forEach(id => deleteVaultDocument(id));
    setSelectedDocs([]);
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/share/vault/${token}`;
    navigator.clipboard.writeText(url).catch(() => {});
    setCopiedLink(token);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const openUploadForPackage = (category: VaultCategory, nameHint: string) => {
    setUploadPreset({ category, nameHint });
    setShowUploadModal(true);
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'documents', label: 'All Documents', count: docs.length },
    { id: 'packages', label: 'Document Packages' },
    { id: 'shared', label: 'Shared Links', count: activeShareLinks.length },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] py-[32px] sm:py-[40px]">
      {/* ─── Header ─── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] mb-[36px]">
          <div>
            <h1 className={`${canela} text-[28px] text-[#3E2D1D] mb-[8px]`}>Document Vault</h1>
            <p className="text-[16px] text-[#764D2F]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}>
              Securely upload, organize, and share your financial documents.
            </p>
          </div>
          <div className="flex items-center gap-[10px] shrink-0">
            <button
              onClick={() => setShowFolderModal(true)}
              className="flex items-center gap-[8px] h-[50px] px-[28px] rounded-[8px] border-[1.5px] border-[#3E2D1D] text-[16px] text-[#3E2D1D] hover:bg-[#FCF6F0] transition-colors cursor-pointer"
              style={{ fontWeight: 590 }}
            >
              <FolderPlus className="w-[20px] h-[20px]" />
              <span className="hidden sm:inline">New Folder</span>
            </button>
            <button
              onClick={() => { setUploadPreset(null); setShowUploadModal(true); }}
              className="flex items-center gap-[10px] h-[50px] px-[28px] rounded-[8px] bg-[#3E2D1D] text-white text-[16px] hover:bg-[#764D2F] transition-colors cursor-pointer"
              style={{ fontWeight: 590 }}
            >
              <Upload className="w-[20px] h-[20px]" />
              Upload
            </button>
          </div>
        </div>
      </motion.div>

      {/* ─── Tabs ─── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.3 }}
        className="flex gap-[4px] mb-[24px] border-b border-[#E8E4DD] overflow-x-auto"
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-[16px] py-[12px] text-[14px] whitespace-nowrap transition-colors cursor-pointer border-b-2 ${
              activeTab === tab.id
                ? 'border-[#3E2D1D] text-[#3E2D1D]'
                : 'border-transparent text-[#8C8780] hover:text-[#764D2F]'
            }`}
            style={{ fontWeight: activeTab === tab.id ? 590 : 510 }}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-[#F3EFE6] text-[#764D2F] text-[11px]" style={{ fontWeight: 590 }}>{tab.count}</span>
            )}
          </button>
        ))}
      </motion.div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        {activeTab === 'documents' && (
          <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <DocumentsView
              docs={filteredDocs}
              allDocs={docs}
              folders={folders}
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              categoryCounts={categoryCounts}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedDocs={selectedDocs}
              handleSelectDoc={handleSelectDoc}
              handleShareSelected={handleShareSelected}
              handleDeleteSelected={handleDeleteSelected}
              expandedDoc={expandedDoc}
              setExpandedDoc={setExpandedDoc}
              onUpload={() => { setUploadPreset(null); setShowUploadModal(true); }}
              onDelete={deleteVaultDocument}
              onShare={(ids) => { setShareDocIds(ids); setShowShareModal(true); }}
              updateDoc={updateVaultDocument}
              deleteFolder={deleteVaultFolder}
            />
          </motion.div>
        )}
        {activeTab === 'packages' && (
          <motion.div key="pkgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <PackagesView
              docs={docs}
              onUploadForPackage={openUploadForPackage}
              onShare={(ids, pkgName) => { setShareDocIds(ids); setShowShareModal(true); }}
              onCreateShareLink={addVaultShareLink}
            />
          </motion.div>
        )}
        {activeTab === 'shared' && (
          <motion.div key="shared" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <SharedLinksView
              shareLinks={shareLinks}
              docs={docs}
              onRevoke={revokeVaultShareLink}
              onCopyLink={handleCopyLink}
              copiedLink={copiedLink}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {showUploadModal && <UploadModal onClose={() => { setShowUploadModal(false); setUploadPreset(null); }} onUpload={addVaultDocument} folders={folders} properties={state.properties} preset={uploadPreset} />}
        {showShareModal && <ShareModal onClose={() => { setShowShareModal(false); setShareDocIds([]); }} docIds={shareDocIds} docs={docs} onCreateLink={addVaultShareLink} />}
        {showFolderModal && <FolderModal onClose={() => setShowFolderModal(false)} onCreateFolder={addVaultFolder} />}
      </AnimatePresence>
    </div>
  );
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[16px] sm:p-[20px]">
      <div className="flex items-center gap-[10px] mb-[10px]">
        <div className="w-[32px] h-[32px] rounded-[8px] bg-[#F3EFE6] flex items-center justify-center text-[#764D2F]">{icon}</div>
      </div>
      <p className="text-[20px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{value}</p>
      <p className={`${sfMed} text-[12px] text-[#8C8780] mt-[2px]`} style={wdth}>{label}</p>
    </div>
  );
}

/* ─── Documents View (main tab) ─── */
function DocumentsView({
  docs, allDocs, folders, activeCategory, setActiveCategory, categoryCounts,
  searchQuery, setSearchQuery, selectedDocs, handleSelectDoc, handleShareSelected,
  handleDeleteSelected, expandedDoc, setExpandedDoc, onUpload, onDelete, onShare,
  updateDoc, deleteFolder,
}: {
  docs: VaultDocument[];
  allDocs: VaultDocument[];
  folders: VaultFolder[];
  activeCategory: VaultCategory | 'all';
  setActiveCategory: (c: VaultCategory | 'all') => void;
  categoryCounts: Record<string, number>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedDocs: string[];
  handleSelectDoc: (id: string) => void;
  handleShareSelected: () => void;
  handleDeleteSelected: () => void;
  expandedDoc: string | null;
  setExpandedDoc: (id: string | null) => void;
  onUpload: () => void;
  onDelete: (id: string) => void;
  onShare: (ids: string[]) => void;
  updateDoc: (id: string, updates: Partial<VaultDocument>) => void;
  deleteFolder: (id: string) => void;
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-[24px]">
      {/* ─ Category Sidebar ─ */}
      <div className="w-full xl:w-[280px] shrink-0">
        <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[21px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
          <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[16px]`}>Categories</p>

          {/* All Documents button */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`w-full h-[41px] flex items-center justify-between px-[14px] rounded-[10px] mb-[4px] transition-colors cursor-pointer ${
              activeCategory === 'all' ? 'bg-[#3E2D1D] text-white' : 'text-[#3E2D1D] hover:bg-[#F3EFE6]'
            }`}
          >
            <span className="flex items-center gap-[10px]">
              <span className={`w-[30px] h-[30px] rounded-[15px] flex items-center justify-center text-white ${activeCategory === 'all' ? 'bg-[#3E2D1D]' : 'bg-[#764D2F]'}`}>
                <FolderIcon size={18} />
              </span>
              <span className="text-[14px]" style={{ fontWeight: 510 }}>All Documents</span>
            </span>
            <span className="text-[11px] px-[6px] py-[1px] rounded-full" style={{
              fontWeight: 590,
              backgroundColor: activeCategory === 'all' ? 'rgba(255,255,255,0.2)' : '#F3EFE6',
              color: activeCategory === 'all' ? 'white' : '#764D2F',
            }}>{allDocs.length}</span>
          </button>

          <div className="h-px bg-[#E8E4DD] my-[12px]" />

          {/* Default categories */}
          {DEFAULT_CATEGORIES.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full h-[41px] flex items-center justify-between px-[14px] rounded-[10px] mb-[2px] transition-colors cursor-pointer ${
                  isActive ? 'bg-[#3E2D1D] text-white' : 'text-[#3E2D1D] hover:bg-[#F3EFE6]'
                }`}
              >
                <span className="flex items-center gap-[10px]">
                  <span className={`w-[30px] h-[30px] rounded-[15px] flex items-center justify-center text-white ${isActive ? 'bg-[#3E2D1D]' : 'bg-[#764D2F]'}`}>
                    <FolderIcon size={18} />
                  </span>
                  <span className="text-[14px] text-left" style={{ fontWeight: 510 }}>{cat}</span>
                </span>
                <span className="text-[11px] px-[6px] py-[1px] rounded-full" style={{
                  fontWeight: 590,
                  backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#F3EFE6',
                  color: isActive ? 'white' : '#3E2D1D',
                }}>{count}</span>
              </button>
            );
          })}

          {/* Custom folders */}
          {folders.length > 0 && (
            <>
              <div className="h-px bg-[#E8E4DD] my-[12px]" />
              <p className="text-[11px] text-[#8C8780] px-[14px] mb-[8px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>CUSTOM FOLDERS</p>
              {folders.map(f => (
                <div key={f.id} className="flex items-center justify-between px-[14px] py-[8px] rounded-[10px] hover:bg-[#F3EFE6] group">
                  <span className="flex items-center gap-[10px] text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>
                    <FolderIcon size={16} />
                    {f.name}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); deleteFolder(f.id); }}
                    className="opacity-0 group-hover:opacity-100 text-[#C5C0B9] hover:text-red-400 transition-all cursor-pointer p-[2px]"
                  >
                    <X className="w-[12px] h-[12px]" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* ─ Document List ─ */}
      <div className="flex-1 min-w-0">
        {/* Search + Actions bar */}
        <div className="flex flex-col sm:flex-row gap-[12px] mb-[20px]">
          <div className="flex-1 flex items-center gap-[10px] h-[46px] bg-white rounded-[8px] border border-[#D0D0D0] px-[12px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
            <Search className="w-[16px] h-[16px] text-[#8C8780] shrink-0" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search documents, tags..."
              className={`${figtree} flex-1 text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none bg-transparent`}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-[#C5C0B9] hover:text-[#3E2D1D] cursor-pointer">
                <X className="w-[14px] h-[14px]" />
              </button>
            )}
          </div>
          {selectedDocs.length > 0 && (
            <div className="flex items-center gap-[8px]">
              <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{selectedDocs.length} selected</span>
              <button onClick={handleShareSelected} className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[8px] bg-[#3E2D1D] text-white text-[13px] cursor-pointer hover:bg-[#764D2F] transition-colors" style={{ fontWeight: 590 }}>
                <Link2 className="w-[14px] h-[14px]" /> Share
              </button>
              <button onClick={handleDeleteSelected} className="flex items-center gap-[6px] h-[40px] px-[14px] rounded-[8px] border border-red-200 text-red-500 text-[13px] cursor-pointer hover:bg-red-50 transition-colors" style={{ fontWeight: 590 }}>
                <Trash2 className="w-[14px] h-[14px]" /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Document cards */}
        {docs.length === 0 ? (
          <EmptyState
            title={activeCategory !== 'all' ? `No ${activeCategory} documents` : 'No documents yet'}
            description={activeCategory !== 'all'
              ? `Upload ${activeCategory.toLowerCase()} documents to get started.`
              : 'Upload your first document to start building your secure vault.'
            }
            onAction={onUpload}
            actionLabel="Upload Document"
          />
        ) : (
          <div className="flex flex-col gap-[8px]">
            {docs.map(doc => (
              <DocumentRow
                key={doc.id}
                doc={doc}
                isSelected={selectedDocs.includes(doc.id)}
                isExpanded={expandedDoc === doc.id}
                onSelect={() => handleSelectDoc(doc.id)}
                onExpand={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
                onDelete={() => onDelete(doc.id)}
                onShare={() => onShare([doc.id])}
                onUpdateTags={(tags) => updateDoc(doc.id, { tags })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Document Row ─── */
function DocumentRow({
  doc, isSelected, isExpanded, onSelect, onExpand, onDelete, onShare, onUpdateTags,
}: {
  doc: VaultDocument;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: () => void;
  onExpand: () => void;
  onDelete: () => void;
  onShare: () => void;
  onUpdateTags: (tags: string[]) => void;
}) {
  const typeStyle = getFileTypeStyle(doc.fileType);
  const meta = CATEGORY_META[doc.category];
  const [newTag, setNewTag] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const addTag = () => {
    if (newTag.trim() && !doc.tags.includes(newTag.trim())) {
      onUpdateTags([...doc.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  return (
    <motion.div
      layout
      className={`bg-white rounded-[16px] border transition-colors shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] ${isSelected ? 'border-[#764D2F] bg-[#FDFBF8]' : 'border-[#EAEAEA]'}`}
    >
      <div className="flex items-center gap-[16px] px-[28px] py-[20px]">
        {/* Checkbox */}
        <button
          onClick={onSelect}
          className={`w-[18px] h-[18px] rounded-[4px] border-[1.5px] flex items-center justify-center cursor-pointer shrink-0 transition-colors ${
            isSelected ? 'bg-[#3E2D1D] border-[#3E2D1D]' : 'border-[#C5C0B9] hover:border-[#764D2F]'
          }`}
        >
          {isSelected && <Check className="w-[12px] h-[12px] text-white" />}
        </button>

        {/* File type icon */}
        <div className="w-[36px] h-[40px] rounded-[8px] flex items-center justify-center shrink-0 bg-[#F3EFE6]">
          <FileText className="w-[18px] h-[18px] text-[#764D2F]" />
        </div>

        {/* Info */}
        <button onClick={onExpand} className="flex-1 min-w-0 text-left cursor-pointer">
          <p className="text-[16px] text-[#764D2F] truncate" style={{ fontWeight: 510 }}>{doc.name}</p>
          <div className="flex items-center gap-[8px] mt-[2px]">
            <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{doc.fileSize}</span>
            <span className="text-[12px] text-[#D0D0D0]">|</span>
            <span className="text-[12px] px-[6px] py-[1px] rounded-full" style={{ backgroundColor: '#F3EFE6', color: '#3E2D1D', fontWeight: 510 }}>{doc.category}</span>
            <span className="text-[12px] text-[#D0D0D0] hidden sm:inline">|</span>
            <span className="text-[12px] text-[#8C8780] hidden sm:inline" style={{ fontWeight: 510 }}>{doc.uploadedAt}</span>
          </div>
        </button>

        {/* Tags preview */}
        <div className="hidden lg:flex items-center gap-[4px]">
          {doc.tags.slice(0, 2).map(t => (
            <span key={t} className="text-[11px] px-[8px] py-[2px] rounded-full bg-[#F3EFE6] text-[#764D2F]" style={{ fontWeight: 510 }}>{t}</span>
          ))}
          {doc.tags.length > 2 && (
            <span className="text-[11px] text-[#8C8780]" style={{ fontWeight: 510 }}>+{doc.tags.length - 2}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-[4px] shrink-0">
          <button onClick={onShare} className="p-[6px] rounded-[6px] border border-[#D0D0D0] text-[#8C8780] hover:bg-[#F3EFE6] hover:text-[#764D2F] transition-colors cursor-pointer" title="Share">
            <Link2 className="w-[14px] h-[14px]" />
          </button>
          <div className="relative">
            <button onClick={() => setShowMenu(!showMenu)} className="p-[6px] rounded-[6px] border border-[#D0D0D0] text-[#8C8780] hover:bg-[#F3EFE6] hover:text-[#764D2F] transition-colors cursor-pointer">
              <MoreHorizontal className="w-[14px] h-[14px]" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-[4px] z-20 bg-white rounded-[10px] border border-[#D0D0D0] shadow-lg py-[4px] w-[160px]">
                  <button onClick={() => { onExpand(); setShowMenu(false); }} className="w-full text-left px-[14px] py-[8px] text-[13px] text-[#3E2D1D] hover:bg-[#F3EFE6] cursor-pointer flex items-center gap-[8px]" style={{ fontWeight: 510 }}>
                    <Eye className="w-[14px] h-[14px]" /> View Details
                  </button>
                  <button onClick={() => { setShowMenu(false); }} className="w-full text-left px-[14px] py-[8px] text-[13px] text-[#3E2D1D] hover:bg-[#F3EFE6] cursor-pointer flex items-center gap-[8px]" style={{ fontWeight: 510 }}>
                    <Download className="w-[14px] h-[14px]" /> Download
                  </button>
                  <div className="h-px bg-[#E8E4DD] my-[2px]" />
                  <button onClick={() => { onDelete(); setShowMenu(false); }} className="w-full text-left px-[14px] py-[8px] text-[13px] text-red-500 hover:bg-red-50 cursor-pointer flex items-center gap-[8px]" style={{ fontWeight: 510 }}>
                    <Trash2 className="w-[14px] h-[14px]" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Expanded detail */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-[16px] pb-[16px] pt-[4px] border-t border-[#F0ECE6]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] mb-[12px]">
                <div>
                  <p className="text-[11px] text-[#8C8780] mb-[4px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>FILE DETAILS</p>
                  <p className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>Type: {doc.fileType} | Size: {doc.fileSize}</p>
                  <p className="text-[13px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>Uploaded: {doc.uploadedAt}</p>
                  {doc.notes && <p className="text-[13px] text-[#8C8780] mt-[4px]" style={{ fontWeight: 510 }}>Note: {doc.notes}</p>}
                </div>
                <div>
                  <p className="text-[11px] text-[#8C8780] mb-[6px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>TAGS</p>
                  <div className="flex flex-wrap gap-[4px] mb-[8px]">
                    {doc.tags.map(t => (
                      <span key={t} className="flex items-center gap-[4px] text-[11px] px-[8px] py-[2px] rounded-full bg-[#F3EFE6] text-[#764D2F]" style={{ fontWeight: 510 }}>
                        {t}
                        <button onClick={() => onUpdateTags(doc.tags.filter(tag => tag !== t))} className="hover:text-red-400 cursor-pointer"><X className="w-[10px] h-[10px]" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-[6px]">
                    <input
                      value={newTag}
                      onChange={e => setNewTag(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addTag()}
                      placeholder="Add tag..."
                      className={`${figtree} flex-1 h-[28px] px-[8px] rounded-[6px] border border-[#D0D0D0] text-[12px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none`}
                    />
                    <button onClick={addTag} className="h-[28px] px-[10px] rounded-[6px] bg-[#F3EFE6] text-[#764D2F] text-[12px] cursor-pointer hover:bg-[#E8DDD0] transition-colors" style={{ fontWeight: 590 }}>Add</button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── Empty State ─── */
function EmptyState({ title, description, onAction, actionLabel }: { title: string; description: string; onAction: () => void; actionLabel: string }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#D0D0D0] px-[61px] py-[51px] text-center shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
      <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F3EFE6] flex items-center justify-center mx-auto mb-[17px]">
        <Shield className="w-[24px] h-[24px] text-[#764D2F]" />
      </div>
      <p className={`${canela} text-[24px] text-[#3E2D1D] mb-[8px]`}>{title}</p>
      <p className={`${sfMed} text-[14px] text-[#8C8780] max-w-[330px] mx-auto mb-[17px]`} style={wdth}>{description}</p>
      <button
        onClick={onAction}
        className="inline-flex items-center gap-[10px] h-[50px] px-[28px] rounded-[8px] bg-[#3E2D1D] text-white text-[16px] cursor-pointer hover:bg-[#764D2F] transition-colors"
        style={{ fontWeight: 590 }}
      >
        <Upload className="w-[16px] h-[16px]" /> {actionLabel}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   PACKAGES VIEW — Complete End-to-End Flow
   ═════════════════════════════════════════════════════════════���═════════════════ */

function PackagesView({ docs, onUploadForPackage, onShare, onCreateShareLink }: {
  docs: VaultDocument[];
  onUploadForPackage: (category: VaultCategory, nameHint: string) => void;
  onShare: (ids: string[], pkgName: string) => void;
  onCreateShareLink: (link: Omit<VaultShareLink, 'id' | 'token' | 'accessCount' | 'createdAt'>) => VaultShareLink;
}) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<{ link: VaultShareLink; pkgName: string } | null>(null);

  const selectedTemplate = PACKAGE_TEMPLATES.find(p => p.id === selectedPkg);

  if (generatedLink) {
    return (
      <PackageShareSuccess
        link={generatedLink.link}
        pkgName={generatedLink.pkgName}
        onBack={() => setGeneratedLink(null)}
      />
    );
  }

  if (selectedTemplate) {
    return (
      <PackageDetailView
        template={selectedTemplate}
        docs={docs}
        onBack={() => setSelectedPkg(null)}
        onUploadForPackage={onUploadForPackage}
        onGeneratePackage={(docIds, pkgName, email) => {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 30);
          const link = onCreateShareLink({
            documentIds: docIds,
            packageName: pkgName,
            expiresAt: expiresAt.toISOString().split('T')[0],
            maxAccess: 25,
            recipientEmail: email || undefined,
            isActive: true,
          });
          setGeneratedLink({ link, pkgName });
        }}
      />
    );
  }

  return (
    <div>
      <p className={`${sfMed} text-[14px] text-[#8C8780] mb-[24px]`} style={wdth}>
        Pre-built document packages for common lender requests. Select a template to review required documents, upload missing items, and generate a shareable package link.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        {PACKAGE_TEMPLATES.map((pkg, i) => {
          const matches = getPackageMatches(docs, pkg);
          const fulfilled = matches.filter(m => m.matched).length;
          const total = matches.length;
          const completeness = total > 0 ? Math.round((fulfilled / total) * 100) : 0;
          const complColor = completeness >= 80 ? '#3E6B3E' : completeness >= 40 ? '#8B7A3C' : '#8E3B3B';
          const complBg = completeness >= 80 ? '#EEF5EE' : completeness >= 40 ? '#FFF8E6' : '#F8EDED';

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPkg(pkg.id)}
              className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] flex flex-col cursor-pointer hover:border-[#764D2F] hover:shadow-sm transition-all group"
            >
              <div className="flex items-start justify-between mb-[16px]">
                <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center shrink-0" style={{ backgroundColor: pkg.bg }}>
                  <Package className="w-[22px] h-[22px]" style={{ color: pkg.color }} />
                </div>
                <div className="relative w-[52px] h-[52px]">
                  <CircularProgress value={completeness} size={52} strokeWidth={4} color={complColor} />
                  <span className="absolute inset-0 flex items-center justify-center text-[12px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{completeness}%</span>
                </div>
              </div>

              <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[4px]`}>{pkg.name}</p>
              <p className={`${sfMed} text-[13px] text-[#8C8780] mb-[16px] line-clamp-2`} style={wdth}>{pkg.description}</p>

              {/* Compact checklist preview */}
              <div className="flex-1 mb-[16px]">
                <div className="flex flex-col gap-[6px]">
                  {matches.slice(0, 3).map(({ req, matched }) => (
                    <div key={req.id} className="flex items-center gap-[8px]">
                      {matched ? (
                        <CheckCircle className="w-[14px] h-[14px] text-[#3E6B3E] shrink-0" />
                      ) : (
                        <Circle className="w-[14px] h-[14px] text-[#D0D0D0] shrink-0" />
                      )}
                      <span className={`text-[12px] truncate ${matched ? 'text-[#3E2D1D]' : 'text-[#8C8780]'}`} style={{ fontWeight: 510 }}>{req.name}</span>
                    </div>
                  ))}
                  {matches.length > 3 && (
                    <span className="text-[11px] text-[#8C8780] ml-[22px]" style={{ fontWeight: 510 }}>+{matches.length - 3} more items</span>
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className="flex items-center justify-between">
                <span className="text-[12px] px-[8px] py-[3px] rounded-full" style={{ backgroundColor: complBg, color: complColor, fontWeight: 590 }}>
                  {fulfilled} / {total} documents
                </span>
                <span className="flex items-center gap-[4px] text-[12px] text-[#764D2F] opacity-0 group-hover:opacity-100 transition-opacity" style={{ fontWeight: 590 }}>
                  Review <ChevronRight className="w-[12px] h-[12px]" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Package Detail View (full review + upload flow) ─── */
function PackageDetailView({ template, docs, onBack, onUploadForPackage, onGeneratePackage }: {
  template: PackageTemplate;
  docs: VaultDocument[];
  onBack: () => void;
  onUploadForPackage: (category: VaultCategory, nameHint: string) => void;
  onGeneratePackage: (docIds: string[], pkgName: string, email?: string) => void;
}) {
  const matches = getPackageMatches(docs, template);
  const fulfilled = matches.filter(m => m.matched).length;
  const total = matches.length;
  const completeness = total > 0 ? Math.round((fulfilled / total) * 100) : 0;
  const matchedDocIds = matches.filter(m => m.matched).map(m => m.matched!.id);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showShareSetup, setShowShareSetup] = useState(false);
  const complColor = completeness >= 80 ? '#3E6B3E' : completeness >= 40 ? '#8B7A3C' : '#8E3B3B';

  return (
    <div>
      {/* Header with back */}
      <div className="flex items-center gap-[12px] mb-[24px]">
        <button
          onClick={onBack}
          className="flex items-center gap-[6px] text-[14px] text-[#764D2F] hover:text-[#3E2D1D] transition-colors cursor-pointer"
          style={{ fontWeight: 510 }}
        >
          <ArrowLeft className="w-[16px] h-[16px]" />
          All Packages
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-[24px]">
        {/* Left: Package Info Card */}
        <div className="w-full xl:w-[340px] shrink-0">
          <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] sticky top-[24px]">
            <div className="flex items-center gap-[14px] mb-[20px]">
              <div className="w-[48px] h-[48px] rounded-[14px] flex items-center justify-center shrink-0" style={{ backgroundColor: template.bg }}>
                <Package className="w-[24px] h-[24px]" style={{ color: template.color }} />
              </div>
              <div>
                <p className={`${canela} text-[20px] text-[#3E2D1D]`}>{template.name}</p>
              </div>
            </div>
            <p className={`${sfMed} text-[13px] text-[#8C8780] mb-[24px]`} style={wdth}>{template.description}</p>

            {/* Progress ring */}
            <div className="flex items-center gap-[20px] mb-[24px] p-[16px] rounded-[14px] bg-[#FAFAF9]">
              <div className="relative shrink-0">
                <CircularProgress value={completeness} size={72} strokeWidth={6} color={complColor} />
                <span className="absolute inset-0 flex items-center justify-center text-[16px] text-[#3E2D1D]" style={{ fontWeight: 700 }}>{completeness}%</span>
              </div>
              <div>
                <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 590 }}>
                  {fulfilled} of {total} documents
                </p>
                <p className="text-[12px] text-[#8C8780] mt-[2px]" style={{ fontWeight: 510 }}>
                  {completeness >= 100 ? 'Package complete!' : completeness >= 80 ? 'Almost ready' : `${total - fulfilled} documents needed`}
                </p>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mb-[24px]">
              <p className="text-[11px] text-[#8C8780] mb-[10px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>CATEGORIES INVOLVED</p>
              <div className="flex flex-wrap gap-[6px]">
                {[...new Set(template.requiredDocs.map(r => r.category))].map(cat => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <span key={cat} className="text-[11px] px-[10px] py-[4px] rounded-full" style={{ backgroundColor: meta.bg, color: meta.color, fontWeight: 510 }}>{cat}</span>
                  );
                })}
              </div>
            </div>

            {/* Generate / Share section */}
            {!showShareSetup ? (
              <button
                onClick={() => {
                  if (matchedDocIds.length > 0) setShowShareSetup(true);
                }}
                disabled={matchedDocIds.length === 0}
                className={`w-full h-[44px] rounded-[10px] text-[14px] flex items-center justify-center gap-[8px] transition-colors cursor-pointer ${
                  matchedDocIds.length > 0
                    ? 'bg-[#3E2D1D] text-white hover:bg-[#764D2F]'
                    : 'bg-[#F5F3EF] text-[#C5C0B9] cursor-not-allowed'
                }`}
                style={{ fontWeight: 590 }}
              >
                <Link2 className="w-[16px] h-[16px]" />
                {matchedDocIds.length > 0 ? 'Generate Package Link' : 'Upload documents to generate'}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-[11px] text-[#8C8780] mb-[8px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>RECIPIENT (OPTIONAL)</p>
                <input
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="lender@example.com"
                  className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors mb-[12px]`}
                />
                <div className="flex gap-[8px]">
                  <button
                    onClick={() => setShowShareSetup(false)}
                    className="flex-1 h-[40px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] cursor-pointer hover:bg-[#F3EFE6] transition-colors"
                    style={{ fontWeight: 590 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => onGeneratePackage(matchedDocIds, template.name, recipientEmail)}
                    className="flex-1 h-[40px] rounded-[8px] bg-[#3E2D1D] text-white text-[14px] cursor-pointer hover:bg-[#764D2F] transition-colors flex items-center justify-center gap-[6px]"
                    style={{ fontWeight: 590 }}
                  >
                    <ExternalLink className="w-[14px] h-[14px]" /> Generate
                  </button>
                </div>

                {/* Security note */}
                <div className="flex items-start gap-[8px] mt-[12px] p-[10px] rounded-[8px] bg-[#F3EFE6]">
                  <Shield className="w-[14px] h-[14px] text-[#764D2F] mt-[1px] shrink-0" />
                  <p className="text-[11px] text-[#764D2F]" style={{ fontWeight: 510 }}>
                    Link expires in 30 days with 25 max views. Revocable anytime.
                  </p>
                </div>
              </motion.div>
            )}

            {completeness < 100 && matchedDocIds.length > 0 && !showShareSetup && (
              <p className="text-[11px] text-[#8C8780] text-center mt-[8px]" style={{ fontWeight: 510 }}>
                You can share a partial package — missing documents are marked.
              </p>
            )}
          </div>
        </div>

        {/* Right: Document checklist */}
        <div className="flex-1 min-w-0">
          <p className="text-[11px] text-[#8C8780] mb-[14px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>REQUIRED DOCUMENTS ({fulfilled}/{total} FULFILLED)</p>

          <div className="flex flex-col gap-[10px]">
            {matches.map(({ req, matched }) => (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-[16px] border p-[20px] transition-colors ${
                  matched ? 'bg-white border-[#D0D0D0]' : 'bg-[#FFFCF8] border-[#E8DECE] border-dashed'
                }`}
              >
                <div className="flex items-start gap-[14px]">
                  {/* Status indicator */}
                  <div className={`w-[32px] h-[32px] rounded-[10px] flex items-center justify-center shrink-0 mt-[2px] ${
                    matched ? 'bg-[#EEF5EE]' : 'bg-[#FFF8E6]'
                  }`}>
                    {matched ? (
                      <CheckCircle className="w-[16px] h-[16px] text-[#3E6B3E]" />
                    ) : (
                      <AlertCircle className="w-[16px] h-[16px] text-[#8B7A3C]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-[12px]">
                      <div>
                        <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{req.name}</p>
                        <p className="text-[12px] text-[#8C8780] mt-[2px]" style={{ fontWeight: 510 }}>{req.description}</p>
                      </div>
                      <span className="text-[11px] px-[8px] py-[3px] rounded-full shrink-0" style={{
                        backgroundColor: CATEGORY_META[req.category].bg,
                        color: CATEGORY_META[req.category].color,
                        fontWeight: 510,
                      }}>{req.category}</span>
                    </div>

                    {/* Matched document details */}
                    {matched ? (
                      <div className="mt-[12px] flex items-center gap-[10px] p-[10px] rounded-[10px] bg-[#FAFAF9]">
                        <div className="w-[28px] h-[28px] rounded-[6px] flex items-center justify-center shrink-0" style={{ backgroundColor: getFileTypeStyle(matched.fileType).bg }}>
                          <span className="text-[9px]" style={{ fontWeight: 700, color: getFileTypeStyle(matched.fileType).color }}>{matched.fileType}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] text-[#3E2D1D] truncate" style={{ fontWeight: 510 }}>{matched.name}</p>
                          <p className="text-[11px] text-[#8C8780]" style={{ fontWeight: 510 }}>{matched.fileSize} | Uploaded {matched.uploadedAt}</p>
                        </div>
                        <CheckCircle className="w-[14px] h-[14px] text-[#3E6B3E] shrink-0" />
                      </div>
                    ) : (
                      <div className="mt-[12px]">
                        <button
                          onClick={() => onUploadForPackage(req.category, req.name)}
                          className="flex items-center gap-[8px] h-[36px] px-[16px] rounded-[8px] border-[1.5px] border-dashed border-[#764D2F] text-[13px] text-[#764D2F] cursor-pointer hover:bg-[#F3EFE6] transition-colors"
                          style={{ fontWeight: 590 }}
                        >
                          <Plus className="w-[14px] h-[14px]" />
                          Upload {req.name}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Package Share Success ─── */
function PackageShareSuccess({ link, pkgName, onBack }: {
  link: VaultShareLink;
  pkgName: string;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/share/vault/${link.token}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[560px] mx-auto"
    >
      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[32px] sm:p-[40px] text-center">
        {/* Success icon */}
        <div className="w-[64px] h-[64px] rounded-full bg-[#EEF5EE] flex items-center justify-center mx-auto mb-[20px]">
          <CheckCircle className="w-[28px] h-[28px] text-[#3E6B3E]" />
        </div>
        <p className={`${canela} text-[24px] text-[#3E2D1D] mb-[6px]`}>Package Link Created</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780] mb-[28px]`} style={wdth}>
          Your <strong className="text-[#3E2D1D]">{pkgName}</strong> is ready to share with your lender.
        </p>

        {/* Link display */}
        <div className="bg-[#FAFAF9] rounded-[12px] p-[14px] mb-[20px]">
          <p className="text-[11px] text-[#8C8780] mb-[8px] text-left" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>SHAREABLE LINK</p>
          <div className="flex items-center gap-[10px]">
            <div className="flex-1 bg-white rounded-[8px] border border-[#E8E4DD] px-[12px] py-[10px]">
              <p className="text-[13px] text-[#3E2D1D] truncate text-left" style={{ fontWeight: 510 }}>{shareUrl}</p>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-[6px] h-[40px] px-[16px] rounded-[8px] bg-[#3E2D1D] text-white text-[13px] cursor-pointer hover:bg-[#764D2F] transition-colors shrink-0"
              style={{ fontWeight: 590 }}
            >
              {copied ? <Check className="w-[14px] h-[14px]" /> : <Copy className="w-[14px] h-[14px]" />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Link info */}
        <div className="flex justify-center gap-[20px] text-[12px] text-[#8C8780] mb-[24px]" style={{ fontWeight: 510 }}>
          <span className="flex items-center gap-[4px]"><Clock className="w-[12px] h-[12px]" /> Expires {link.expiresAt}</span>
          <span className="flex items-center gap-[4px]"><Eye className="w-[12px] h-[12px]" /> {link.maxAccess} max views</span>
          <span className="flex items-center gap-[4px]"><FileText className="w-[12px] h-[12px]" /> {link.documentIds.length} docs</span>
        </div>

        {/* Open lender preview */}
        <div className="flex flex-col sm:flex-row gap-[10px] justify-center">
          <Link
            to={`/share/vault/${link.token}`}
            className="inline-flex items-center justify-center gap-[8px] h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#3E2D1D] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer no-underline"
            style={{ fontWeight: 590 }}
          >
            <ExternalLink className="w-[14px] h-[14px]" /> Preview Lender View
          </Link>
          <button
            onClick={onBack}
            className="h-[40px] px-[20px] rounded-[8px] bg-[#3E2D1D] text-white text-[14px] hover:bg-[#764D2F] transition-colors cursor-pointer"
            style={{ fontWeight: 590 }}
          >
            Done
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Shared Links View ─── */
function SharedLinksView({
  shareLinks, docs, onRevoke, onCopyLink, copiedLink,
}: {
  shareLinks: VaultShareLink[];
  docs: VaultDocument[];
  onRevoke: (id: string) => void;
  onCopyLink: (token: string) => void;
  copiedLink: string | null;
}) {
  if (shareLinks.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[48px] sm:p-[60px] text-center">
        <div className="w-[56px] h-[56px] rounded-[14px] bg-[#F3EFE6] flex items-center justify-center mx-auto mb-[20px]">
          <Link2 className="w-[24px] h-[24px] text-[#764D2F]" />
        </div>
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>No shared links</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780] max-w-[360px] mx-auto`} style={wdth}>
          Share documents or packages to generate secure, expiring links.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      {shareLinks.map(link => {
        const linkDocs = link.documentIds.map(id => docs.find(d => d.id === id)).filter(Boolean) as VaultDocument[];
        const isExpired = new Date(link.expiresAt) < new Date();
        const isRevoked = !link.isActive;
        const statusColor = isRevoked ? '#8E3B3B' : isExpired ? '#8B7A3C' : '#3E6B3E';
        const statusBg = isRevoked ? '#F8EDED' : isExpired ? '#FFF8E6' : '#EEF5EE';
        const statusText = isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active';

        return (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[20px] border border-[#D0D0D0] p-[20px]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[12px] mb-[12px]">
              <div className="flex items-center gap-[10px]">
                <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F3EFE6] flex items-center justify-center shrink-0">
                  {link.packageName ? <Package className="w-[16px] h-[16px] text-[#764D2F]" /> : <Link2 className="w-[16px] h-[16px] text-[#764D2F]" />}
                </div>
                <div>
                  <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{link.packageName || `${linkDocs.length} Document${linkDocs.length !== 1 ? 's' : ''}`}</p>
                  <p className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>
                    {link.recipientEmail && <span>{link.recipientEmail} | </span>}
                    Created {link.createdAt}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="text-[11px] px-[8px] py-[2px] rounded-full" style={{ backgroundColor: statusBg, color: statusColor, fontWeight: 590 }}>{statusText}</span>
                {link.isActive && !isExpired && (
                  <>
                    <Link
                      to={`/share/vault/${link.token}`}
                      className="flex items-center gap-[6px] h-[32px] px-[10px] rounded-[8px] border border-[#D0D0D0] text-[12px] text-[#3E2D1D] cursor-pointer hover:bg-[#F3EFE6] transition-colors no-underline"
                      style={{ fontWeight: 590 }}
                    >
                      <ExternalLink className="w-[12px] h-[12px]" />
                    </Link>
                    <button
                      onClick={() => onCopyLink(link.token)}
                      className="flex items-center gap-[6px] h-[32px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[12px] text-[#3E2D1D] cursor-pointer hover:bg-[#F3EFE6] transition-colors"
                      style={{ fontWeight: 590 }}
                    >
                      {copiedLink === link.token ? <Check className="w-[12px] h-[12px] text-green-600" /> : <Copy className="w-[12px] h-[12px]" />}
                      {copiedLink === link.token ? 'Copied' : 'Copy Link'}
                    </button>
                    <button
                      onClick={() => onRevoke(link.id)}
                      className="h-[32px] px-[12px] rounded-[8px] border border-red-200 text-[12px] text-red-500 cursor-pointer hover:bg-red-50 transition-colors"
                      style={{ fontWeight: 590 }}
                    >
                      Revoke
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Link details */}
            <div className="flex flex-wrap gap-[16px] text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>
              <span className="flex items-center gap-[4px]"><Clock className="w-[12px] h-[12px]" /> Expires {link.expiresAt}</span>
              <span className="flex items-center gap-[4px]"><Eye className="w-[12px] h-[12px]" /> {link.accessCount} / {link.maxAccess} views</span>
              <span className="flex items-center gap-[4px]"><FileText className="w-[12px] h-[12px]" /> {linkDocs.length} documents</span>
            </div>

            {/* Document list */}
            {linkDocs.length > 0 && (
              <div className="mt-[12px] flex flex-wrap gap-[6px]">
                {linkDocs.map(d => (
                  <span key={d.id} className="text-[11px] px-[8px] py-[3px] rounded-[6px] bg-[#FAFAF9] text-[#3E2D1D] border border-[#E8E4DD]" style={{ fontWeight: 510 }}>{d.name}</span>
                ))}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Upload Modal ─── */
function UploadModal({ onClose, onUpload, folders, properties, preset }: {
  onClose: () => void;
  onUpload: (doc: Omit<VaultDocument, 'id'>) => VaultDocument;
  folders: VaultFolder[];
  properties: { id: string; name: string }[];
  preset?: { category?: VaultCategory; nameHint?: string } | null;
}) {
  const [name, setName] = useState(preset?.nameHint || '');
  const [category, setCategory] = useState<VaultCategory>(preset?.category || 'Identity');
  const [fileType, setFileType] = useState('PDF');
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');
  const [propertyId, setPropertyId] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file.name);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ''));
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileType(ext);
    }
  }, [name]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      if (!name) setName(file.name.replace(/\.[^/.]+$/, ''));
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileType(ext);
    }
  };

  const handleSubmit = () => {
    if (!name.trim()) return;
    const sizes = ['0.8 MB', '1.2 MB', '2.4 MB', '3.1 MB', '0.5 MB', '4.7 MB', '1.8 MB'];
    onUpload({
      name: name.trim() + (fileType ? `.${fileType.toLowerCase()}` : ''),
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      fileType,
      fileSize: sizes[Math.floor(Math.random() * sizes.length)],
      uploadedAt: new Date().toISOString().split('T')[0],
      notes: notes || undefined,
      propertyId: propertyId || undefined,
    });
    onClose();
  };

  const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C8780' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[20px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <div>
              <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Upload Document</p>
              {preset?.nameHint && (
                <p className={`${sfMed} text-[12px] text-[#764D2F] mt-[4px]`} style={wdth}>For package: {preset.nameHint}</p>
              )}
            </div>
            <button onClick={onClose} className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center hover:bg-[#F3EFE6] cursor-pointer text-[#8C8780]">
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-[14px] p-[32px] text-center cursor-pointer transition-colors mb-[20px] ${
              dragOver ? 'border-[#764D2F] bg-[#F3EFE6]' : uploadedFile ? 'border-[#3E6B3E] bg-[#F8FDF8]' : 'border-[#D0D0D0] hover:border-[#764D2F] hover:bg-[#FDFBF8]'
            }`}
          >
            <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileSelect} accept=".pdf,.xlsx,.xls,.docx,.doc,.png,.jpg,.jpeg,.csv" />
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-[10px]">
                <Check className="w-[20px] h-[20px] text-[#3E6B3E]" />
                <span className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{uploadedFile}</span>
              </div>
            ) : (
              <>
                <Upload className="w-[28px] h-[28px] text-[#B5B0A8] mx-auto mb-[10px]" />
                <p className="text-[14px] text-[#3E2D1D] mb-[4px]" style={{ fontWeight: 510 }}>Drag & drop your file here</p>
                <p className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>or click to browse | PDF, XLSX, DOCX, PNG, JPG, CSV</p>
              </>
            )}
          </div>

          {/* Form */}
          <div className="flex flex-col gap-[14px]">
            <ModalField label="Document Name">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. 2025_Tax_Return"
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
              />
            </ModalField>

            <div className="grid grid-cols-2 gap-[12px]">
              <ModalField label="Category">
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as VaultCategory)}
                  className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                  style={selectStyle}
                >
                  {DEFAULT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </ModalField>

              <ModalField label="File Type">
                <select
                  value={fileType}
                  onChange={e => setFileType(e.target.value)}
                  className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                  style={selectStyle}
                >
                  {['PDF', 'XLSX', 'DOCX', 'PNG', 'JPG', 'CSV'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </ModalField>
            </div>

            <ModalField label="Link to Property (optional)">
              <select
                value={propertyId}
                onChange={e => setPropertyId(e.target.value)}
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                style={selectStyle}
              >
                <option value="">None</option>
                {properties.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </ModalField>

            <ModalField label="Tags (comma-separated)">
              <input
                value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="e.g. 2025, federal, personal"
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
              />
            </ModalField>

            <ModalField label="Notes (optional)">
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Additional notes about this document..."
                rows={2}
                className={`${figtree} w-full px-[12px] py-[10px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] resize-none transition-colors`}
              />
            </ModalField>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-[10px] mt-[24px]">
            <button onClick={onClose} className="h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#D0D0D0] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!name.trim()}
              className={`h-[40px] px-[24px] rounded-[8px] text-[14px] text-white transition-colors cursor-pointer ${name.trim() ? 'bg-[#3E2D1D] hover:bg-[#764D2F]' : 'bg-[#C5C0B9] cursor-not-allowed'}`}
              style={{ fontWeight: 590 }}
            >
              Upload Document
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Share Modal ─── */
function ShareModal({ onClose, docIds, docs, onCreateLink }: {
  onClose: () => void;
  docIds: string[];
  docs: VaultDocument[];
  onCreateLink: (link: Omit<VaultShareLink, 'id' | 'token' | 'accessCount' | 'createdAt'>) => VaultShareLink;
}) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [packageName, setPackageName] = useState('');
  const [expiryDays, setExpiryDays] = useState(7);
  const [maxAccess, setMaxAccess] = useState(10);
  const [created, setCreated] = useState<VaultShareLink | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedDocs = docIds.map(id => docs.find(d => d.id === id)).filter(Boolean) as VaultDocument[];

  const handleCreate = () => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);
    const link = onCreateLink({
      documentIds: docIds,
      packageName: packageName || undefined,
      expiresAt: expiresAt.toISOString().split('T')[0],
      maxAccess,
      recipientEmail: recipientEmail || undefined,
      isActive: true,
    });
    setCreated(link);
  };

  const handleCopy = () => {
    if (created) {
      const url = `${window.location.origin}/share/vault/${created.token}`;
      navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C8780' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[20px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <div className="flex items-center gap-[10px]">
              <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F3EFE6] flex items-center justify-center">
                <Lock className="w-[18px] h-[18px] text-[#764D2F]" />
              </div>
              <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Secure Share</p>
            </div>
            <button onClick={onClose} className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center hover:bg-[#F3EFE6] cursor-pointer text-[#8C8780]">
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          {!created ? (
            <>
              {/* Selected docs */}
              <div className="bg-[#FAFAF9] rounded-[12px] p-[14px] mb-[20px]">
                <p className="text-[11px] text-[#8C8780] mb-[8px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>SHARING {selectedDocs.length} DOCUMENT{selectedDocs.length !== 1 ? 'S' : ''}</p>
                <div className="flex flex-wrap gap-[6px]">
                  {selectedDocs.map(d => (
                    <span key={d.id} className="text-[12px] px-[8px] py-[3px] rounded-[6px] bg-white border border-[#E8E4DD] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{d.name}</span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-[14px]">
                <ModalField label="Package Name (optional)">
                  <input
                    value={packageName}
                    onChange={e => setPackageName(e.target.value)}
                    placeholder="e.g. Loan Application Package"
                    className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
                  />
                </ModalField>

                <ModalField label="Recipient Email (optional)">
                  <input
                    value={recipientEmail}
                    onChange={e => setRecipientEmail(e.target.value)}
                    placeholder="lender@example.com"
                    className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
                  />
                </ModalField>

                <div className="grid grid-cols-2 gap-[12px]">
                  <ModalField label="Link Expires In">
                    <select
                      value={expiryDays}
                      onChange={e => setExpiryDays(Number(e.target.value))}
                      className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                      style={selectStyle}
                    >
                      <option value={1}>1 day</option>
                      <option value={3}>3 days</option>
                      <option value={7}>7 days</option>
                      <option value={14}>14 days</option>
                      <option value={30}>30 days</option>
                      <option value={90}>90 days</option>
                    </select>
                  </ModalField>

                  <ModalField label="Max Access">
                    <select
                      value={maxAccess}
                      onChange={e => setMaxAccess(Number(e.target.value))}
                      className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                      style={selectStyle}
                    >
                      <option value={1}>1 view</option>
                      <option value={5}>5 views</option>
                      <option value={10}>10 views</option>
                      <option value={25}>25 views</option>
                      <option value={100}>100 views</option>
                    </select>
                  </ModalField>
                </div>
              </div>

              {/* Security note */}
              <div className="flex items-start gap-[10px] mt-[16px] p-[12px] rounded-[10px] bg-[#F3EFE6]">
                <ShieldIcon />
                <p className="text-[12px] text-[#764D2F]" style={{ fontWeight: 510 }}>
                  Links are encrypted and expire automatically. You can revoke access at any time from the Shared Links tab.
                </p>
              </div>

              <div className="flex justify-end gap-[10px] mt-[24px]">
                <button onClick={onClose} className="h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#D0D0D0] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Cancel</button>
                <button
                  onClick={handleCreate}
                  className="h-[40px] px-[24px] rounded-[8px] bg-[#3E2D1D] text-white text-[14px] hover:bg-[#764D2F] transition-colors cursor-pointer"
                  style={{ fontWeight: 590 }}
                >
                  Generate Secure Link
                </button>
              </div>
            </>
          ) : (
            /* Success state */
            <div className="text-center py-[12px]">
              <div className="w-[56px] h-[56px] rounded-full bg-[#EEF5EE] flex items-center justify-center mx-auto mb-[16px]">
                <Check className="w-[24px] h-[24px] text-[#3E6B3E]" />
              </div>
              <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[6px]`}>Link Created</p>
              <p className={`${sfMed} text-[14px] text-[#8C8780] mb-[20px]`} style={wdth}>Your secure link is ready to share.</p>

              <div className="flex items-center gap-[8px] bg-[#FAFAF9] rounded-[10px] p-[12px] mb-[16px]">
                <span className="flex-1 text-[13px] text-[#3E2D1D] truncate text-left" style={{ fontWeight: 510 }}>
                  {window.location.origin}/share/vault/{created.token}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-[6px] h-[32px] px-[14px] rounded-[8px] bg-[#3E2D1D] text-white text-[12px] cursor-pointer hover:bg-[#764D2F] transition-colors shrink-0"
                  style={{ fontWeight: 590 }}
                >
                  {copied ? <Check className="w-[12px] h-[12px]" /> : <Copy className="w-[12px] h-[12px]" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className="flex justify-center gap-[16px] text-[12px] text-[#8C8780] mb-[20px]" style={{ fontWeight: 510 }}>
                <span className="flex items-center gap-[4px]"><Clock className="w-[12px] h-[12px]" /> Expires {created.expiresAt}</span>
                <span className="flex items-center gap-[4px]"><Eye className="w-[12px] h-[12px]" /> {created.maxAccess} max views</span>
              </div>

              <button onClick={onClose} className="h-[40px] px-[24px] rounded-[8px] border-[1.5px] border-[#3E2D1D] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Done</button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Folder Modal ─── */
function FolderModal({ onClose, onCreateFolder }: {
  onClose: () => void;
  onCreateFolder: (f: Omit<VaultFolder, 'id' | 'createdAt'>) => VaultFolder;
}) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState<VaultCategory>('Custom');
  const [description, setDescription] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreateFolder({ name: name.trim(), category, description: description || undefined });
    onClose();
  };

  const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%238C8780' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-[20px] w-full max-w-[420px]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-[24px]">
          <div className="flex items-center justify-between mb-[20px]">
            <p className={`${canela} text-[24px] text-[#3E2D1D]`}>New Folder</p>
            <button onClick={onClose} className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center hover:bg-[#F3EFE6] cursor-pointer text-[#8C8780]">
              <X className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="flex flex-col gap-[14px]">
            <ModalField label="Folder Name">
              <input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Texas Properties"
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
                autoFocus
              />
            </ModalField>

            <ModalField label="Category">
              <select
                value={category}
                onChange={e => setCategory(e.target.value as VaultCategory)}
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] outline-none focus:border-[#764D2F] bg-white cursor-pointer appearance-none`}
                style={selectStyle}
              >
                {[...DEFAULT_CATEGORIES, 'Custom' as VaultCategory].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </ModalField>

            <ModalField label="Description (optional)">
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="What goes in this folder?"
                className={`${figtree} w-full h-[40px] px-[12px] rounded-[8px] border border-[#D0D0D0] text-[14px] text-[#3E2D1D] placeholder:text-[#B5B0A8] outline-none focus:border-[#764D2F] transition-colors`}
              />
            </ModalField>
          </div>

          <div className="flex justify-end gap-[10px] mt-[24px]">
            <button onClick={onClose} className="h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#D0D0D0] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className={`h-[40px] px-[24px] rounded-[8px] text-[14px] text-white transition-colors cursor-pointer ${name.trim() ? 'bg-[#3E2D1D] hover:bg-[#764D2F]' : 'bg-[#C5C0B9] cursor-not-allowed'}`}
              style={{ fontWeight: 590 }}
            >
              Create Folder
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Helper: Modal Field Wrapper ─── */
function ModalField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[12px] text-[#8C8780] mb-[6px]" style={{ fontWeight: 590, letterSpacing: '0.3px' }}>{label}</label>
      {children}
    </div>
  );
}
