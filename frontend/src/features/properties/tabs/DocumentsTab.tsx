import { useState } from 'react';
import { motion } from 'motion/react';
import svgPathsCategory from '@/icons/property-documents-tab-category';
import svgPathsDocument from '@/icons/property-documents-tab-file';
import svgPathsButtons from '@/icons/property-documents-tab-actions';

/* ═══════════════════════════════════════════════════════════════════ */
/*  Types & Constants                                                */
/* ═══════════════════════════════════════════════════════════════════ */

interface Document {
  id: string;
  name: string;
  size: string;
  category: string;
  date: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
}

const CATEGORIES: Category[] = [
  { id: 'all', name: 'All Documents', count: 0 },
  { id: 'identity', name: 'Identity', count: 0 },
  { id: 'income', name: 'Income', count: 0 },
  { id: 'banking', name: 'Banking', count: 0 },
  { id: 'real-estate', name: 'Real Estate', count: 0 },
  { id: 'debt', name: 'Debt', count: 0 },
  { id: 'tax', name: 'Tax', count: 0 },
  { id: 'entity', name: 'Entity', count: 0 },
];

// Mock documents
const MOCK_DOCUMENTS: Document[] = [
  { id: '1', name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', category: 'Identity', date: '2026-03-20' },
  { id: '2', name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', category: 'Identity', date: '2026-03-20' },
  { id: '3', name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', category: 'Identity', date: '2026-03-20' },
  { id: '4', name: 'Land_Purchase_Agreement.pdf', size: '2.4 MB', category: 'Identity', date: '2026-03-20' },
];

/* ═══════════════════════════════════════════════════════════════════ */
/*  Main Component                                                   */
/* ═══════════════════════════════════════════════════════════════════ */

export function DocumentsTab({ propertyId }: { propertyId: string }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = MOCK_DOCUMENTS.filter(doc => {
    const matchesCategory = selectedCategory === 'all' || doc.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full">
      {/* Header with title and action buttons */}
      <div className="content-stretch flex flex-col sm:flex-row items-start sm:items-end justify-between relative shrink-0 w-full gap-4 mb-[24px]">
        <div className="content-stretch flex flex-col items-start relative shrink-0">
          <p
            className="leading-[normal] relative shrink-0 text-[#3e2d1d] text-[28px]"
            style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
          >
            All Documents
          </p>
        </div>
        <div className="content-stretch flex gap-[8px] items-center relative shrink-0">
          {/* New Folder Button */}
          <button className="content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#f8f6f1] transition-colors">
            <div aria-hidden="true" className="absolute border-[#3e2d1d] border-[1.5px] border-solid inset-0 pointer-events-none rounded-[8px]" />
            <div className="relative shrink-0 size-[24px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPathsButtons.p15e33e70} stroke="#3E2D1D" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[#3e2d1d] text-[16px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              New Folder
            </p>
          </button>
          {/* Upload Button */}
          <button className="bg-[#3e2d1d] content-stretch flex gap-[10px] h-[50px] items-center justify-center px-[28px] py-[10px] relative rounded-[8px] shrink-0 cursor-pointer hover:bg-[#764D2F] transition-colors">
            <div className="relative shrink-0 size-[24px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
                <path d={svgPathsButtons.p27c29e0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="font-['SF_Pro',sans-serif] font-[590] leading-[normal] relative shrink-0 text-[16px] text-white whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
              Upload
            </p>
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="content-stretch flex flex-col xl:flex-row gap-[24px] items-start relative shrink-0 w-full">
        {/* Left sidebar - Categories */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white relative rounded-[20px] shrink-0 w-full xl:w-[280px]"
        >
          <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
          <div className="content-stretch flex flex-col gap-[14px] items-start p-[21px] relative w-full">
            {/* Categories Title */}
            <div className="h-[30px] relative shrink-0 w-full">
              <p className="absolute font-['Canela_Text_Trial',sans-serif] font-medium leading-[normal] left-0 not-italic text-[#3e2d1d] text-[24px] top-[0.5px] whitespace-nowrap">Categories</p>
            </div>
            
            {/* All Documents - Active/Selected */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`h-[41px] relative rounded-[10px] shrink-0 w-full cursor-pointer transition-colors ${
                selectedCategory === 'all' ? 'bg-[#3e2d1d]' : 'hover:bg-[#F8F6F1]'
              }`}
            >
              <div className="flex flex-row items-center size-full">
                <div className="content-stretch flex items-center justify-between px-[14px] relative size-full">
                  <div className="h-[21px] relative shrink-0">
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
                      <div className={`${selectedCategory === 'all' ? 'bg-[#3e2d1d]' : 'bg-[#764d2f]'} relative rounded-[15px] shrink-0 size-[30px]`}>
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start p-[6px] relative size-full">
                          <div className="overflow-clip relative shrink-0 size-[18px]">
                            <div className="absolute inset-[13.54%_10.35%_13.54%_9.38%]">
                              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4492 13.125">
                                <path clipRule="evenodd" d={svgPathsCategory.p1caf3e80} fill="white" fillRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className={`font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[14px] ${selectedCategory === 'all' ? 'text-white' : 'text-[#3e2d1d]'} whitespace-nowrap`} style={{ fontVariationSettings: "'wdth' 100" }}>
                        All Documents
                      </p>
                    </div>
                  </div>
                  <div className={`${selectedCategory === 'all' ? 'bg-[rgba(255,255,255,0.2)]' : 'bg-[#fcf6f0]'} h-[20px] relative rounded-[16777200px] shrink-0 w-[19.977px]`}>
                    <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                      <p className={`-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[18px] left-[10.5px] not-italic text-[12px] text-center ${selectedCategory === 'all' ? 'text-white' : 'text-[#3e2d1d]'} top-[2px] whitespace-nowrap`}>
                        {MOCK_DOCUMENTS.length}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </button>

            {/* Divider */}
            <div className="bg-[#e8e4dd] h-px shrink-0 w-full" />

            {/* Other categories */}
            <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
              {CATEGORIES.slice(1).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="h-[41px] relative rounded-[10px] shrink-0 w-full cursor-pointer hover:bg-[#F8F6F1] transition-colors"
                >
                  <div className="flex flex-row items-center size-full">
                    <div className="content-stretch flex items-center justify-between px-[14px] relative size-full">
                      <div className="h-[21px] relative shrink-0">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center relative size-full">
                          <div className="bg-[#764d2f] relative rounded-[15px] shrink-0 size-[30px]">
                            <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start p-[6px] relative size-full">
                              <div className="overflow-clip relative shrink-0 size-[18px]">
                                <div className="absolute inset-[13.54%_10.35%_13.54%_9.38%]">
                                  <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14.4492 13.125">
                                    <path clipRule="evenodd" d={svgPathsCategory.p1caf3e80} fill="white" fillRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="font-['SF_Pro',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#3e2d1d] text-[14px] whitespace-nowrap" style={{ fontVariationSettings: "'wdth' 100" }}>
                            {cat.name}
                          </p>
                        </div>
                      </div>
                      <div className="bg-[#fcf6f0] h-[18.5px] relative rounded-[16777200px] shrink-0 w-[19.375px]">
                        <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                          <p className="-translate-x-1/2 absolute font-['Inter',sans-serif] font-semibold leading-[16.5px] left-[10px] not-italic text-[#3e2d1d] text-[11px] text-center top-[1.5px] tracking-[0.0645px] whitespace-nowrap">
                            {cat.count}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right content - Search and documents list */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex-1 w-full min-w-0 flex flex-col gap-[16px]"
        >
          {/* Search bar */}
          <div className="content-stretch flex h-[46px] items-start relative shrink-0 w-full">
            <div className="bg-white flex-1 h-full relative rounded-[8px]">
              <div className="flex flex-row items-center overflow-clip rounded-[inherit] size-full">
                <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[12px] py-[10px] relative size-full">
                  <div className="content-stretch flex gap-[10px] items-center relative w-full">
                    <div className="content-stretch flex items-center relative shrink-0">
                      <div className="overflow-clip relative shrink-0 size-[16px]">
                        <div className="absolute inset-[8.34%_8.38%_8.38%_8.33%]">
                          <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.3251 13.3244">
                            <path d="M5.33333 1.33257C4.27247 1.33257 3.25505 1.754 2.50491 2.50414C1.75476 3.25429 1.33333 4.2717 1.33333 5.33257C1.33333 6.39344 1.75476 7.41085 2.50491 8.161C3.25505 8.91114 4.27247 9.33257 5.33333 9.33257C6.3942 9.33257 7.41162 8.91114 8.16176 8.161C8.91191 7.41085 9.33333 6.39344 9.33333 5.33257C9.33333 4.2717 8.91191 3.25429 8.16176 2.50414C7.41162 1.754 6.3942 1.33257 5.33333 1.33257ZM3.29442e-08 5.33257C0.000121551 4.48381 0.202812 3.64734 0.591226 2.89267C0.979641 2.13799 1.54256 1.48692 2.2332 0.99356C2.92385 0.500198 3.72226 0.178793 4.5621 0.0560575C5.40194 -0.066678 6.25895 0.0128006 7.06189 0.287888C7.86484 0.562975 8.59053 1.02573 9.17867 1.63768C9.7668 2.24964 10.2004 2.99313 10.4434 3.80636C10.6864 4.61958 10.7318 5.47907 10.5758 6.31337C10.4199 7.14768 10.067 7.93272 9.54667 8.60324L13.138 12.1946C13.2594 12.3203 13.3266 12.4887 13.3251 12.6635C13.3236 12.8383 13.2535 13.0055 13.1299 13.1291C13.0063 13.2527 12.8391 13.3228 12.6643 13.3244C12.4895 13.3259 12.3211 13.2587 12.1953 13.1372L8.604 9.5459C7.81564 10.158 6.87135 10.5365 5.87851 10.6386C4.88567 10.7406 3.88413 10.562 2.98776 10.123C2.0914 9.68408 1.33619 9.00242 0.808017 8.15557C0.279839 7.30871 -0.00011088 6.33064 3.29442e-08 5.33257Z" fill="#767676" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Search documents, tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 font-['Figtree',sans-serif] font-normal leading-[21px] text-[#767676] text-[14px] bg-transparent outline-none placeholder:text-[#767676]"
                    />
                  </div>
                </div>
              </div>
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
            </div>
          </div>

          {/* Documents list */}
          <div className="flex flex-col gap-[12px] w-full">
            {filteredDocuments.map((doc, idx) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.05 }}
              >
                <DocumentRow document={doc} />
              </motion.div>
            ))}
            {filteredDocuments.length === 0 && (
              <div className="text-center py-[40px]">
                <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>
                  No documents found
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */
/*  Document Row Component                                           */
/* ═══════════════════════════════════════════════════════════════════ */

function DocumentRow({ document }: { document: Document }) {
  return (
    <div className="bg-white relative rounded-[16px] w-full hover:shadow-sm transition-shadow">
      <div className="content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[28px] relative rounded-[inherit] w-full">
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full">
          {/* Left: Icon + Info */}
          <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
            {/* PDF Icon */}
            <div className="h-[40.222px] relative shrink-0 w-[35.722px]">
              <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 35.7222 40.2222">
                <rect fill="#F3EFE6" height="40.2222" rx="4.44444" width="35.7222" />
                <path d={svgPathsDocument.p894b080} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            {/* Document Info */}
            <div className="content-stretch flex flex-col gap-[6px] items-start relative shrink-0 max-w-[464px]">
              <p className="font-['SF_Pro','Noto_Sans:Medium',sans-serif] font-[510] leading-[normal] relative shrink-0 text-[#764d2f] text-[16px] truncate w-full" style={{ fontVariationSettings: "'wdth' 100" }}>
                {document.name}
              </p>
              <div className="content-stretch flex gap-[8px] h-[20px] items-center relative shrink-0 w-full">
                <div className="h-[18px] relative shrink-0">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                    <p className="absolute font-['Inter',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#8c8780] text-[12px] top-px whitespace-nowrap">{document.size}</p>
                  </div>
                </div>
                <div className="h-[18px] relative shrink-0 w-[3.273px]">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                    <p className="absolute font-['Inter',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#d0d0d0] text-[12px] top-px whitespace-nowrap">|</p>
                  </div>
                </div>
                <div className="bg-[#f3efe6] h-[20px] relative rounded-[16777200px] shrink-0">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full px-[6px]">
                    <p className="font-['Inter',sans-serif] font-medium leading-[18px] not-italic text-[#764d2f] text-[12px] whitespace-nowrap">{document.category}</p>
                  </div>
                </div>
                <div className="h-[18px] relative shrink-0 w-[3.273px]">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                    <p className="absolute font-['Inter',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#d0d0d0] text-[12px] top-px whitespace-nowrap">|</p>
                  </div>
                </div>
                <div className="h-[18px] relative shrink-0">
                  <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
                    <p className="absolute font-['Inter',sans-serif] font-medium leading-[18px] left-0 not-italic text-[#8c8780] text-[12px] top-px whitespace-nowrap">{document.date}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Action Buttons */}
          <div className="content-stretch flex gap-[8px] items-start relative shrink-0">
            {/* Link Button */}
            <button className="bg-white content-stretch flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors">
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <div className="relative shrink-0 size-[18px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                  <path d={svgPathsDocument.p2e3d8480} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.13" />
                </svg>
              </div>
            </button>
            {/* Eye Button */}
            <button className="bg-white content-stretch flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors">
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <div className="overflow-clip relative shrink-0 size-[18px]">
                <div className="absolute inset-[16.67%_8.33%]">
                  <div className="absolute inset-[-4.69%_-3.75%]">
                    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.125 13.125">
                      <path d={svgPathsDocument.p16e43a80} stroke="#764D2F" strokeWidth="1.125" />
                      <path d={svgPathsDocument.p123590f0} stroke="#764D2F" strokeWidth="1.125" />
                    </svg>
                  </div>
                </div>
              </div>
            </button>
            {/* Download Button */}
            <button className="bg-white content-stretch flex items-center justify-center px-[8px] py-[6px] relative rounded-[6px] shrink-0 cursor-pointer hover:bg-[#F8F6F1] transition-colors">
              <div aria-hidden="true" className="absolute border border-[#d0d0d0] border-solid inset-0 pointer-events-none rounded-[6px]" />
              <div className="relative shrink-0 size-[18px]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
                  <path d={svgPathsDocument.p1b7d8060} stroke="#764D2F" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.12" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute border border-[#eaeaea] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]" />
    </div>
  );
}
