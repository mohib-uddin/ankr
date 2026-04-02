import React, { useState, useRef, useMemo, useCallback, useEffect, type CSSProperties } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Upload, Search, FolderPlus, Link2, FileText, Shield,
  Trash2, Tag, Eye, Copy, Check, X,
  Clock, Lock, Download, MoreHorizontal,
  Package, ChevronRight, ArrowLeft, AlertCircle,
  CheckCircle, Circle, Plus, ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { useForm } from 'react-hook-form';
import { useApp } from '@/app/context/AppContext';
import type { VaultCategory, VaultDocument, VaultFolder, VaultShareLink } from '@/app/context/AppContext';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { getFileUrl } from '@/shared/utils/file-url';
import {
  useCreateDocumentMutation,
  useCreateFolderMutation,
  useDeleteDocumentMutation,
  useDeleteFolderMutation,
  useInfiniteDocumentsQuery,
  useFoldersQuery,
  useUpdateDocumentMutation,
} from '@/features/vault/services/documents.service';
import {
  useDeleteUserPackageMutation,
  useDocumentCountsQuery,
  usePackageTemplatesQuery,
  useUpsertUserPackageMutation,
  useUserPackagesQuery,
} from '@/features/vault/services/packages.service';
import type { BackendPackageTemplate, BackendUserPackage } from '@/features/vault/types/packages.types';
import svgPaths from '@/icons/dashboard-shared';
import packageIconAsset from '@/assets/figma/documents-package/package-icon.svg';
import listRadioAsset from '@/assets/figma/documents-package/list-radio.svg';
import closeIconAsset from '@/assets/figma/documents-package/close-icon.svg';

/* ─── Font tokens (matching Budget/Draw tabs exactly) ─── */
const canela  = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const sfMed   = "font-['SF_Pro',sans-serif] font-[510]";

const figtree = "font-['Figtree',sans-serif] font-normal";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };
const invoiceModalInputClass = "w-full h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] text-[14px] text-[#333] placeholder:text-[#767676] outline-none focus:border-[#764D2F] transition-colors";
const invoiceModalLabelClass = "block text-[14px] text-[#333] mb-[6px]";
const invoiceModalLabelStyle: CSSProperties = { fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 400 };
const invoiceSelectTriggerBase =
  "!h-[46px] !rounded-[8px] !border !border-[#D0D0D0] !bg-white !px-[12px] !text-[14px] !shadow-none data-[placeholder]:!text-[#767676] focus-visible:!ring-0 focus-visible:!border-[#764D2F] [&_svg]:!text-[#767676] [&_svg]:!opacity-100";
const invoiceSelectContentBase =
  "!bg-white !border !border-[#D0D0D0] !rounded-[8px] !shadow-none !p-[4px]";
const invoiceSelectItemBase =
  "!text-[14px] !text-[#3E2D1D] !rounded-[6px] !px-[10px] !py-[8px] data-[highlighted]:!bg-[#FCF6F0] data-[highlighted]:!text-[#3E2D1D] data-[state=checked]:!bg-[#F3EFE6] data-[state=checked]:!text-[#764D2F]";
const POPULAR_TAGS = ['Urgent', 'Lender', '2026', 'Tax', 'ID', 'Loan'];

function formatDate(dateIso: string): string {
  const parsed = new Date(dateIso);
  if (Number.isNaN(parsed.getTime())) return dateIso;
  return parsed.toISOString().split('T')[0];
}

function getFileTypeFromPath(path: string): string {
  const ext = path.split('.').pop()?.toUpperCase();
  return ext && ext.length <= 5 ? ext : 'FILE';
}

function CategorySelectItemLabel({ category }: { category: string }) {
  return (
    <span className="inline-flex items-center gap-[8px]">
      <span className="w-[18px] h-[18px] rounded-[6px] bg-[#F3EFE6] flex items-center justify-center">
        <FolderIcon size={12} />
      </span>
      <span>{category}</span>
    </span>
  );
}

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
  minCount?: number;
  maxCount?: number;
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

function toVaultCategory(category: string): VaultCategory {
  if (DEFAULT_CATEGORIES.includes(category as VaultCategory)) {
    return category as VaultCategory;
  }
  return 'Custom';
}

function mapBackendTemplateToUi(template: BackendPackageTemplate, index: number): PackageTemplate {
  const palette = [
    { icon: 'loan', color: '#764D2F', bg: '#F3EFE6' },
    { icon: 'refi', color: '#2D5A8E', bg: '#EDF2F8' },
    { icon: 'tax', color: '#5A5A2D', bg: '#F2F2E8' },
    { icon: 'audit', color: '#5A3D8E', bg: '#F0ECF5' },
  ];
  const tone = palette[index % palette.length];

  return {
    id: template.id,
    name: template.name,
    description: template.description || '',
    icon: tone.icon,
    color: tone.color,
    bg: tone.bg,
    requiredDocs: (template.items || []).map((item) => ({
      id: item.id,
      name: item.name,
      category: toVaultCategory(item.category),
      keywords: [item.name, item.description, item.category].filter(Boolean),
      description: item.description || item.name,
      minCount: item.minCount,
      maxCount: item.maxCount,
    })),
  };
}

function generatePackageOtpCode(): string {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

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

function PackageCardProgress({ value, total }: { value: number; total: number }) {
  const badgeSize = 70;
  const ringSize = 49.497;
  const stroke = 3.86416;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const visibleProgress = progress > 0 ? progress : 0.018; // tiny cap to match Figma idle dot
  const dash = circumference * visibleProgress;

  return (
    <div className="relative w-[70px] h-[70px] shrink-0">
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className="absolute left-[10.25px] top-[10.25px]"
      >
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="#E8E8E8"
          strokeWidth={stroke}
        />
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          fill="none"
          stroke="#764D2F"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
        />
      </svg>
      <p
        className="absolute inset-0 flex items-center justify-center text-[#764D2F] leading-none"
        style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590, fontSize: '12.14px' }}
      >
        {value}/{total}
      </p>
    </div>
  );
}

