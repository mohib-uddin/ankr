import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useApp, getBudgetTotals, formatCurrency } from '../../context/AppContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import svgPaths from '@/icons/dashboard-shared';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function ChevronRightArrow() {
  return (
    <svg width="13" height="10" viewBox="0 0 9.53742 12.9993" fill="none" style={{ transform: 'rotate(90deg)' }}>
      <path d={svgPaths.pec28900} fill="#3E2D1D" />
    </svg>
  );
}

const STATUS_COLOR: Record<string, string> = {
  Active: 'bg-[#F0FDF4] text-[#16A34A]',
  'Under Contract': 'bg-[#FFF7ED] text-[#C2410C]',
  Closed: 'bg-[#F1F5F9] text-[#475569]',
  Acquisition: 'bg-[#EEF2FF] text-[#4338CA]',
};

export function DashboardHome() {
  const { state } = useApp();
  const navigate = useNavigate();
  const firstName = (state.userName || 'Investor').split(' ')[0];

  // Compute portfolio stats
  let totalBudget = 0;
  let totalDrawn = 0;
  let totalSpent = 0;
  let totalARV = 0;

  state.properties.forEach(prop => {
    const totals = getBudgetTotals(prop.budget, prop.draws);
    totalBudget += totals.totalBudget;
    totalDrawn += totals.totalDrawn;
    totalSpent += totals.totalActual;
    totalARV += prop.proforma.afterRepairValue;
  });

  function formatCompact(n: number): string {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString();
  }

  // Chart data per property – use unique display names
  const chartData = state.properties.map((p, idx) => {
    const t = getBudgetTotals(p.budget, p.draws);
    const displayName = p.name || `Property ${idx + 1}`;
    return {
      name: `${displayName}__${p.id || idx}`,
      displayName,
      Budget: Math.round((t.totalBudget || 0) / 1000),
      Drawn: Math.round((t.totalDrawn || 0) / 1000),
      Spent: Math.round((t.totalActual || 0) / 1000),
    };
  }).filter((d, i, arr) => arr.findIndex(x => x.name === d.name) === i);

  // Recent draws across all properties
  const recentActivity = state.properties
    .flatMap(p => p.draws.map(d => ({ ...d, propName: p.name, propId: p.id })))
    .sort((a, b) => b.requestDate.localeCompare(a.requestDate))
    .slice(0, 4);

  const stats = [
    { label: 'Properties', value: String(state.properties.length) },
    { label: 'Total Budget', value: formatCompact(totalBudget) },
    { label: 'Total Drawn', value: formatCompact(totalDrawn) },
    { label: 'Portfolio ARV', value: formatCompact(totalARV) },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] py-[28px] sm:py-[40px] max-w-[1200px]">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p
          className="text-[28px] sm:text-[36px] text-[#3E2D1D] mb-[4px]"
          style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
        >
          {getGreeting()}, {firstName}
        </p>
        <p className="text-[16px] text-[#8C8780] mb-[36px]" style={{ fontWeight: 510 }}>
          Here's your portfolio at a glance.
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="bg-white rounded-[16px] border border-[#EAEAEA] flex flex-col items-center justify-center p-[28px]"
          >
            <p className="text-[#3E2D1D] text-[16px] text-center w-full" style={{ fontWeight: 510 }}>{s.label}</p>
            <p className="text-[#3E2D1D] text-[24px] sm:text-[36px] text-center w-full mt-[8px]" style={{ fontWeight: 700 }}>{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-[24px]">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
          <div className="flex items-center justify-between mb-[24px]">
            <p className="text-[#3E2D1D] text-[24px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Budget Overview
            </p>
            <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>All amounts in thousands (K)</p>
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} barGap={4} barSize={18}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#8C8780' }} tickFormatter={(v: string) => v.split('__')[0]} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#8C8780' }} tickFormatter={v => `$${v}K`} />
                <Tooltip
                  contentStyle={{ border: '1px solid #D0D0D0', borderRadius: 12, fontSize: 12, fontWeight: 510 }}
                  formatter={(v: number, name: string) => [`$${v}K`, name]}
                  labelFormatter={(label: string) => label.split('__')[0]}
                />
                <Bar name="Budget" dataKey="Budget" fill="#D9D9D9" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar name="Drawn" dataKey="Drawn" fill="#3E2D1D" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Bar name="Spent" dataKey="Spent" fill="#C7AF97" radius={[4, 4, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-[#8C8780] text-[14px]">
              No properties yet
            </div>
          )}
          <div className="flex items-center gap-[24px] mt-[16px]">
            {[{ color: '#D9D9D9', label: 'Budget' }, { color: '#3E2D1D', label: 'Drawn' }, { color: '#C7AF97', label: 'Spent' }].map(l => (
              <div key={l.label} className="flex items-center gap-[6px]">
                <div className="w-[12px] h-[12px] rounded-[3px]" style={{ background: l.color }} />
                <span className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions + activity */}
        <div className="flex flex-col gap-[24px]">
          {/* Quick actions */}
          <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
            <p className="text-[#3E2D1D] text-[18px] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Quick Actions
            </p>
            <div className="flex flex-col gap-[8px]">
              <QuickAction label="Add Property" onClick={() => navigate('/dashboard/properties/new')} />
              <QuickAction label="View Draw Requests" onClick={() => navigate('/dashboard/properties')} />
              <QuickAction label="Upload Document" onClick={() => navigate('/dashboard/documents')} />
            </div>
          </div>

          {/* Recent activity */}
          <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
            <p className="text-[#3E2D1D] text-[18px] mb-[16px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Recent Draws
            </p>
            {recentActivity.length === 0 ? (
              <p className="text-[14px] text-[#8C8780] text-center py-[16px]" style={{ fontWeight: 510 }}>No activity yet</p>
            ) : (
              <div className="flex flex-col gap-[12px]">
                {recentActivity.map(draw => (
                  <div
                    key={draw.id}
                    onClick={() => navigate(`/dashboard/properties/${draw.propId}`)}
                    className="flex items-start justify-between cursor-pointer hover:bg-[#FCF6F0] rounded-[8px] p-[8px] -mx-[8px] transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] text-[#3E2D1D] truncate" style={{ fontWeight: 510 }}>{draw.title}</p>
                      <p className="text-[14px] text-[#8C8780]" style={{ fontWeight: 510 }}>{draw.propName} · {draw.requestDate}</p>
                    </div>
                    <DrawStatusBadge status={draw.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Properties quick view */}
      {state.properties.length > 0 && (
        <div className="mt-[24px] bg-white rounded-[20px] border border-[#D0D0D0] p-[24px]">
          <div className="flex items-center justify-between mb-[24px]">
            <p className="text-[#3E2D1D] text-[24px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
              Your Properties
            </p>
            <button
              onClick={() => navigate('/dashboard/properties')}
              className="flex items-center gap-[6px] cursor-pointer"
            >
              <span className="text-[#3E2D1D] text-[16px]" style={{ fontWeight: 700 }}>View all</span>
              <ChevronRightArrow />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-[16px]">
            {state.properties.slice(0, 4).map(prop => {
              const t = getBudgetTotals(prop.budget, prop.draws);
              const pct = t.totalBudget > 0 ? Math.round((t.totalDrawn / t.totalBudget) * 100) : 0;
              return (
                <div
                  key={prop.id}
                  onClick={() => navigate(`/dashboard/properties/${prop.id}`)}
                  className="flex items-center gap-[16px] p-[16px] border border-[#EAEAEA] rounded-[12px] cursor-pointer hover:bg-[#FCF6F0] transition-all"
                >
                  <img src={prop.coverImage} alt={prop.name} className="w-[56px] h-[56px] rounded-[12px] object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[16px] text-[#3E2D1D] truncate" style={{ fontWeight: 510 }}>{prop.name}</p>
                    <p className="text-[14px] text-[#8C8780] truncate" style={{ fontWeight: 510 }}>{prop.city}, {prop.state}</p>
                    <div className="flex items-center gap-[8px] mt-[8px]">
                      <div className="flex-1 h-[7px] rounded-[100px] bg-[#D9D9D9] overflow-hidden">
                        <div className="h-full bg-[#3E2D1D] rounded-[100px]" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-[14px] text-[#8C8780] shrink-0" style={{ fontWeight: 510 }}>{pct}% drawn</span>
                    </div>
                  </div>
                  <span className={`text-[12px] px-[12px] py-[4px] rounded-[100px] shrink-0 ${STATUS_COLOR[prop.status] || 'bg-[#F1F5F9] text-[#475569]'}`} style={{ fontWeight: 510 }}>
                    {prop.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function QuickAction({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-[12px] py-[12px] rounded-[8px] hover:bg-[#FCF6F0] text-[#3E2D1D] transition-colors cursor-pointer text-left"
    >
      <span className="text-[16px]" style={{ fontWeight: 510 }}>{label}</span>
      <ChevronRightSmall />
    </button>
  );
}

function ChevronRightSmall() {
  return (
    <svg width="10" height="13" viewBox="0 0 9.53742 12.9993" fill="none" style={{ transform: 'rotate(90deg)' }}>
      <path d={svgPaths.pec28900} fill="#8C8780" />
    </svg>
  );
}

function DrawStatusBadge({ status }: { status: string }) {
  const label = status === 'Draft' ? 'Pending' : status;
  return (
    <span className="bg-[#FCF6F0] text-[#3E2D1D] text-[14px] px-[16px] py-[4px] rounded-[100px] shrink-0" style={{ fontWeight: 510 }}>
      {label}
    </span>
  );
}