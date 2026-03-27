import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { DOCUMENT_PACKAGES, formatCurrency, getBudgetTotals, getDrawnForCategory, useApp } from '../../context/AppContext';

const BUDGET_PIE_COLORS = ['#3E2D1D', '#764D2F', '#A67B5B', '#C7AF97', '#E8DFD4'];
const canelaClass = "font-['Canela_Text_Trial',sans-serif] font-medium not-italic";
const metricIconRequest = 'https://www.figma.com/api/mcp/asset/73bc970f-f48f-4110-93dd-cebfa1fff91c';
const metricIconLender = 'https://www.figma.com/api/mcp/asset/008bf755-bfc8-4e78-95f8-eaca26a0772c';
const metricIconLineItems = 'https://www.figma.com/api/mcp/asset/b346de55-5b88-4f79-8e9c-8caef73f7475';
const metricIconBudget = 'https://www.figma.com/api/mcp/asset/239b5922-9752-4219-ba38-fe0f5c68955b';
const drawPackageIcon = 'https://www.figma.com/api/mcp/asset/e100d215-4dcc-45e8-a287-e37531b4c9de';
const docFileIcon = 'https://www.figma.com/api/mcp/asset/d2f10fe4-8a74-4368-a390-28a8fb413a0d';
const docViewIcon = 'https://www.figma.com/api/mcp/asset/244388ef-e4fa-4f74-82a4-dda957c25b5c';
const docDownloadIcon = 'https://www.figma.com/api/mcp/asset/8159cfd9-d803-4927-bef3-07237977dce2';

type DrawStep = { label: string; date: string; complete: boolean };

export function DrawDetailPage() {
  const { id, drawId } = useParams<{ id: string; drawId: string }>();
  const { state } = useApp();
  const navigate = useNavigate();

  const property = state.properties.find((p) => p.id === id);
  const draw = property?.draws.find((d) => d.id === drawId);

  if (!property || !draw) {
    return (
      <div className="p-6 text-center">
        <p className="text-[#8C8780]">Draw request not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 text-[#764D2F] text-[14px] cursor-pointer">
          Go Back
        </button>
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

  const budgetRows = useMemo(() => {
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

  const pieData = budgetRows.map((row) => ({ name: row.name, value: row.budget }));

  return (
    <div className="min-h-full bg-[#FCF6F0] px-4 sm:px-6 lg:px-[58px] pb-[56px]">
      <div className="mx-auto max-w-[1162px] pt-[28px]">
        <div className="flex items-center text-[14px] sm:text-[16px] mb-[20px]" style={{ fontWeight: 510 }}>
          <span className="text-[#764D2F]">Properties</span>
          <span className="mx-[6px] text-[#8C8780]">›</span>
          <span className="text-[#764D2F]">Draws</span>
          <span className="mx-[6px] text-[#8C8780]">›</span>
          <span className="text-[#3E2D1D]">Draw #{draw.number}</span>
        </div>

        <section className="bg-[#764D2F] rounded-[16px] p-4 sm:p-[28px] text-white">
          <div className="flex flex-col gap-[24px] xl:flex-row xl:items-center">
            <div className="flex min-w-0 flex-1 flex-col gap-[16px] md:flex-row md:items-start md:gap-[24px]">
              <div className="w-full h-[186px] rounded-[10px] overflow-hidden relative shrink-0 md:w-[259px]">
                {property.coverImage ? (
                  <>
                    <img src={property.coverImage} alt={property.name} className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/90" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-[#5A3A21]" />
                )}
                <p className={`${canelaClass} absolute left-[12px] bottom-[10px] text-[18px]`}>{property.name}</p>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[14px] sm:text-[16px]" style={{ fontWeight: 510 }}>
                  Draw #{draw.number}
                </p>
                <div className="mt-[6px] flex flex-col items-start gap-[8px] xl:flex-row xl:items-center xl:gap-[10px] xl:flex-nowrap">
                  <h1 className={`${canelaClass} text-[28px] leading-[1] break-words xl:whitespace-nowrap`}>{draw.title}</h1>
                  <span className="inline-flex shrink-0 items-center gap-[6px] rounded-[33px] border border-[#EFDFC9] bg-[#FCF6F0] px-[14px] py-[4px] text-[#764D2F] text-[12px] sm:text-[14px]">
                    <span className="size-[6px] rounded-full bg-[#C4B29A]" />
                    {draw.status}
                  </span>
                </div>
                <p className="mt-[10px] text-[14px] sm:text-[16px]" style={{ fontWeight: 510 }}>
                  {property.address}, {property.city}, {property.state}
                </p>

                <div className="mt-[16px] flex items-start gap-[10px] sm:gap-[12px] overflow-x-auto pb-[4px]">
                  {drawSteps.map((step, idx) => (
                    <div key={step.label} className="flex items-start shrink-0">
                      <div className="flex flex-col items-center w-[64px]">
                        <div
                          className={`size-[26px] rounded-full border ${step.complete ? 'bg-[#FCF6F0] border-[#FCF6F0]' : 'bg-transparent border-[#D3B597]'} flex items-center justify-center`}
                        >
                          <span className={`text-[11px] ${step.complete ? 'text-[#764D2F]' : 'text-[#D3B597]'}`}>{idx + 1}</span>
                        </div>
                        <p className="text-[10px] mt-[4px]">{step.label}</p>
                        <p className="text-[9px] opacity-80">{step.date}</p>
                      </div>
                      {idx < drawSteps.length - 1 && <div className="mt-[12px] w-[34px] h-[1px] bg-[#D3B597]" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-[12px] border-t border-white/30 xl:border-t-0 xl:pt-0 xl:text-right xl:shrink-0">
              <p className="text-[16px]" style={{ fontWeight: 510 }}>
                Total Draw Amount
              </p>
              <p className="text-[36px] sm:text-[44px] leading-[1.1]" style={{ fontWeight: 700 }}>
                {formatCurrency(draw.totalAmount)}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-[16px] grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-[16px]">
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
            <h3 className="text-[#3E2D1D] text-[34px] leading-[1.1] sm:text-[20px]" style={{ fontWeight: 590 }}>
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