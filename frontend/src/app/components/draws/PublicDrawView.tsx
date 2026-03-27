import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import {
  DOCUMENT_PACKAGES,
  formatCurrency,
  getBudgetTotals,
  getDrawnForCategory,
  type AppState,
  type DashboardProperty,
  type DrawRequest,
} from '../../context/AppContext';

const STORAGE_KEY = 'ankr_v2_state';
const BUDGET_PIE_COLORS = ['#3E2D1D', '#764D2F', '#A67B5B', '#C7AF97', '#E8DFD4'];
const canelaClass = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const metricIconRequest = '/src/assets/figma/public-draw-share/metric-icon-request.svg';
const metricIconLender = '/src/assets/figma/public-draw-share/metric-icon-lender.svg';
const metricIconLineItems = '/src/assets/figma/public-draw-share/metric-icon-line-items.svg';
const metricIconBudget = '/src/assets/figma/public-draw-share/metric-icon-budget.svg';
const drawPackageIcon = '/src/assets/figma/public-draw-share/draw-package-icon.svg';
const docFileIcon = '/src/assets/figma/public-draw-share/doc-file-icon.svg';
const docViewIcon = '/src/assets/figma/public-draw-share/doc-view-icon.svg';
const docDownloadIcon = '/src/assets/figma/public-draw-share/doc-download-icon.svg';
const headerPrintIcon = '/src/assets/figma/public-draw-share/header-print-icon.svg';
const headerLocationIcon = '/src/assets/figma/public-draw-share/header-location-icon.svg';

type DrawStep = { label: string; date: string; complete: boolean };

export function getShareUrl(propertyId: string, drawId: string): string {
  const token = btoa(`${propertyId}:${drawId}`);
  return `${window.location.origin}/share/draw/${token}`;
}

function resolveSharedDraw(parsedState: AppState, token?: string): { property: DashboardProperty | null; draw: DrawRequest | null } {
  if (!parsedState.properties.length) return { property: null, draw: null };
  if (!token) {
    const property = parsedState.properties[0] ?? null;
    return { property, draw: property?.draws?.[0] ?? null };
  }

  try {
    const [propertyId, drawId] = atob(token).split(':');
    const property = parsedState.properties.find((p) => p.id === propertyId) ?? null;
    const draw = property?.draws.find((d) => d.id === drawId) ?? null;
    if (property && draw) return { property, draw };
  } catch {
    // Keep fallback behavior for invalid or old tokens.
  }

  const fallbackProperty = parsedState.properties[0] ?? null;
  return { property: fallbackProperty, draw: fallbackProperty?.draws?.[0] ?? null };
}