function DetailProgressBadge({ percent }: { percent: number }) {
  const ringSize = 67.175;
  const stroke = 5.242;
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.max(0, Math.min(1, percent / 100));
  const visibleProgress = progress > 0 ? progress : 0.018;
  const dash = circumference * visibleProgress;
  const isFull = progress >= 0.999;

  return (
    <div className="relative w-[95px] h-[95px] shrink-0">
      <svg
        width={ringSize}
        height={ringSize}
        viewBox={`0 0 ${ringSize} ${ringSize}`}
        className="absolute left-[13.91px] top-[13.91px]"
      >
        <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="#E8E8E8" strokeWidth={stroke} />
        {isFull ? (
          <circle cx={ringSize / 2} cy={ringSize / 2} r={radius} fill="none" stroke="#764D2F" strokeWidth={stroke} />
        ) : (
          <circle
            cx={ringSize / 2}
            cy={ringSize / 2}
            r={radius}
            fill="none"
            stroke="#764D2F"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`}
          />
        )}
      </svg>
      <p className="absolute inset-0 flex items-center justify-center text-[#764D2F] leading-none" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590, fontSize: '21.149px' }}>
        {percent}%
      </p>
    </div>
  );
}

/* ─── Main Component ─── */
type Tab = 'documents' | 'packages' | 'shared';

export function DocumentVault() {
  const { state, addVaultShareLink } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('documents');
  const [activeCategory, setActiveCategory] = useState<VaultCategory | 'all'>('all');
  const [activeFolderId, setActiveFolderId] = useState<string | null>(null);
  const intersectionRef = useRef<HTMLDivElement | null>(null);

  const isFiltered = activeCategory !== 'all' || activeFolderId !== null;

  const documentsQuery = useInfiniteDocumentsQuery(
    isFiltered && activeFolderId
      ? { folderId: activeFolderId }
      : isFiltered && activeCategory !== 'all'
        ? { category: activeCategory === 'Custom' ? undefined : (activeCategory as VaultCategory) }
        : undefined,
  );

  const {
    data: documentsPages,
    isLoading: documentsLoading,
    isError: documentsError,
    error: documentsErrorObj,
    hasNextPage: documentsHasNextPage,
    isFetchingNextPage: documentsFetchingNextPage,
    fetchNextPage: documentsFetchNextPage,
  } = documentsQuery;
  const foldersQuery = useFoldersQuery();
  const createDocumentMutation = useCreateDocumentMutation();
  const updateDocumentMutation = useUpdateDocumentMutation();
  const deleteDocumentMutation = useDeleteDocumentMutation();
  const createFolderMutation = useCreateFolderMutation();
  const deleteFolderMutation = useDeleteFolderMutation();
  const packageTemplatesQuery = usePackageTemplatesQuery();
  const userPackagesQuery = useUserPackagesQuery();
  const upsertUserPackageMutation = useUpsertUserPackageMutation();
  const deleteUserPackageMutation = useDeleteUserPackageMutation();
  const documentCountsQuery = useDocumentCountsQuery();

  useEffect(() => {
    const target = intersectionRef.current;
    if (!target || !documentsHasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && documentsHasNextPage && !documentsFetchingNextPage) {
          documentsFetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [documentsHasNextPage, documentsFetchingNextPage, documentsFetchNextPage]);

  const docs = useMemo<VaultDocument[]>(() => {
    const pages = documentsPages?.pages ?? [];
    const raw = pages.flatMap(page => page.data ?? []);
    return raw.map((doc) => ({
      id: doc.id,
      name: doc.name,
      category: doc.category,
      folderId: doc.folderId ?? undefined,
      tags: doc.tags ?? [],
      fileType: getFileTypeFromPath(doc.filePath),
      fileSize: '--',
      uploadedAt: formatDate(doc.createdAt),
      notes: doc.notes ?? undefined,
      propertyId: doc.linkedPropertyId ?? undefined,
    }));
  }, [documentsQuery.data]);

  const documentUrlById = useMemo<Record<string, string>>(() => {
    const pages = documentsPages?.pages ?? [];
    const raw = pages.flatMap(page => page.data ?? []);
    return raw.reduce<Record<string, string>>((acc, doc) => {
      acc[doc.id] = getFileUrl(doc.filePath);
      return acc;
    }, {});
  }, [documentsPages]);

  const folders = useMemo<VaultFolder[]>(() => {
    const raw = foldersQuery.data?.data ?? [];
    return raw.map((folder) => ({
      id: folder.id,
      name: folder.name,
      category: 'Custom',
      createdAt: formatDate(folder.createdAt),
    }));
  }, [foldersQuery.data]);

  const backendPackages = useMemo(() => userPackagesQuery.data?.data ?? [], [userPackagesQuery.data]);

  const packageTemplates = useMemo(() => {
    const backendTemplates = packageTemplatesQuery.data?.data ?? [];
    return backendTemplates.map(mapBackendTemplateToUi);
  }, [packageTemplatesQuery.data]);
  const packageTemplatesError = packageTemplatesQuery.isError ? getApiErrorMessage(packageTemplatesQuery.error) : null;
  const sharedLinksError = userPackagesQuery.isError ? getApiErrorMessage(userPackagesQuery.error) : null;
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
  const [shareDocIds, setShareDocIds] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [uploadPreset, setUploadPreset] = useState<{ category?: VaultCategory; nameHint?: string } | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [underline, setUnderline] = useState({ left: 0, width: 0 });

  // Filter documents
  const filteredDocs = useMemo(() => {
    let result = docs;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.tags.some(t => t.toLowerCase().includes(q)) ||
        d.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [docs, searchQuery]);

  // Count per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    DEFAULT_CATEGORIES.forEach((category) => {
      counts[category] = 0;
    });

    const backendCounts = documentCountsQuery.data?.data.categories ?? [];
    backendCounts.forEach((item) => {
      const category = toVaultCategory(item.category);
      if (category === 'Custom') return;
      counts[category] = item.count;
    });

    return counts;
  }, [documentCountsQuery.data]);

  const totalDocumentCount = useMemo(() => {
    const backendCounts = documentCountsQuery.data?.data.categories ?? [];
    return backendCounts.reduce((sum, item) => sum + item.count, 0);
  }, [documentCountsQuery.data]);

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
    selectedDocs.forEach((id) => {
      deleteDocumentMutation.mutate(id);
    });
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

  const tabs: { id: Tab; label: string }[] = [
    { id: 'documents', label: 'All Document' },
    { id: 'packages', label: 'Document Packages' },
    { id: 'shared', label: 'Shared Links' },
  ];

  useEffect(() => {
    const updateUnderline = () => {
      const idx = tabs.findIndex(t => t.id === activeTab);
      const el = tabRefs.current[idx];
      if (!el) return;
      setUnderline({ left: el.offsetLeft, width: el.offsetWidth });
    };

    updateUnderline();
    window.addEventListener('resize', updateUnderline);
    return () => window.removeEventListener('resize', updateUnderline);
  }, [activeTab]);

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
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        className="content-stretch flex flex-col gap-[18px] items-start relative shrink-0 w-full mb-[24px]"
      >
        <div className="content-stretch flex gap-[24px] sm:gap-[52px] items-center leading-[normal] px-[8px] sm:px-[20px] relative shrink-0 text-[16px] sm:text-[18px] text-center whitespace-nowrap overflow-x-auto">
          {tabs.map((tab, idx) => (
            <button
              key={tab.id}
              ref={el => { tabRefs.current[idx] = el; }}
              onClick={() => setActiveTab(tab.id)}
              className="cursor-pointer relative shrink-0 transition-colors"
              style={{
                fontWeight: activeTab === tab.id ? 700 : 510,
                color: activeTab === tab.id ? '#3e2d1d' : '#764d2f',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="bg-[#d9d9d9] h-[3px] relative shrink-0 w-full">
          <motion.div
            className="h-full bg-[#3e2d1d] absolute top-0"
            animate={{ left: underline.left, width: underline.width }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          />
        </div>
      </motion.div>

      {/* ─── Tab Content ─── */}
      <AnimatePresence mode="wait">
        {activeTab === 'documents' && (
          <motion.div key="docs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <DocumentsView
              docs={filteredDocs}
              allDocs={docs}
              totalDocumentCount={totalDocumentCount}
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
              onUpload={() => { setUploadPreset(null); setShowUploadModal(true); }}
              onDelete={(id) => deleteDocumentMutation.mutate(id)}
              onView={(id) => {
                const url = documentUrlById[id];
                if (!url) return;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              deleteFolder={(id) => deleteFolderMutation.mutate(id)}
              activeFolderId={activeFolderId}
              setActiveFolderId={setActiveFolderId}
              isLoading={documentsLoading}
              isError={documentsError}
              error={documentsErrorObj}
              hasNextPage={documentsHasNextPage}
              isFetchingNextPage={documentsFetchingNextPage}
              intersectionRef={intersectionRef}
            />
          </motion.div>
        )}
        {activeTab === 'packages' && (
          <motion.div key="pkgs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <PackagesView
              docs={docs}
              templates={packageTemplates}
              isTemplatesLoading={packageTemplatesQuery.isLoading}
              templatesError={packageTemplatesError}
              onUploadForPackage={openUploadForPackage}
              isSubmitting={upsertUserPackageMutation.isPending}
              onGeneratePackage={async ({ template, docsByTemplateItemId, pkgName, securityCode }) => {
                const documents = Object.entries(docsByTemplateItemId).map(([templateItemId, documentId]) => ({
                  templateItemId,
                  documentId,
                }));

                const resolvedSecurityCode = securityCode || generatePackageOtpCode();

                const response = await upsertUserPackageMutation.mutateAsync({
                  name: pkgName,
                  templateId: template.id,
                  documents,
                  regenerateLink: true,
                  regenerateSecurityCode: false,
                  securityCode: resolvedSecurityCode,
                  expiresInDays: 30,
                });

                return response.data;
              }}
            />
          </motion.div>
        )}
        {activeTab === 'shared' && (
          <motion.div key="shared" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
            <SharedLinksView
              packages={backendPackages}
              docs={docs}
              isLoading={userPackagesQuery.isLoading}
              error={sharedLinksError}
              onRevoke={(id) => deleteUserPackageMutation.mutate(id)}
              onCopyLink={handleCopyLink}
              copiedLink={copiedLink}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── Modals ─── */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            onClose={() => { setShowUploadModal(false); setUploadPreset(null); }}
            onUpload={async (payload) => {
              const { tags, ...createPayload } = payload;
              const created = await createDocumentMutation.mutateAsync(createPayload);
              if (tags.length > 0) {
                await updateDocumentMutation.mutateAsync({ id: created.data.id, tags });
              }
            }}
            folders={folders}
            properties={state.properties}
            preset={uploadPreset}
            isSubmitting={createDocumentMutation.isPending}
            submitError={createDocumentMutation.isError ? getApiErrorMessage(createDocumentMutation.error) : null}
          />
        )}
        {showShareModal && <ShareModal onClose={() => { setShowShareModal(false); setShareDocIds([]); }} docIds={shareDocIds} docs={docs} onCreateLink={addVaultShareLink} />}
        {showFolderModal && (
          <FolderModal
            onClose={() => setShowFolderModal(false)}
            onCreateFolder={async (payload) => {
              await createFolderMutation.mutateAsync(payload);
            }}
            isSubmitting={createFolderMutation.isPending}
            submitError={createFolderMutation.isError ? getApiErrorMessage(createFolderMutation.error) : null}
          />
        )}
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
  totalDocumentCount,
  searchQuery, setSearchQuery, selectedDocs, handleSelectDoc, handleShareSelected,
  handleDeleteSelected, onUpload, onDelete, onView, deleteFolder,
  activeFolderId, setActiveFolderId,
  isLoading, isError, error, hasNextPage, isFetchingNextPage, intersectionRef,
}: {
  docs: VaultDocument[];
  allDocs: VaultDocument[];
  totalDocumentCount: number;
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
  onUpload: () => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
  deleteFolder: (id: string) => void;
  activeFolderId: string | null;
  setActiveFolderId: (id: string | null) => void;
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  intersectionRef: React.RefObject<HTMLDivElement | null>;
}) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col gap-[8px]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonDocumentRow key={idx} index={idx} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-white rounded-[20px] border border-[#F97373] p-[32px] text-center shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
          <p className="text-[18px] text-[#3E2D1D] mb-[8px]" style={{ fontWeight: 600 }}>
            Unable to load documents
          </p>
          <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>
            {getApiErrorMessage(error)}
          </p>
        </div>
      );
    }

    if (docs.length === 0) {
      return (
        <EmptyState
          title={activeCategory !== 'all' ? `No ${activeCategory} documents` : 'No documents yet'}
          description={activeCategory !== 'all'
            ? `Upload ${activeCategory.toLowerCase()} documents to get started.`
            : 'Upload your first document to start building your secure vault.'
          }
          onAction={onUpload}
          actionLabel="Upload Document"
        />
      );
    }

    return (
      <>
        <div className="flex flex-col gap-[8px]">
          {docs.map(doc => (
            <DocumentRow
              key={doc.id}
              doc={doc}
              isSelected={selectedDocs.includes(doc.id)}
              onSelect={() => handleSelectDoc(doc.id)}
              onDelete={() => onDelete(doc.id)}
              onView={() => onView(doc.id)}
            />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonDocumentRow key={`skeleton-${idx}`} index={docs.length + idx} />
            ))}
        </div>
        {hasNextPage && (
          <div ref={intersectionRef} className="h-[1px] w-full mt-[8px]" />
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col xl:flex-row gap-[24px] items-stretch">
      {/* ─ Category Sidebar ─ */}
      <div className="w-full xl:w-[280px] shrink-0 xl:sticky xl:top-[136px] self-start">
        <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[21px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
          <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[16px]`}>Categories</p>

          {/* All Documents button */}
          <button
            onClick={() => {
              setActiveFolderId(null);
              setActiveCategory('all');
            }}
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
            }}>{totalDocumentCount}</span>
          </button>

          <div className="h-px bg-[#E8E4DD] my-[12px]" />

          {/* Default categories */}
          {DEFAULT_CATEGORIES.map(cat => {
            const count = categoryCounts[cat] || 0;
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setActiveFolderId(null);
                  setActiveCategory(cat);
                }}
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
              {folders.map(f => {
                const isActiveFolder = activeFolderId === f.id;
                return (
                  <div
                    key={f.id}
                    className={`flex items-center justify-between px-[14px] py-[8px] rounded-[10px] group cursor-pointer ${
                      isActiveFolder ? 'bg-[#F3EFE6]' : 'hover:bg-[#F3EFE6]'
                    }`}
                    onClick={() => setActiveFolderId(f.id)}
                  >
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
                );
              })}
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
        {renderContent()}
      </div>
    </div>
  );
}

