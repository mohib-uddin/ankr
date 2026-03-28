import React, { useState, useEffect, type CSSProperties } from 'react';
import { useParams } from 'react-router';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import type { VaultDocument, VaultShareLink, AppState } from '@/app/context/AppContext';
import svgPaths from '@/icons/public-vault';

const STORAGE_KEY = 'ankr_v2_state';

const canela = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const sfMed = "font-['SF_Pro',sans-serif] font-[510]";
const sfSemi = "font-['SF_Pro',sans-serif] font-[590]";
const wdth: CSSProperties = { fontVariationSettings: "'wdth' 100" };

/* ─── SVG Icon Components (from Figma) ─── */
function DocumentIcon({ color = '#FCF6F0' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d={svgPaths.p148d9a00} fill={color} />
      <path clipRule="evenodd" d={svgPaths.p8e79d80} fill={color} fillRule="evenodd" />
    </svg>
  );
}

function DownloadIcon({ color = '#FCF6F0', size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d={svgPaths.p8e42180} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ClockIcon({ color = '#FCF6F0' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d={svgPaths.p15266900} stroke={color} strokeMiterlimit="10" strokeWidth="1.5" />
      <path d="M12 6V12.75H16.5" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function EyeIcon({ color = '#FCF6F0', size = 24 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ overflow: 'visible' }}>
      <g transform={`scale(${size / 24})`}>
        <path d={svgPaths.p1de46000} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(-0.25, -0.25)" />
        <path d={svgPaths.p32ffcf80} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" transform="translate(-0.25, -0.25)" />
      </g>
    </svg>
  );
}

function EyeIconSmall({ color = '#764D2F' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ overflow: 'visible' }}>
      <path d={svgPaths.p16e43a80} stroke={color} strokeWidth="1.125" transform="translate(0.9375, 2.4375)" />
      <path d={svgPaths.p123590f0} stroke={color} strokeWidth="1.125" transform="translate(0.9375, 2.4375)" />
    </svg>
  );
}

function DownloadIconSmall({ color = '#764D2F' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d={svgPaths.p1b7d8060} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12" />
    </svg>
  );
}

function FolderIcon({ color = '#764D2F', size = 28.8 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28.8 28.8" fill="none" style={{ overflow: 'visible' }}>
      <g transform={`translate(${size * 0.1035}, ${size * 0.1354})`}>
        <path clipRule="evenodd" d={svgPaths.p3ecb5c00} fill={color} fillRule="evenodd" />
      </g>
    </svg>
  );
}

function FolderIconSmall({ color = '#3E2D1D' }: { color?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ overflow: 'visible' }}>
      <g transform="translate(1.863, 2.4372)">
        <path clipRule="evenodd" d={svgPaths.p1caf3e80} fill={color} fillRule="evenodd" />
      </g>
    </svg>
  );
}