export function PublicDrawView() {
  const { token } = useParams<{ token: string }>();
  const [property, setProperty] = useState<DashboardProperty | null>(null);
  const [draw, setDraw] = useState<DrawRequest | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const parsedState = JSON.parse(stored) as AppState;
    const shared = resolveSharedDraw(parsedState, token);
    setProperty(shared.property);
    setDraw(shared.draw);
  }, [token]);

  const budgetRows = useMemo(() => {
    if (!property) return [];
    return property.budget.categories
      .map((cat) => {
        const budget = cat.items.reduce((s, i) => s + i.budget, 0);
        const drawn = getDrawnForCategory(cat.id, property.draws);
        if (!budget) return null;
        const pct = Math.round((drawn / budget) * 100);
        return { id: cat.id, name: cat.name, budget, drawn, pct };
      })
      .filter(Boolean) as { id: string; name: string; budget: number; drawn: number; pct: number }[];
  }, [property]);

  if (!property || !draw) {
    return (
      <div className="min-h-screen bg-[#FCF6F0] flex items-center justify-center">
        <p className="text-[#8C8780] text-[16px]">Loading draw information...</p>
      </div>
    );
  }

  const totals = getBudgetTotals(property.budget, property.draws);
  const drawPercent = totals.totalBudget > 0 ? Math.round((totals.totalDrawn / totals.totalBudget) * 100) : 0;
  const drawSteps: DrawStep[] = [
    { label: 'Created', date: draw.requestDate, complete: true },
    { label: 'Submitted', date: draw.submittedDate || draw.requestDate, complete: draw.status !== 'Draft' },
    {
      label: draw.status === 'Rejected' ? 'Rejected' : 'Approved',
      date: draw.status === 'Rejected' ? draw.submittedDate || '' : draw.approvedDate || '',
      complete: draw.status === 'Approved' || draw.status === 'Funded' || draw.status === 'Rejected',
    },
    { label: 'Funded', date: draw.fundedDate || '', complete: draw.status === 'Funded' },
  ];

  const docPackage = draw.documentPackageId ? DOCUMENT_PACKAGES.find((d) => d.id === draw.documentPackageId) : null;

  const pieData = budgetRows.map((row) => ({ name: row.name, value: row.budget }));

  return (
    <div className="min-h-screen bg-[#FCF6F0]">
      <section className="bg-[#3E2D1D] px-4 sm:px-6 md:px-8 xl:px-[80px] pt-[24px] sm:pt-[30px] xl:pt-[40px] pb-[44px] sm:pb-[56px] xl:pb-[80px]">
        <div className="mx-auto max-w-[1352px]">
          <div className="flex flex-wrap items-start sm:items-center justify-between mb-[28px] sm:mb-[36px] xl:mb-[60px] gap-[10px] sm:gap-[14px]">
            <p
              className="text-white text-[24px] leading-[24px] sm:text-[28px] sm:leading-[28px] xl:text-[32.78px] xl:leading-[32.146px] tracking-[1.3112px] whitespace-nowrap"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              ANKR
            </p>
            <div className="flex flex-wrap items-center justify-end gap-[8px] sm:gap-[12px] xl:gap-[16px]">
              <button
                onClick={() => window.print()}
                className="inline-flex h-[38px] sm:h-[44px] xl:h-[50px] items-center gap-[6px] sm:gap-[8px] xl:gap-[10px] rounded-[8px] border-[1.5px] border-white px-[12px] sm:px-[18px] xl:px-[28px] py-[6px] sm:py-[8px] xl:py-[10px] text-white hover:bg-white/10"
              >
                <img src={headerPrintIcon} alt="" className="size-[14px] sm:size-[18px] xl:size-[24px]" />
                <span className="text-[12px] sm:text-[14px] xl:text-[16px] leading-none" style={{ fontWeight: 590 }}>
                  Print
                </span>
              </button>
              <div className="inline-flex items-center gap-[6px] sm:gap-[8px] xl:gap-[10px] rounded-[100px] bg-[rgba(255,239,223,0.4)] px-[10px] sm:px-[12px] xl:px-[16px] py-[4px] text-white">
                <HeaderEyeIcon className="size-[14px] sm:size-[18px] xl:size-[24px]" />
                <span className="text-[12px] sm:text-[14px] xl:text-[16px] leading-none whitespace-nowrap" style={{ fontWeight: 510 }}>
                  Read Only
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] xl:flex gap-[20px] sm:gap-[24px] xl:gap-[32px] xl:items-start">
            <div className="w-full h-[190px] sm:h-[220px] md:h-[230px] xl:h-[261.416px] max-w-full md:max-w-[320px] xl:max-w-[364.015px] rounded-[10px] xl:rounded-[14.055px] overflow-hidden relative shrink-0">
              {property.coverImage ? (
                <>
                  <img src={property.coverImage} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
                </>
              ) : (
                <div className="absolute inset-0 bg-[#5A3A21]" />
              )}
              <p className={`${canelaClass} absolute left-[12px] sm:left-[14px] xl:left-[16.86px] bottom-[10px] sm:bottom-[12px] xl:bottom-[16px] text-[20px] sm:text-[24px] xl:text-[30px] text-white leading-none max-w-[90%] truncate`}>{property.name}</p>
            </div>

            <div className="min-w-0 xl:flex-1 xl:pr-[32px]">
              <div className="md:flex md:items-start md:justify-between md:gap-[18px]">
                <div className="min-w-0">
                  <span className="inline-flex items-center rounded-[100px] border border-[#FFBF7E] bg-[rgba(255,239,223,0.1)] px-[12px] sm:px-[14px] xl:px-[16px] py-[6px] sm:py-[7px] xl:py-[8px] text-[#FFBF7E] text-[12px] sm:text-[13px] xl:text-[14px] leading-none">
                Draw #{draw.number}
                  </span>
                  <h1 className={`${canelaClass} text-[30px] leading-[1.08] sm:text-[36px] sm:leading-[1.06] md:text-[38px] md:leading-[1.05] xl:text-[48px] xl:leading-[50px] text-white mt-[8px] break-words`}>{draw.title}</h1>
                  <p className="mt-[6px] text-[#FFB680] text-[13px] sm:text-[15px] xl:text-[16px] flex items-center gap-[5px] break-words">
                    <img src={headerLocationIcon} alt="" className="size-[16px] sm:size-[18px] xl:size-[20px]" />
                {property.address}, {property.city}, {property.state}
                  </p>
                </div>

                <div className="hidden md:block xl:hidden shrink-0 text-right pt-[6px]">
                  <p className="text-[#FFB680] text-[14px]" style={{ fontWeight: 510 }}>
                    Total Draw Amount
                  </p>
                  <p className="text-white text-[34px] leading-[1.05]" style={{ fontWeight: 700 }}>
                    {formatCurrency(draw.totalAmount)}
                  </p>
                </div>
              </div>

              <div className="mt-[14px] sm:mt-[16px] lg:mt-[20px] flex items-start gap-[0px] overflow-x-auto pb-[6px]">
                <div className="flex items-start min-w-max">
                {drawSteps.map((step, idx) => (
                  <div key={step.label} className="flex items-start shrink-0">
                    <div className="flex flex-col items-center w-[68px] sm:w-[74px] xl:w-[82.236px]">
                      <div
                        className={`size-[32px] sm:size-[36px] xl:size-[40.204px] rounded-full border ${step.complete ? 'bg-transparent border-[#FCF6F0]' : 'bg-transparent border-[#D3B597]'} flex items-center justify-center`}
                      >
                        {step.complete && <span className="text-[16px] sm:text-[18px] xl:text-[20px] text-[#FCF6F0] leading-none">✓</span>}
                      </div>
                      <p className="text-[12px] sm:text-[14px] xl:text-[16px] mt-[5px] sm:mt-[6px] xl:mt-[7.31px] text-white leading-none">{step.label}</p>
                      <p className="text-[10px] sm:text-[12px] xl:text-[14px] mt-[3px] sm:mt-[4px] xl:mt-[5.318px] text-[#FFB680] leading-none">{step.date}</p>
                    </div>
                    {idx < drawSteps.length - 1 && <div className="mt-[15px] sm:mt-[16px] xl:mt-[18.275px] w-[34px] sm:w-[46px] xl:w-[61.525px] h-[1px] xl:h-[1.827px] bg-[#D3B597]" />}
                  </div>
                ))}
                </div>
              </div>
            </div>

            <div className="text-left sm:text-right hidden xl:flex xl:text-right xl:shrink-0 xl:h-[186px] xl:flex-col xl:justify-center">
              <p className="text-[#FFB680] text-[16px]" style={{ fontWeight: 510 }}>
                Total Draw Amount
              </p>
              <p className="text-white text-[48px] leading-[61px]" style={{ fontWeight: 700 }}>
                {formatCurrency(draw.totalAmount)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-[58px] pb-[56px] mt-[16px] lg:-mt-[36px]">
        <div className="mx-auto max-w-[1162px]">
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px]">
            <MetricCard iconSrc={metricIconRequest} label="Request Date" value={draw.requestDate} />
            <MetricCard iconSrc={metricIconLender} label="Lender" value={draw.lenderName || 'N/A'} />
            <MetricCard iconSrc={metricIconLineItems} label="Line Items" value={`${draw.lineItems.length} categories`} />
            <MetricCard iconSrc={metricIconBudget} label="Budget Drawn" value={`${drawPercent}% of total`} />
          </section>

          <section className="mt-[16px] rounded-[20px] border border-[#D0D0D0] bg-white p-[10px] sm:p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
            <h2 className={`${canelaClass} text-[#3E2D1D] text-[24px] mb-[16px]`}>Draw Line Items</h2>
            <div className="overflow-x-auto rounded-[16px] border border-[#D0D0D0] bg-[#FFFBF6]">
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] bg-[#FAFAF9] border-b border-[#D0D0D0] px-[20px] py-[10px] text-[#8C8780] text-[11px] uppercase tracking-[0.61px]">
                  <span>Category</span>
                  <span>Budget</span>
                  <span>Prev. Drawn</span>
                  <span>This Draw</span>
                  <span className="text-right">% Complete</span>
                </div>
                {draw.lineItems.map((li) => {
                  const pct = li.budgetAmount > 0 ? Math.round((li.requestedAmount / li.budgetAmount) * 100) : 0;
                  return (
                    <div key={li.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-[20px] py-[14px] border-b border-[#F5F3EF] text-[14px]">
                      <div>
                        <p className="text-[#3E2D1D]" style={{ fontWeight: 510 }}>{li.categoryName}</p>
                        <p className="text-[#8C8780] text-[12px]">({pct}% of budget)</p>
                      </div>
                      <p className="text-[#8C8780]">{formatCurrency(li.budgetAmount)}</p>
                      <p className="text-[#8C8780]">{formatCurrency(li.previouslyDrawn)}</p>
                      <p className="text-[#3E2D1D]" style={{ fontWeight: 700 }}>{formatCurrency(li.requestedAmount)}</p>
                      <p className="text-right text-[#8C8780]">{li.percentComplete}%</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {docPackage && (
            <section className="mt-[16px] rounded-[16px] border border-[#D0D0D0] bg-white p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
              <div className="mb-[16px] inline-flex items-center justify-center rounded-[6px] bg-[#FCF6F0] p-[8.5px]">
                <img src={drawPackageIcon} alt="" className="size-[21px]" />
              </div>
              <h3 className="text-[#3E2D1D] text-[20px]" style={{ fontWeight: 590 }}>
                {docPackage.name}
              </h3>
              <p className="text-[#8C8780] text-[13px] mt-[4px]">{docPackage.description}</p>
              <div className="mt-[12px] flex flex-wrap gap-[8px]">
                {docPackage.documents.slice(0, 3).map((doc) => (
                  <span key={doc} className="rounded-[100px] bg-[#FCF6F0] px-[16px] py-[4px] text-[#764D2F] text-[14px]" style={{ fontWeight: 510 }}>
                    {doc}
                  </span>
                ))}
              </div>
            </section>
          )}

          <section className="mt-[16px] rounded-[20px] border border-[#D0D0D0] bg-white p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
            <h2 className={`${canelaClass} text-[#3E2D1D] text-[24px] mb-[16px]`}>Budget Tracker</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-[30px] items-center">
              <div className="flex flex-col items-center">
                <div className="relative h-[280px] w-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData.length ? pieData : [{ name: 'none', value: 1 }]}
                        dataKey="value"
                        innerRadius={78}
                        outerRadius={122}
                        stroke="#FCF6F0"
                        strokeWidth={6}
                      >
                        {(pieData.length ? pieData : [{ name: 'none', value: 1 }]).map((_, idx) => (
                          <Cell key={idx} fill={pieData.length ? BUDGET_PIE_COLORS[idx % BUDGET_PIE_COLORS.length] : '#E8DFD4'} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                    <p className="text-[#764D2F] text-[17px]">Total Budget</p>
                    <p className="text-[#3E2D1D] text-[48px] leading-[1]" style={{ fontWeight: 700 }}>
                      {formatCompactCurrency(totals.totalBudget)}
                    </p>
                  </div>
                </div>
                <div className="mt-[14px] flex flex-wrap items-center justify-center gap-x-[17px] gap-y-[7px] text-[12px] text-[#3E2D1D]">
                  {budgetRows.map((row, idx) => (
                    <span key={row.id} className="inline-flex items-center gap-[5px]">
                      <span className="size-[10px] rounded-[2px]" style={{ backgroundColor: BUDGET_PIE_COLORS[idx % BUDGET_PIE_COLORS.length] }} />
                      {row.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-[16px]">
                {budgetRows.map((row) => (
                  <BudgetProgressRow key={row.id} name={row.name} budget={row.budget} drawn={row.drawn} />
                ))}
              </div>
            </div>
          </section>

          <section className="mt-[16px] rounded-[20px] border border-[#D0D0D0] bg-white p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
            <h2 className={`${canelaClass} text-[#3E2D1D] text-[24px] mb-[16px]`}>Supporting Documents</h2>
            <div className="space-y-[10px]">
              {draw.attachments.map((att) => (
                <div key={att.id} className="flex flex-col sm:flex-row sm:items-center gap-[16px] rounded-[16px] border border-[#EAEAEA] bg-[#FFFCF9] px-[16px] py-[18px] sm:px-[28px] sm:py-[20px]">
                  <div className="inline-flex items-center justify-center h-[40.222px] w-[35.722px] rounded-[6px] bg-[#FCF6F0] text-[#764D2F]">
                    <img src={docFileIcon} alt="" className="h-[24px] w-[22px]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#764D2F] text-[16px] truncate" style={{ fontWeight: 510 }}>{att.name}</p>
                    <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>{att.type} · {att.size} · Uploaded {att.uploadedAt}</p>
                  </div>
                  <div className="flex items-center gap-[8px]">
                    <button className="inline-flex items-center gap-[6px] rounded-[6px] border border-[#D0D0D0] bg-white px-[20px] py-[6px] text-[#764D2F] text-[14px] hover:bg-[#FCF6F0]">
                      <img src={docViewIcon} alt="" className="size-[18px]" />
                      View
                    </button>
                    <button className="inline-flex items-center gap-[6px] rounded-[6px] border border-[#D0D0D0] bg-white px-[20px] py-[6px] text-[#764D2F] text-[14px] hover:bg-[#FCF6F0]">
                      <img src={docDownloadIcon} alt="" className="size-[18px]" />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {draw.notes && (
            <section className="mt-[16px] rounded-[20px] border border-[#D0D0D0] bg-white p-[24px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)]">
              <h2 className={`${canelaClass} text-[#3E2D1D] text-[24px] mb-[16px]`}>Notes</h2>
              <div className="rounded-[16px] border border-[#EAEAEA] bg-[#FDFDFD] px-[28px] py-[20px] text-[16px] text-[#764D2F]" style={{ fontWeight: 510 }}>
                {draw.notes}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ iconSrc, label, value }: { iconSrc: string; label: string; value: string }) {
  return (
    <div className="rounded-[16px] border border-[#D0D0D0] bg-white px-[28px] py-[20px] shadow-[0px_10px_40px_0px_rgba(243,219,188,0.45)] min-h-[143px] flex flex-col justify-center">
      <div className="mb-[16px] inline-flex w-fit items-center justify-center rounded-[6px] bg-[#FCF6F0] p-[8.5px]">
        <img src={iconSrc} alt="" className="size-[21px]" />
      </div>
      <p className="text-[#764D2F] text-[14px]" style={{ fontWeight: 510 }}>
        {label}
      </p>
      <p className="text-[#3E2D1D] text-[20px]" style={{ fontWeight: 700 }}>
        {value}
      </p>
    </div>
  );
}

function BudgetProgressRow({ name, budget, drawn }: { name: string; budget: number; drawn: number }) {
  const pct = budget > 0 ? Math.min(100, Math.round((drawn / budget) * 100)) : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-[#3E2D1D] text-[14px]" style={{ fontWeight: 510 }}>
        <span>{name}</span>
        <span>{formatCurrency(budget)}</span>
      </div>
      <div className="mt-[7px] h-[7px] rounded-[100px] bg-[#D9D9D9]">
        <div className="h-full rounded-[100px] bg-[#3E2D1D]" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-[8px] flex items-center justify-between text-[#764D2F] text-[14px]" style={{ fontWeight: 510 }}>
        <span>{pct >= 100 ? 'Fully drawn' : `${pct}% drawn`}</span>
        <span>{formatCurrency(drawn)}</span>
      </div>
    </div>
  );
}

function formatCompactCurrency(value: number) {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return formatCurrency(value);
}

function HeaderEyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 12C22 12 18 5 12 5C6 5 2 12 2 12C2 12 6 19 12 19C18 19 22 12 22 12Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}