/* ─── Document Row ─── */
function DocumentRow({
  doc, isSelected, onSelect, onDelete, onView,
}: {
  doc: VaultDocument;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onView: () => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 26,
        mass: 0.7,
      }}
      onClick={onView}
      className={`bg-white rounded-[16px] border transition-all shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] ${
        isSelected ? 'border-[#764D2F] bg-[#FDFBF8]' : 'border-[#EAEAEA] hover:border-[#C5A68A]'
      }`}
    >
      <div className="flex items-center gap-[16px] px-[28px] py-[20px]">
        {/* Checkbox */}
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
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
        <div className="flex-1 min-w-0 text-left overflow-hidden">
          <p
            title={doc.name}
            className="block w-full min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-[16px] text-[#764D2F]"
            style={{ fontWeight: 510 }}
          >
            {doc.name}
          </p>
          <div className="flex items-center gap-[8px] mt-[2px]">
            <span className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>{doc.fileSize}</span>
            <span className="text-[12px] text-[#D0D0D0]">|</span>
            <span className="text-[12px] px-[6px] py-[1px] rounded-full" style={{ backgroundColor: '#F3EFE6', color: '#3E2D1D', fontWeight: 510 }}>{doc.category}</span>
            <span className="text-[12px] text-[#D0D0D0] hidden sm:inline">|</span>
            <span className="text-[12px] text-[#8C8780] hidden sm:inline" style={{ fontWeight: 510 }}>{doc.uploadedAt}</span>
          </div>
        </div>

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
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-[6px] rounded-[6px] border border-[#D0D0D0] text-[#8C8780] hover:bg-[#F3EFE6] hover:text-[#764D2F] transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-[14px] h-[14px]" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-[4px] z-20 bg-white rounded-[10px] border border-[#D0D0D0] shadow-lg py-[4px] w-[160px]">
                  <button onClick={() => { onView(); setShowMenu(false); }} className="w-full text-left px-[14px] py-[8px] text-[13px] text-[#3E2D1D] hover:bg-[#F3EFE6] cursor-pointer flex items-center gap-[8px]" style={{ fontWeight: 510 }}>
                    <Eye className="w-[14px] h-[14px]" /> View Document
                  </button>
                  <button onClick={() => { onView(); setShowMenu(false); }} className="w-full text-left px-[14px] py-[8px] text-[13px] text-[#3E2D1D] hover:bg-[#F3EFE6] cursor-pointer flex items-center gap-[8px]" style={{ fontWeight: 510 }}>
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
    </motion.div>
  );
}

