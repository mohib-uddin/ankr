import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useApp, getBudgetTotals, formatCurrency } from '../../context/AppContext';
import type { DashboardProperty } from '../../context/AppContext';
import svgPaths from '@/icons/dashboard-shared';

const STATUS_COLORS: Record<string, string> = {
  Active: 'bg-[#F0FDF4] text-[#16A34A]',
  'Under Contract': 'bg-[#FFF7ED] text-[#C2410C]',
  Closed: 'bg-[#F1F5F9] text-[#475569]',
  Acquisition: 'bg-[#EEF2FF] text-[#4338CA]',
};

function LocationIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
      <g transform="translate(2.5,1.67)">
        <path clipRule="evenodd" d={svgPaths.p36ed300} fill="#8C8780" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p12b38500} fill="#8C8780" fillRule="evenodd" />
      </g>
    </svg>
  );
}

export function PropertiesPage() {
  const { state } = useApp();
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 lg:px-[58px] py-[40px]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-[36px] gap-[16px]">
        <div>
          <h1
            className="text-[28px] text-[#3E2D1D] mb-[8px]"
            style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}
          >
            Properties
          </h1>
          <p
            className="text-[16px] text-[#764D2F]"
            style={{ fontFamily: "'SF Pro', -apple-system, sans-serif", fontWeight: 510, fontVariationSettings: "'wdth' 100" }}
          >
            {state.properties.length} {state.properties.length === 1 ? 'property' : 'properties'} in your portfolio
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/properties/new')}
          className="flex items-center gap-[10px] h-[50px] px-[48px] py-[10px] bg-[#3E2D1D] text-white rounded-[8px] text-[16px] hover:bg-[#2C1F14] transition-colors cursor-pointer self-start sm:self-auto"
          style={{ fontWeight: 590 }}
        >
          <Plus className="w-[18px] h-[18px]" />
          Add Property
        </button>
      </div>

      {/* Empty state */}
      {state.properties.length === 0 && (
        <div className="bg-white rounded-[20px] border border-[#D0D0D0] p-[60px] text-center">
          <p className="text-[24px] text-[#3E2D1D] mb-[8px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>
            No properties yet
          </p>
          <p className="text-[16px] text-[#8C8780] max-w-[380px] mx-auto mb-[24px]" style={{ fontWeight: 510 }}>
            Add your first property to start tracking budgets, pro forma, and draw requests.
          </p>
          <button
            onClick={() => navigate('/dashboard/properties/new')}
            className="inline-flex items-center gap-[10px] h-[50px] px-[48px] py-[10px] bg-[#3E2D1D] text-white rounded-[8px] text-[16px] hover:bg-[#2C1F14] transition-colors cursor-pointer"
            style={{ fontWeight: 590 }}
          >
            <Plus className="w-[18px] h-[18px]" /> Add your first property
          </button>
        </div>
      )}

      {/* Property grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-[24px]">
        {state.properties.map((prop, i) => (
          <PropertyCard key={prop.id} property={prop} index={i} onClick={() => navigate(`/dashboard/properties/${prop.id}`)} />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ property, index, onClick }: { property: DashboardProperty; index: number; onClick: () => void }) {
  const totals = getBudgetTotals(property.budget, property.draws);
  const drawPct = totals.totalBudget > 0 ? Math.round((totals.totalDrawn / totals.totalBudget) * 100) : 0;
  const activeDraw = property.draws.filter(d => d.status !== 'Draft' && d.status !== 'Funded').length;

  function formatCompact(n: number): string {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      onClick={onClick}
      className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden cursor-pointer hover:shadow-md transition-all group"
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={property.coverImage}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)' }} />
        {/* Status badge */}
        <div className="absolute top-[16px] left-[16px]">
          <span className="border border-white rounded-[26px] px-[16px] py-[4px] text-white text-[12px]" style={{ fontWeight: 510 }}>
            {property.status}
          </span>
        </div>
        {/* Name overlay */}
        <div className="absolute bottom-[16px] left-[20px] right-[20px]">
          <p className="text-white text-[24px]" style={{ fontFamily: "'Canela Text Trial', sans-serif", fontWeight: 500 }}>{property.name}</p>
          <div className="flex items-center gap-[4px] mt-[4px]">
            <LocationIcon />
            <span className="text-white/80 text-[14px]" style={{ fontWeight: 510 }}>{property.address}, {property.city}, {property.state}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-[24px]">
        {/* Stats row */}
        <div className="flex items-center justify-between mb-[20px]">
          <div className="text-center flex-1">
            <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>Units</p>
            <p className="text-[#3E2D1D] text-[20px] mt-[4px]" style={{ fontWeight: 700 }}>{property.units}</p>
          </div>
          <div className="w-px h-[40px] bg-[#D9D9D9]" />
          <div className="text-center flex-1">
            <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>Sq.Ft</p>
            <p className="text-[#3E2D1D] text-[20px] mt-[4px]" style={{ fontWeight: 700 }}>{property.sqft.toLocaleString()}</p>
          </div>
          <div className="w-px h-[40px] bg-[#D9D9D9]" />
          <div className="text-center flex-1">
            <p className="text-[#8C8780] text-[14px]" style={{ fontWeight: 510 }}>Budget</p>
            <p className="text-[#3E2D1D] text-[20px] mt-[4px]" style={{ fontWeight: 700 }}>{formatCompact(totals.totalBudget)}</p>
          </div>
        </div>

        {/* Budget progress */}
        <div>
          <div className="flex items-center justify-between text-[14px] mb-[8px]" style={{ fontWeight: 510 }}>
            <span className="text-[#8C8780]">Draw Progress</span>
            <span className="text-[#3E2D1D]">{drawPct}% drawn</span>
          </div>
          <div className="h-[7px] rounded-[100px] bg-[#D9D9D9] overflow-hidden">
            <div className="h-full bg-[#3E2D1D] rounded-[100px] transition-all" style={{ width: `${drawPct}%` }} />
          </div>
          <div className="flex items-center justify-between text-[14px] mt-[8px]" style={{ fontWeight: 510 }}>
            <span className="text-[#8C8780]">{formatCurrency(totals.totalDrawn)} drawn</span>
            <span className="text-[#3E2D1D]">ARV: {formatCurrency(property.proforma.afterRepairValue)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}