function FileUploadIcon({ color = '#764D2F' }: { color?: string }) {
  return (
    <svg width="35.72" height="40.22" viewBox="0 0 35.7222 40.2222" fill="none">
      <rect fill="#F3EFE6" height="40.2222" rx="4.44444" width="35.7222" />
      <path d={svgPaths.p894b080} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

function ShieldIcon({ color = '#764D2F', size = 28.8 }: { color?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28.8 28.8" fill="none">
      <path d={svgPaths.p2dcd0900} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4" />
    </svg>
  );
}

function ChevronDownIcon({ color = '#767676' }: { color?: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path clipRule="evenodd" d={svgPaths.p1758e570} fill={color} fillRule="evenodd" />
    </svg>
  );
}

function CalendarIcon({ color = '#8C8780' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M4 1V3" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 1V3" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgPaths.p333d5300} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.5 5H10.5" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIconSmall({ color = '#8C8780' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d={svgPaths.p3e7757b0} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 3V6L8 7" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIconMicro({ color = '#8C8780' }: { color?: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d={svgPaths.p9a79300} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
      <path d={svgPaths.p24092800} stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── Main Component ─── */
export function PublicVaultView() {
  const { token } = useParams<{ token: string }>();
  const [shareLink, setShareLink] = useState<VaultShareLink | null>(null);
  const [documents, setDocuments] = useState<VaultDocument[]>([]);
  const [userName, setUserName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!token) { setError('Invalid link'); return; }
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) { setError('Package not found'); return; }
      const state: AppState = JSON.parse(raw);
      const link = (state.vaultShareLinks || []).find(l => l.token === token);
      if (!link) { setError('This link is invalid or has been revoked'); return; }
      if (!link.isActive) { setError('This link has been revoked by the sender'); return; }
      if (new Date(link.expiresAt) < new Date()) { setError('This link has expired'); return; }
      if (link.accessCount >= link.maxAccess) { setError('This link has reached its maximum number of views'); return; }

      const docs = (state.vaultDocuments || []).filter(d => link.documentIds.includes(d.id));
      setShareLink(link);
      setDocuments(docs);
      setUserName(state.userName || 'Demo Investor');
      // Expand all categories by default
      const cats = new Set(docs.map(d => d.category));
      setExpandedCategories(cats);

      const updatedLinks = state.vaultShareLinks.map(l =>
        l.id === link.id ? { ...l, accessCount: l.accessCount + 1 } : l
      );
      setTimeout(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, vaultShareLinks: updatedLinks }));
      }, 200);
    } catch {
      setError('Unable to load package data');
    }
  }, [token]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#FCF6F0] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[20px] border border-[#D0D0D0] p-[40px] sm:p-[48px] max-w-[440px] w-full text-center"
          style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.45)' }}
        >
          <div className="w-[56px] h-[56px] rounded-full bg-[#FFF8E6] flex items-center justify-center mx-auto mb-[20px]">
            <Lock className="w-[24px] h-[24px] text-[#8B7A3C]" />
          </div>
          <p className={`${canela} text-[20px] text-[#3E2D1D] mb-[8px]`}>Access Unavailable</p>
          <p className={`${sfMed} text-[14px] text-[#8C8780]`} style={wdth}>{error}</p>
        </motion.div>
      </div>
    );
  }

  // Loading
  if (!shareLink) {
    return (
      <div className="min-h-screen bg-[#FCF6F0] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#E8E5E0]" />
          <div className="h-3 w-32 bg-[#E8E5E0] rounded" />
        </div>
      </div>
    );
  }

  // Group docs by category
  const grouped: Record<string, VaultDocument[]> = {};
  documents.forEach(doc => {
    if (!grouped[doc.category]) grouped[doc.category] = [];
    grouped[doc.category].push(doc);
  });
  const categoryKeys = Object.keys(grouped).sort();

  const daysUntilExpiry = Math.max(0, Math.ceil((new Date(shareLink.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  const remainingViews = shareLink.maxAccess - shareLink.accessCount;

  let totalBytes = 0;
  documents.forEach(d => {
    const m = d.fileSize.match(/([\d.]+)\s*(MB|KB|GB)/i);
    if (m) {
      const v = parseFloat(m[1]);
      const u = m[2].toUpperCase();
      if (u === 'KB') totalBytes += v * 1024;
      else if (u === 'MB') totalBytes += v * 1024 * 1024;
      else if (u === 'GB') totalBytes += v * 1024 * 1024 * 1024;
    }
  });
  const totalSize = totalBytes < 1024 * 1024 ? `${(totalBytes / 1024).toFixed(1)} KB` : `${(totalBytes / (1024 * 1024)).toFixed(1)} MB`;

  const toggleCategory = (cat: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#FCF6F0]">
      {/* ═══ Dark Hero Section ═══ */}
      <div className="bg-[#3E2D1D] relative overflow-hidden">
        {/* Decorative ellipse blur */}
        <div className="absolute -right-[200px] -top-[200px] w-[1200px] h-[600px] opacity-25 pointer-events-none" style={{ transform: 'rotate(-25deg)' }}>
          <div className="w-full h-full rounded-[50%] bg-[#764D2F] blur-[75px]" />
        </div>

        {/* Top nav */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-[80px] py-[44px]">
          <div className="flex items-center">
            <p
              className="text-white text-[28px] sm:text-[33.12px] leading-[0.9807] tracking-[0.04em] text-center whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              ANKR
            </p>
          </div>
        </div>

        {/* Hero content */}
        <div className="relative z-10 px-6 sm:px-12 lg:px-[87px] pb-[88px]">
          {/* Package type badge */}
          <div className="inline-flex items-center px-[16px] py-[8px] rounded-[100px] mb-[32px] relative">
            <div aria-hidden className="absolute border border-[#FFBF7E] inset-0 rounded-[100px] pointer-events-none" />
            <span className={`${sfMed} text-[14px] text-[#FFBF7E]`} style={wdth}>
              {shareLink.packageName || 'Document Package'}
            </span>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-[8px] mb-[32px]">
            <p className={`${canela} text-[36px] sm:text-[48px] text-white leading-[1.04]`}>Document Package</p>
            <p className={`${sfMed} text-[16px] text-[#FFB680]`} style={wdth}>
              Prepared by {userName}
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex flex-wrap gap-[20px] items-center">
            {/* Documents */}
            <div className="flex gap-[10px] items-center px-[16px] py-[8px] rounded-[100px] bg-[rgba(255,239,223,0.1)] relative">
              <div aria-hidden className="absolute border-[0.5px] border-[#FCF6F0] inset-0 rounded-[100px] pointer-events-none" />
              <DocumentIcon />
              <span className={`${sfMed} text-[14px] text-[#FCF6F0]`} style={wdth}>{documents.length} Documents</span>
            </div>
            {/* Size */}
            <div className="flex gap-[10px] items-center px-[16px] py-[8px] rounded-[100px] bg-[rgba(255,239,223,0.1)] relative">
              <div aria-hidden className="absolute border-[0.5px] border-[#FCF6F0] inset-0 rounded-[100px] pointer-events-none" />
              <DownloadIcon />
              <span className={`${sfMed} text-[14px] text-[#FCF6F0]`} style={wdth}>{totalSize} Total</span>
            </div>
            {/* Days */}
            <div className="flex gap-[10px] items-center px-[16px] py-[8px] rounded-[100px] bg-[rgba(255,239,223,0.1)] relative">
              <div aria-hidden className="absolute border-[0.5px] border-[#FCF6F0] inset-0 rounded-[100px] pointer-events-none" />
              <ClockIcon />
              <span className={`${sfMed} text-[14px] text-[#FCF6F0]`} style={wdth}>{daysUntilExpiry} days remaining</span>
            </div>
            {/* Views */}
            <div className="flex gap-[10px] items-center px-[16px] py-[8px] rounded-[100px] bg-[rgba(255,239,223,0.1)] relative">
              <div aria-hidden className="absolute border-[0.5px] border-[#FCF6F0] inset-0 rounded-[100px] pointer-events-none" />
              <EyeIcon />
              <span className={`${sfMed} text-[14px] text-[#FCF6F0]`} style={wdth}>{remainingViews} views left</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Main Content ═══ */}
      <div className="relative z-20 px-6 sm:px-12 lg:px-[80px] pb-[40px] flex flex-col gap-[16px]">
        {/* ─── Package Overview Card ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-[20px] p-[33px] flex flex-col gap-[24px] -mt-[34px]"
        >
          {/* Header row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px]">
            <div className="flex flex-col gap-[8px]">
              <p className={`${canela} text-[32px] text-[#764D2F]`}>Package Overview</p>
              <p className={`${sfMed} text-[16px] text-[#8C8780]`} style={wdth}>
                {documents.length} document{documents.length !== 1 ? 's' : ''} across {categoryKeys.length} categor{categoryKeys.length !== 1 ? 'ies' : 'y'}
              </p>
            </div>
            <button className="flex gap-[10px] items-center justify-center h-[50px] px-[48px] rounded-[8px] bg-[#3E2D1D] cursor-pointer hover:bg-[#764D2F] transition-colors shrink-0">
              <DownloadIcon color="white" />
              <span className={`${sfSemi} text-[16px] text-white`} style={wdth}>Download All</span>
            </button>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-[16px]">
            {categoryKeys.map(cat => (
              <div
                key={cat}
                className="flex gap-[12px] items-center px-[16px] py-[8px] rounded-[100px] bg-[#FCF6F0] relative"
              >
                <div aria-hidden className="absolute border border-[#3E2D1D] inset-0 rounded-[100px] pointer-events-none" />
                <div className="flex gap-[8px] items-center">
                  <FolderIconSmall />
                  <span className={`${sfMed} text-[14px] text-[#3E2D1D]`} style={wdth}>{cat}</span>
                </div>
                <div className="bg-[#764D2F] rounded-full flex items-center justify-center px-[7px] py-[2px] min-w-[21px]">
                  <span className="font-['Inter',sans-serif] font-semibold text-[11px] text-white text-center leading-[16.5px] tracking-[0.065px]">{grouped[cat].length}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── Category Cards ─── */}
        {categoryKeys.map((cat, catIdx) => {
          const catDocs = grouped[cat];
          const isExpanded = expandedCategories.has(cat);

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + catIdx * 0.05 }}
              className="bg-white rounded-[20px] relative"
              style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.45)' }}
            >
              <div aria-hidden className="absolute border border-[#D0D0D0] inset-0 rounded-[20px] pointer-events-none" />
              <div className="flex flex-col gap-[24px] p-[33px]">
                {/* Category header */}
                <button
                  onClick={() => toggleCategory(cat)}
                  className="flex gap-[24px] items-center w-full cursor-pointer"
                >
                  {/* Icon */}
                  <div className="bg-[#FCF6F0] flex items-center p-[13.6px] rounded-[9.6px] shrink-0">
                    <FolderIcon color="#764D2F" size={28.8} />
                  </div>
                  {/* Title */}
                  <div className="flex-1 min-w-0 text-left">
                    <p className={`${canela} text-[24px] text-[#764D2F]`}>{cat}</p>
                    <p className={`${sfMed} text-[16px] text-[#8C8780]`} style={wdth}>
                      {catDocs.length} document{catDocs.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  {/* Chevron */}
                  <div className="shrink-0" style={{ transform: isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 0.2s ease' }}>
                    <ChevronDownIcon />
                  </div>
                </button>

                {/* Document rows */}
                {isExpanded && catDocs.map(doc => (
                  <div
                    key={doc.id}
                    className="bg-[#FFFCF9] rounded-[16px] relative"
                  >
                    <div aria-hidden className="absolute border border-[#EAEAEA] inset-0 rounded-[16px] pointer-events-none" />
                    <div className="p-[28px]">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-[16px]">
                        {/* Left: file info */}
                        <div className="flex gap-[16px] items-center">
                          <div className="shrink-0">
                            <FileUploadIcon />
                          </div>
                          <div className="flex flex-col gap-[6px] min-w-0">
                            <p className={`${sfMed} text-[16px] text-[#764D2F]`} style={wdth}>{doc.name}</p>
                            <p className={`${sfMed} text-[14px] text-[#8C8780]`} style={wdth}>
                              {doc.fileType} · {doc.fileSize} · Uploaded {doc.uploadedAt}
                            </p>
                          </div>
                        </div>
                        {/* Right: action buttons */}
                        <div className="flex gap-[8px] shrink-0">
                          <button className="flex gap-[6px] items-center justify-center px-[20px] py-[6px] rounded-[6px] bg-white relative cursor-pointer hover:bg-[#FDFBF8] transition-colors">
                            <div aria-hidden className="absolute border border-[#D0D0D0] inset-0 rounded-[6px] pointer-events-none" />
                            <EyeIconSmall />
                            <span className={`${sfMed} text-[14px] text-[#764D2F]`} style={wdth}>View</span>
                          </button>
                          <button className="flex gap-[6px] items-center justify-center px-[20px] py-[6px] rounded-[6px] bg-white relative cursor-pointer hover:bg-[#FDFBF8] transition-colors">
                            <div aria-hidden className="absolute border border-[#D0D0D0] inset-0 rounded-[6px] pointer-events-none" />
                            <DownloadIconSmall />
                            <span className={`${sfMed} text-[14px] text-[#764D2F]`} style={wdth}>Download</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}

        {/* ─── Security & Access Card ─── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-[20px] p-[33px] flex flex-col gap-[24px] relative"
          style={{ boxShadow: '0px 10px 40px 0px rgba(243,219,188,0.45)' }}
        >
          <div aria-hidden className="absolute border border-[#D0D0D0] inset-0 rounded-[20px] pointer-events-none" />

          <div className="flex flex-col gap-[16px]">
            {/* Shield icon */}
            <div className="bg-[#FCF6F0] flex items-center p-[13.6px] rounded-[9.6px] shrink-0 w-fit">
              <ShieldIcon color="#764D2F" size={28.8} />
            </div>

            {/* Title & description */}
            <div className="flex flex-col gap-[8px]">
              <p className={`${canela} text-[24px] text-[#764D2F]`}>Security & Access Information</p>
              <div className={`${sfMed} text-[16px] text-[#8C8780]`} style={wdth}>
                <p>This link was generated on {shareLink.createdAt} and will expire on {shareLink.expiresAt}. {remainingViews} views remaining. The sender can revoke access at any time.</p>
                <p>Documents are shared in read-only mode.</p>
              </div>
            </div>
          </div>

          {/* Metadata row */}
          <div className="relative pt-[21px]">
            <div aria-hidden className="absolute border-t border-[#F0ECE6] top-0 left-0 right-0 pointer-events-none" />
            <div className="flex flex-wrap gap-x-[0px]">
              {/* Created */}
              <div className="flex flex-col gap-[4px] w-[175px] shrink-0">
                <span className={`${sfSemi} text-[11px] text-[#8C8780] tracking-[0.36px]`} style={wdth}>CREATED</span>
                <div className="flex items-center gap-[6px]">
                  <CalendarIcon />
                  <span className={`${sfMed} text-[14px] text-[#3E2D1D] tracking-[-0.076px]`} style={wdth}>{shareLink.createdAt}</span>
                </div>
              </div>
              {/* Expires */}
              <div className="flex flex-col gap-[4px] w-[176px] shrink-0">
                <span className={`${sfSemi} text-[11px] text-[#8C8780] tracking-[0.36px]`} style={wdth}>EXPIRES</span>
                <div className="flex items-center gap-[6px]">
                  <ClockIconSmall />
                  <span className={`${sfMed} text-[14px] text-[#3E2D1D] tracking-[-0.076px]`} style={wdth}>{shareLink.expiresAt}</span>
                </div>
              </div>
              {/* Views Used */}
              <div className="flex flex-col gap-[4px] w-[175px] shrink-0">
                <span className={`${sfSemi} text-[11px] text-[#8C8780] tracking-[0.36px]`} style={wdth}>VIEWS USED</span>
                <div className="flex items-center gap-[6px]">
                  <EyeIconMicro />
                  <span className={`${sfMed} text-[14px] text-[#3E2D1D] tracking-[-0.076px]`} style={wdth}>{shareLink.accessCount} / {shareLink.maxAccess}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}