function SkeletonDocumentRow({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: index * 0.04 }}
      className="bg-white rounded-[16px] border border-[#EAEAEA] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
    >
      <div className="flex items-center gap-[16px] px-[28px] py-[20px] animate-pulse">
        <div className="w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-[#E3DED5]" />
        <div className="w-[36px] h-[40px] rounded-[8px] bg-[#F3EFE6]" />
        <div className="flex-1 min-w-0 space-y-[6px]">
          <div className="h-[12px] w-2/3 rounded-full bg-[#F0EBE2]" />
          <div className="flex items-center gap-[8px]">
            <div className="h-[10px] w-[60px] rounded-full bg-[#F0EBE2]" />
            <div className="h-[10px] w-[70px] rounded-full bg-[#F5EFE5]" />
            <div className="h-[10px] w-[80px] rounded-full bg-[#F0EBE2] hidden sm:block" />
          </div>
        </div>
        <div className="hidden lg:flex items-center gap-[4px]">
          <div className="h-[18px] w-[60px] rounded-full bg-[#F5EFE5]" />
          <div className="h-[18px] w-[40px] rounded-full bg-[#F5EFE5]" />
        </div>
        <div className="w-[28px] h-[28px] rounded-[6px] border border-[#E3DED5] bg-[#F8F4EE]" />
      </div>
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

function PackagesView({ docs, templates, isTemplatesLoading, templatesError, onUploadForPackage, onGeneratePackage, isSubmitting }: {
  docs: VaultDocument[];
  templates: PackageTemplate[];
  isTemplatesLoading: boolean;
  templatesError: string | null;
  onUploadForPackage: (category: VaultCategory, nameHint: string) => void;
  onGeneratePackage: (payload: {
    template: PackageTemplate;
    docsByTemplateItemId: Record<string, string>;
    pkgName: string;
    securityCode?: string;
  }) => Promise<BackendUserPackage>;
  isSubmitting: boolean;
}) {
  const [selectedPkg, setSelectedPkg] = useState<string | null>(null);
  const [generatedPackage, setGeneratedPackage] = useState<BackendUserPackage | null>(null);

  const selectedTemplate = templates.find(p => p.id === selectedPkg);

  if (generatedPackage) {
    return (
      <PackageShareSuccess
        userPackage={generatedPackage}
        onBack={() => setGeneratedPackage(null)}
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
        isSubmitting={isSubmitting}
        onGeneratePackage={async ({ template, docsByTemplateItemId, pkgName, securityCode }) => {
          const createdPackage = await onGeneratePackage({
            template,
            docsByTemplateItemId,
            pkgName,
            securityCode,
          });
          if (!createdPackage.sharedLink) return;
          setGeneratedPackage(createdPackage);
        }}
      />
    );
  }

  if (isTemplatesLoading) {
    return (
      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[48px] text-center">
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>Loading package templates</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780]`} style={wdth}>Fetching available lender package templates...</p>
      </div>
    );
  }

  if (templatesError) {
    return (
      <div className="bg-white rounded-[20px] border border-[#F97373] p-[48px] text-center">
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>Unable to load package templates</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780]`} style={wdth}>{templatesError}</p>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[48px] text-center">
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>No package templates available</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780]`} style={wdth}>Ask your admin to configure package templates in the backend.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-[10px] mb-[8px]">
        <p className={`${canela} text-[24px] text-[#3E2D1D]`}>Document Package</p>
        <img src={closeIconAsset} alt="" className="w-[24px] h-[24px]" />
      </div>
      <p className="text-[14px] text-[#764D2F] mb-[16px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
        Choose the package your lender requires, or skip and attach individual documents below.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[16px]">
        {templates.map((pkg, i) => {
          const matches = getPackageMatches(docs, pkg);
          const fulfilled = matches.filter(m => m.matched).length;
          const total = matches.length;
          const displayItems = matches.slice(0, 3);
          const fulfilledPreview = displayItems.filter(item => item.matched).length;

          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedPkg(pkg.id)}
              className="bg-white border-[1.5px] border-[#E8E5E0] rounded-[16px] p-[26px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="bg-[#FCF6F0] rounded-[6px] p-[8.5px]">
                  <img src={packageIconAsset} alt="" className="w-[21px] h-[21px]" />
                </div>
                <PackageCardProgress value={fulfilledPreview} total={displayItems.length} />
              </div>

              <div className="mt-[16px] flex flex-col gap-[16px]">
                <div className="flex flex-col gap-[4px]">
                  <p className={`${canela} text-[24px] text-[#3E2D1D] leading-none`}>{pkg.name}</p>
                  <p
                    className="text-[13px] text-[#8C8780] leading-[19.5px]"
                    style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}
                  >
                    {pkg.description}
                  </p>
                </div>

                <div className="flex flex-col gap-[6px]">
                  {displayItems.map(({ req }) => (
                    <div key={req.id} className="flex items-center gap-[8px] h-[18px]">
                      <img src={listRadioAsset} alt="" className="w-[14px] h-[14px]" />
                      <span className="text-[12px] text-[#8C8780] leading-[18px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                        {req.name}
                      </span>
                    </div>
                  ))}
                  <p className="text-[11px] text-[#8C8780] leading-[16.5px] tracking-[0.0645px] pl-[22px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                    +{Math.max(total - 3, 0)} more items
                  </p>
                </div>

                <span
                  className="inline-flex w-fit h-[24px] items-center rounded-[16777200px] bg-[#FCF6F0] px-[8px] text-[12px] text-[#764D2F] leading-[18px]"
                  style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}
                >
                  {fulfilled} / {total} documents
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
function PackageDetailView({ template, docs, onBack, onUploadForPackage, onGeneratePackage, isSubmitting }: {
  template: PackageTemplate;
  docs: VaultDocument[];
  onBack: () => void;
  onUploadForPackage: (category: VaultCategory, nameHint: string) => void;
  onGeneratePackage: (payload: {
    template: PackageTemplate;
    docsByTemplateItemId: Record<string, string>;
    pkgName: string;
    securityCode?: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}) {
  const matches = getPackageMatches(docs, template);
  const fulfilled = matches.filter(m => m.matched).length;
  const total = matches.length;
  const completeness = total > 0 ? Math.round((fulfilled / total) * 100) : 0;
  const docsByTemplateItemId = useMemo(() => {
    return matches.reduce<Record<string, string>>((acc, item) => {
      if (item.matched) {
        acc[item.req.id] = item.matched.id;
      }
      return acc;
    }, {});
  }, [matches]);
  const matchedDocIds = Object.values(docsByTemplateItemId);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [showShareSetup, setShowShareSetup] = useState(false);
  const displayPercent = total > 0 ? Math.max(10, completeness) : 0;
  const categories = [...new Set(template.requiredDocs.map(r => r.category))];

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
          <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] xl:sticky xl:top-[24px]">
            <div className="flex items-center gap-[14px] mb-[14px]">
              <div className="w-[48px] h-[48px] rounded-[14px] bg-[#F3EFE6] flex items-center justify-center shrink-0">
                <img src={packageIconAsset} alt="" className="w-[24px] h-[24px]" />
              </div>
              <p className={`${canela} text-[24px] text-[#3E2D1D]`}>{template.name}</p>
            </div>
            <p className="text-[14px] text-[#8C8780] leading-[normal] mb-[24px] max-w-[275px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
              {template.description}
            </p>

            {/* Progress ring */}
            <div className="bg-[#FAFAF9] rounded-[14px] h-[104px] mb-[24px] flex items-center gap-[10px]">
              <DetailProgressBadge percent={displayPercent} />
              <div>
                <p className="text-[14px] text-[#3E2D1D] leading-[21px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}>
                  {fulfilled} of {total} documents
                </p>
                <p className="text-[12px] text-[#8C8780] leading-[18px] mt-[2px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                  {Math.max(total - fulfilled, 0)} documents needed
                </p>
              </div>
            </div>

            {/* Category breakdown */}
            <div className="mb-[24px]">
              <p className="text-[11px] text-[#8C8780] mb-[10px] tracking-[0.5645px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}>
                CATEGORIES INVOLVED
              </p>
              <div className="flex flex-wrap gap-[6px]">
                {categories.map(cat => (
                  <span
                    key={cat}
                    className="h-[24.5px] px-[10px] rounded-[16777200px] inline-flex items-center text-[11px] text-[#764D2F] tracking-[0.0645px]"
                    style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, backgroundColor: '#FCF6F0' }}
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* Generate / Share section */}
            {!showShareSetup ? (
              <button
                onClick={() => {
                  if (matchedDocIds.length > 0) setShowShareSetup(true);
                }}
                disabled={matchedDocIds.length === 0}
                className={`w-full h-[44px] rounded-[10px] text-[14px] flex items-center justify-center gap-[8px] transition-colors ${
                  matchedDocIds.length > 0
                    ? 'bg-[#3E2D1D] text-white hover:bg-[#764D2F] cursor-pointer'
                    : 'bg-[#F5F3EF] text-[#C5C0B9] cursor-not-allowed'
                }`}
                style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 590 }}
              >
                <Link2 className="w-[16px] h-[16px]" />
                {matchedDocIds.length > 0 ? 'Generate Package Link' : 'Upload documents to generate'}
              </button>
            ) : (
              <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-[11px] text-[#8C8780] mb-[8px]" style={{ fontWeight: 590, letterSpacing: '0.5px' }}>ACCESS CODE (OPTIONAL)</p>
                <input
                  value={recipientEmail}
                  onChange={e => setRecipientEmail(e.target.value)}
                  placeholder="Access code (optional)"
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
                    disabled={isSubmitting}
                    onClick={() => onGeneratePackage({
                      template,
                      docsByTemplateItemId,
                      pkgName: template.name,
                      securityCode: recipientEmail || undefined,
                    })}
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
                    Link expires in 30 days with 25 max views. Lender must enter access code to view.
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
                className="bg-white border border-[#EAEAEA] rounded-[16px] p-[28px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
              >
                <div className="flex items-start justify-between gap-[16px]">
                  <div className="flex items-start gap-[16px] min-w-0">
                    <div className="w-[35.722px] h-[40.222px] rounded-[8px] bg-[#F3EFE6] flex items-center justify-center shrink-0">
                      <FileText className="w-[18px] h-[18px] text-[#764D2F]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[16px] text-[#764D2F] leading-[normal]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                        {req.name}
                      </p>
                      <p className="text-[14px] text-[#8C8780] leading-[normal] mt-[6px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                        {req.description}
                      </p>
                    </div>
                  </div>
                  <span className="h-[32px] px-[16px] rounded-[100px] bg-[#FCF6F0] text-[#3E2D1D] text-[14px] inline-flex items-center shrink-0" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                    {req.category}
                  </span>
                </div>

                <div className="pl-[54px] mt-[16px]">
                  {matched ? (
                    <div className="w-full h-[56px] bg-[#FAFAF9] rounded-[10px] px-[10px] flex items-center gap-[10px]">
                      <div className="w-[28px] h-[28px] rounded-[4px] bg-[#E5EDF5] flex items-center justify-center shrink-0">
                        <span className="text-[9px] text-[#2D5A8E]" style={{ fontWeight: 700 }}>
                          {matched.fileType.slice(0, 3).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] text-[#3E2D1D] leading-[19.5px] truncate" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                          {matched.name}
                        </p>
                        <p className="text-[11px] text-[#8C8780] leading-[16.5px] tracking-[0.0645px]" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>
                          {matched.fileSize} | Uploaded {matched.uploadedAt}
                        </p>
                      </div>
                      <CheckCircle className="w-[14px] h-[14px] text-[#3E6B3E] shrink-0" />
                    </div>
                  ) : (
                    <button
                      onClick={() => onUploadForPackage(req.category, req.name)}
                      className="h-[42px] px-[16px] rounded-[8px] border-[1.5px] border-dashed border-[#3E2D1D] bg-[#FFFDF8] text-[#3E2D1D] hover:bg-[#FCF6F0] transition-colors cursor-pointer inline-flex items-center gap-[10px]"
                      style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontSize: '14px' }}
                    >
                      <Upload className="w-[24px] h-[24px]" />
                      Upload {req.name}
                    </button>
                  )}
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
function PackageShareSuccess({ userPackage, onBack }: {
  userPackage: BackendUserPackage;
  onBack: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const shareToken = userPackage.sharedLink || '';
  const shareUrl = `${window.location.origin}/share/vault/${shareToken}`;
  const shareUrlDisplay = shareUrl.length > 64 ? `${shareUrl.slice(0, 61)}...` : shareUrl;
  const expiresAt = userPackage.expiresAt ? formatDate(userPackage.expiresAt) : 'N/A';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[626px] mx-auto"
    >
      <div className="bg-[#3E2D1D] rounded-[16px] overflow-hidden">
        <div className="flex flex-col items-center px-[36px] py-[64px]">
          {/* Success icon with rings */}
          <div className="relative w-[158.5px] h-[158.5px] mb-[24px]">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[158.5px] h-[158.5px] rounded-full border border-[#C4B29A] opacity-20" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[17.01px] w-[124.487px] h-[124.487px] rounded-full border border-[#C4B29A] opacity-50" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[31.97px] w-[94.556px] h-[94.556px] rounded-full bg-[#764D2F] flex items-center justify-center">
              <Check className="w-[40px] h-[40px] text-white" />
            </div>
          </div>

          <p className={`${canela} text-[28px] text-white text-center mb-[4px]`}>Package Link Created</p>
          <p className={`${sfMed} text-[16px] text-[#D3B597] text-center mb-[52px]`} style={wdth}>
            Your <strong className="text-white">{userPackage.name}</strong> is ready to share with your lender.
          </p>

          {/* Shareable link panel */}
          <div className="w-full bg-white/5 rounded-[8px] py-[20px] px-[20px] mb-[52px]">
            <p className={`${sfMed} text-[16px] text-[#D3B597] mb-[10px] text-center`} style={wdth}>
              Shareable Link
            </p>
            <div className="flex items-center gap-[10px]">
              <div className="flex-1 min-w-0 overflow-hidden bg-white/10 rounded-[8px] border border-[#C4B29A]/30 px-[12px] py-[10px]">
                <p title={shareUrl} className="text-[13px] text-white truncate text-left" style={{ fontWeight: 510 }}>{shareUrlDisplay}</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-[6px] h-[40px] px-[16px] rounded-[8px] bg-[#764D2F] text-white text-[13px] cursor-pointer hover:bg-[#8A5B39] transition-colors shrink-0"
                style={{ fontWeight: 590 }}
              >
                {copied ? <Check className="w-[14px] h-[14px]" /> : <Copy className="w-[14px] h-[14px]" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Details */}
          <div className="w-full space-y-[24px] mb-[24px]">
            {userPackage.securityCode && (
              <div className="flex items-center justify-between">
                <span className="text-[14px] text-[#D3B597]" style={{ ...wdth, fontWeight: 590 }}>Access Code</span>
                <span className="text-[16px] text-white" style={{ ...wdth, fontWeight: 510 }}>{userPackage.securityCode}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#D3B597]" style={{ ...wdth, fontWeight: 590 }}>Expires</span>
              <span className="text-[16px] text-white" style={{ ...wdth, fontWeight: 510 }}>{expiresAt}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#D3B597]" style={{ ...wdth, fontWeight: 590 }}>Status</span>
              <span className="text-[16px] text-white" style={{ ...wdth, fontWeight: 510 }}>{userPackage.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[14px] text-[#D3B597]" style={{ ...wdth, fontWeight: 590 }}>Documents</span>
              <span className="text-[16px] text-white" style={{ ...wdth, fontWeight: 510 }}>{userPackage.documents.length}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="w-full flex flex-col sm:flex-row gap-[10px]">
            <Link
              to={`/share/vault/${shareToken}`}
              className="flex-1 inline-flex items-center justify-center gap-[8px] h-[50px] rounded-[8px] border-[1.5px] border-white text-[16px] text-white hover:bg-white/10 transition-colors cursor-pointer no-underline"
              style={{ ...wdth, fontWeight: 590 }}
            >
              <ExternalLink className="w-[16px] h-[16px]" /> Preview Lender View
            </Link>
            <button
              onClick={onBack}
              className="flex-1 h-[50px] rounded-[8px] border-[1.5px] border-white text-[16px] text-white hover:bg-white/10 transition-colors cursor-pointer"
              style={{ ...wdth, fontWeight: 590 }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Shared Links View ─── */
function SharedLinksView({
  packages, docs, isLoading, error, onRevoke, onCopyLink, copiedLink,
}: {
  packages: BackendUserPackage[];
  docs: VaultDocument[];
  isLoading: boolean;
  error: string | null;
  onRevoke: (id: string) => void;
  onCopyLink: (token: string) => void;
  copiedLink: string | null;
}) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[48px] sm:p-[60px] text-center">
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>Loading shared links</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780] max-w-[360px] mx-auto`} style={wdth}>Fetching package links from backend...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-[20px] border border-[#F97373] p-[48px] sm:p-[60px] text-center">
        <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>Unable to load shared links</p>
        <p className={`${sfMed} text-[14px] text-[#8C8780] max-w-[360px] mx-auto`} style={wdth}>{error}</p>
      </div>
    );
  }

  if (packages.length === 0) {
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
      {packages.map(link => {
        if (!link.sharedLink) return null;

        const linkDocs = link.documents.map(item => docs.find(d => d.id === item.documentId)).filter(Boolean) as VaultDocument[];
        const expiresAt = link.expiresAt ? formatDate(link.expiresAt) : 'N/A';
        const isExpired = link.expiresAt ? new Date(link.expiresAt) < new Date() : false;
        const isRevoked = link.status.toLowerCase() !== 'finalized';
        const statusColor = isRevoked ? '#8E3B3B' : isExpired ? '#8B7A3C' : '#3E6B3E';
        const statusBg = isRevoked ? '#F8EDED' : isExpired ? '#FFF8E6' : '#EEF5EE';
        const statusText = isRevoked ? 'Revoked' : isExpired ? 'Expired' : 'Active';
        const title = link.name || `${linkDocs.length} Document${linkDocs.length !== 1 ? 's' : ''}`;

        return (
          <motion.div
            key={link.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white relative rounded-[16px] border border-[#EAEAEA] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]"
          >
            <div className="flex flex-col gap-[16px] p-[28px]">
              <div className="flex items-start justify-between gap-[12px]">
                <div className="flex items-center gap-[16px] min-w-0">
                  <div className="w-[35.722px] h-[40.222px] rounded-[8px] bg-[#F3EFE6] flex items-center justify-center shrink-0">
                    <Package className="w-[18px] h-[18px] text-[#764D2F]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[16px] text-[#764D2F] truncate" style={{ fontWeight: 510 }}>{title}</p>
                    <p className="text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>
                      Created {formatDate(link.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="h-[24px] px-[8px] rounded-[16777200px] inline-flex items-center text-[11px] shrink-0" style={{ backgroundColor: statusBg, color: statusColor, fontWeight: 590 }}>
                  {statusText}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-[10px] text-[12px] text-[#8C8780]" style={{ fontWeight: 510 }}>
                <span className="inline-flex items-center gap-[4px]"><Clock className="w-[12px] h-[12px]" /> Expires {expiresAt}</span>
                <span className="inline-flex items-center gap-[4px]"><Eye className="w-[12px] h-[12px]" /> View tracking unavailable</span>
                <span className="inline-flex items-center gap-[4px]"><FileText className="w-[12px] h-[12px]" /> {linkDocs.length} documents</span>
              </div>

              {!isRevoked && !isExpired && (
                <div className="flex items-center gap-[8px]">
                  <Link
                    to={`/share/vault/${link.sharedLink}`}
                    className="bg-white content-stretch flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors border border-[#D0D0D0] no-underline"
                    title="Open link"
                  >
                    <ExternalLink className="w-[18px] h-[18px] text-[#764D2F]" />
                  </Link>
                  <button
                    onClick={() => onCopyLink(link.sharedLink as string)}
                    className="bg-white content-stretch flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors border border-[#D0D0D0]"
                    title="Copy link"
                  >
                    {copiedLink === link.sharedLink ? (
                      <Check className="w-[18px] h-[18px] text-[#3E6B3E]" />
                    ) : (
                      <Copy className="w-[18px] h-[18px] text-[#764D2F]" />
                    )}
                  </button>
                  <button
                    onClick={() => onRevoke(link.id)}
                    className="h-[30px] px-[12px] rounded-[6px] border border-[#D0D0D0] text-[12px] text-[#764D2F] cursor-pointer hover:bg-[#F8F6F1] transition-colors"
                    style={{ fontWeight: 590 }}
                  >
                    Revoke
                  </button>
                </div>
              )}

              {linkDocs.length > 0 && (
                <div className="flex flex-wrap gap-[6px]">
                  {linkDocs.map(d => (
                    <span key={d.id} className="text-[11px] px-[8px] py-[3px] rounded-[6px] bg-[#FAFAF9] text-[#3E2D1D] border border-[#E8E4DD]" style={{ fontWeight: 510 }}>
                      {d.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── Upload Modal ─── */
function UploadModal({ onClose, onUpload, folders, properties, preset, isSubmitting, submitError }: {
  onClose: () => void;
  onUpload: (payload: {
    name: string;
    category: Exclude<VaultCategory, 'Custom'>;
    linkedPropertyId?: string;
    notes?: string;
    folderId?: string;
    file: File;
    tags: string[];
  }) => Promise<void>;
  folders: VaultFolder[];
  properties: { id: string; name: string }[];
  preset?: { category?: VaultCategory; nameHint?: string } | null;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const form = useForm<{
    name: string;
    category: Exclude<VaultCategory, 'Custom'>;
    propertyId: string;
    folderId: string;
    notes: string;
  }>({
    defaultValues: {
      name: preset?.nameHint || '',
      category: preset?.category && preset.category !== 'Custom' ? preset.category : 'Identity',
      propertyId: '',
      folderId: '',
      notes: '',
    },
  });

  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nameValue = form.watch('name');
  const folderId = form.watch('folderId');
  const propertyId = form.watch('propertyId');
  const categoryValue = form.watch('category');

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploadedFile(file);
      if (!form.getValues('name').trim()) {
        form.setValue('name', file.name.replace(/\.[^/.]+$/, ''), { shouldValidate: true });
      }
    }
  }, [form]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      if (!form.getValues('name').trim()) {
        form.setValue('name', file.name.replace(/\.[^/.]+$/, ''), { shouldValidate: true });
      }
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (!uploadedFile) return;
    await onUpload({
      name: values.name.trim(),
      category: values.category,
      linkedPropertyId: values.propertyId || undefined,
      folderId: values.folderId || undefined,
      notes: values.notes || undefined,
      file: uploadedFile,
      tags,
    });
    onClose();
  });
  const addTag = (raw: string) => {
    const next = raw.trim();
    if (!next) return;
    setTags(prev => (prev.includes(next) ? prev : [...prev, next]));
    setTagInput('');
  };
  const removeTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag));

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
                <span className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>{uploadedFile.name}</span>
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
          <div className="flex flex-col gap-[20px]">
            <ModalField label="Document Name" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <input
                value={nameValue}
                onChange={(e) => form.setValue('name', e.target.value, { shouldValidate: true })}
                placeholder="e.g. 2025_Tax_Return"
                className={invoiceModalInputClass}
                style={{ fontFamily: "'Figtree', sans-serif" }}
              />
            </ModalField>

            <ModalField label="Category" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <Select value={categoryValue} onValueChange={(val) => form.setValue('category', val as Exclude<VaultCategory, 'Custom'>)}>
                <SelectTrigger className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`} style={{ fontFamily: "'Figtree', sans-serif" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={invoiceSelectContentBase}>
                  {DEFAULT_CATEGORIES.map(c => (
                    <SelectItem key={c} value={c} className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                      <CategorySelectItemLabel category={c} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ModalField>

            <ModalField label="Folder (optional)" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <Select value={folderId || '__none'} onValueChange={(val) => form.setValue('folderId', val === '__none' ? '' : val)}>
                <SelectTrigger className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`} style={{ fontFamily: "'Figtree', sans-serif" }}>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className={invoiceSelectContentBase}>
                  <SelectItem value="__none" className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                    None
                  </SelectItem>
                  {folders.map((folder) => (
                    <SelectItem key={folder.id} value={folder.id} className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                      {folder.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ModalField>

            <ModalField label="Link to Property (optional)" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <Select value={propertyId || '__none'} onValueChange={(val) => form.setValue('propertyId', val === '__none' ? '' : val)}>
                <SelectTrigger className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`} style={{ fontFamily: "'Figtree', sans-serif" }}>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent className={invoiceSelectContentBase}>
                  <SelectItem value="__none" className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                    None
                  </SelectItem>
                  {properties.map(p => (
                    <SelectItem key={p.id} value={p.id} className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ModalField>

            <ModalField label="Tags" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <div className="w-full min-h-[46px] bg-white border border-[#D0D0D0] rounded-[8px] px-[10px] py-[8px] focus-within:border-[#764D2F] transition-colors">
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-[6px] mb-[6px]">
                    {tags.map(tag => (
                      <span key={tag} className="inline-flex items-center gap-[6px] h-[26px] px-[10px] rounded-[100px] bg-[#F3EFE6] text-[#764D2F] text-[12px]" style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="text-[#8C8780] hover:text-[#3E2D1D] cursor-pointer">
                          <X className="w-[12px] h-[12px]" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ',') {
                      e.preventDefault();
                      addTag(tagInput);
                    }
                    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
                      removeTag(tags[tags.length - 1]);
                    }
                  }}
                  placeholder={tags.length === 0 ? "Add a tag and press Enter" : "Add another tag"}
                  className="w-full bg-transparent text-[14px] text-[#333] placeholder:text-[#767676] outline-none"
                  style={{ fontFamily: "'Figtree', sans-serif" }}
                />
              </div>
              <div className="flex flex-wrap gap-[6px] mt-[8px]">
                {POPULAR_TAGS.filter(t => !tags.includes(t)).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => addTag(t)}
                    className="h-[24px] px-[10px] rounded-[100px] bg-[#FCF6F0] text-[#764D2F] text-[11px] cursor-pointer hover:bg-[#F3EFE6] transition-colors"
                    style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </ModalField>

            <ModalField label="Notes (optional)" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <textarea
                value={form.watch('notes')}
                onChange={e => form.setValue('notes', e.target.value)}
                placeholder="Additional notes about this document..."
                rows={2}
                className="w-full bg-white border border-[#D0D0D0] rounded-[8px] px-[12px] py-[10px] text-[14px] text-[#333] placeholder:text-[#767676] outline-none focus:border-[#764D2F] resize-none transition-colors"
                style={{ fontFamily: "'Figtree', sans-serif" }}
              />
            </ModalField>
          </div>

          {submitError && (
            <p className="text-[12px] text-red-500 mt-[12px]" style={{ fontWeight: 510 }}>
              {submitError}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-[10px] mt-[24px]">
            <button onClick={onClose} className="h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#D0D0D0] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!nameValue.trim() || !uploadedFile || isSubmitting}
              className={`h-[40px] px-[24px] rounded-[8px] text-[14px] text-white transition-colors cursor-pointer ${nameValue.trim() && uploadedFile && !isSubmitting ? 'bg-[#3E2D1D] hover:bg-[#764D2F]' : 'bg-[#C5C0B9] cursor-not-allowed'}`}
              style={{ fontWeight: 590 }}
            >
              {isSubmitting ? 'Uploading...' : 'Upload Document'}
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

  const selectStyle = { backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23767676' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 8px center', backgroundRepeat: 'no-repeat', backgroundSize: '20px', paddingRight: '32px' };

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
function FolderModal({ onClose, onCreateFolder, isSubmitting, submitError }: {
  onClose: () => void;
  onCreateFolder: (f: { name: string; parentFolderId?: string }) => Promise<void>;
  isSubmitting: boolean;
  submitError: string | null;
}) {
  const form = useForm<{ name: string; category: VaultCategory; description: string }>({
    defaultValues: {
      name: '',
      category: 'Custom',
      description: '',
    },
  });
  const name = form.watch('name');
  const category = form.watch('category');
  const description = form.watch('description');

  const handleCreate = form.handleSubmit(async () => {
    if (!name.trim()) return;
    await onCreateFolder({ name: name.trim() });
    onClose();
  });

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

          <div className="flex flex-col gap-[20px]">
            <ModalField label="Folder Name" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <input
                value={name}
                onChange={e => form.setValue('name', e.target.value, { shouldValidate: true })}
                placeholder="e.g. Texas Properties"
                className={invoiceModalInputClass}
                style={{ fontFamily: "'Figtree', sans-serif" }}
                autoFocus
              />
            </ModalField>

            <ModalField label="Category" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <Select value={category} onValueChange={(val) => form.setValue('category', val as VaultCategory)}>
                <SelectTrigger className={`w-full !text-[#333] ${invoiceSelectTriggerBase}`} style={{ fontFamily: "'Figtree', sans-serif" }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className={invoiceSelectContentBase}>
                  {[...DEFAULT_CATEGORIES, 'Custom' as VaultCategory].map(c => (
                    <SelectItem key={c} value={c} className={invoiceSelectItemBase} style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510 }}>
                      <CategorySelectItemLabel category={c} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </ModalField>

            <ModalField label="Description (optional)" labelClassName={invoiceModalLabelClass} labelStyle={invoiceModalLabelStyle}>
              <input
                value={description}
                onChange={e => form.setValue('description', e.target.value)}
                placeholder="What goes in this folder?"
                className={invoiceModalInputClass}
                style={{ fontFamily: "'Figtree', sans-serif" }}
              />
            </ModalField>
          </div>

          {submitError && (
            <p className="text-[12px] text-red-500 mt-[12px]" style={{ fontWeight: 510 }}>
              {submitError}
            </p>
          )}

          <div className="flex justify-end gap-[10px] mt-[24px]">
            <button onClick={onClose} className="h-[40px] px-[20px] rounded-[8px] border-[1.5px] border-[#D0D0D0] text-[14px] text-[#3E2D1D] hover:bg-[#F3EFE6] transition-colors cursor-pointer" style={{ fontWeight: 590 }}>Cancel</button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isSubmitting}
              className={`h-[40px] px-[24px] rounded-[8px] text-[14px] text-white transition-colors cursor-pointer ${name.trim() && !isSubmitting ? 'bg-[#3E2D1D] hover:bg-[#764D2F]' : 'bg-[#C5C0B9] cursor-not-allowed'}`}
              style={{ fontWeight: 590 }}
            >
              {isSubmitting ? 'Creating...' : 'Create Folder'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Helper: Modal Field Wrapper ─── */
function ModalField({
  label,
  children,
  labelClassName,
  labelStyle,
}: {
  label: string;
  children: React.ReactNode;
  labelClassName?: string;
  labelStyle?: CSSProperties;
}) {
  return (
    <div>
      <label className={labelClassName || "block text-[12px] text-[#8C8780] mb-[6px]"} style={labelStyle || { fontWeight: 590, letterSpacing: '0.3px' }}>
        {label}
      </label>
      {children}
    </div>
  );
}
