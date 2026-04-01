import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { getBudgetTotals, formatCurrency } from '@/app/context/AppContext';
import type { DashboardProperty } from '@/app/context/AppContext';
import { usePropertiesInfiniteQuery } from '@/services/properties.service';
import { getApiErrorMessage } from '@/shared/utils/axios';
import { mapBackendPropertyToDashboardProperty } from '@/features/properties/types/properties.types';
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
  const { data, isLoading, isError, error, hasNextPage, isFetchingNextPage, fetchNextPage } =
    usePropertiesInfiniteQuery();
  const navigate = useNavigate();

  const intersectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = intersectionRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(
      entries => {
        const first = entries[0];
        if (first.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: '200px', threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const flatPages = data?.pages ?? [];
  const properties: DashboardProperty[] = flatPages
    .flatMap(page => page.data ?? [])
    .map(mapBackendPropertyToDashboardProperty);

  const total = flatPages[0]?.total ?? properties.length;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-[24px]">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonPropertyCard key={idx} index={idx} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <div className="bg-white rounded-[20px] border border-[#F97373] p-[40px] text-center">
          <p className="text-[18px] text-[#3E2D1D] mb-[8px]" style={{ fontWeight: 600 }}>
            Unable to load properties
          </p>
          <p className="text-[14px] text-[#8C8780] mb-[16px]" style={{ fontWeight: 510 }}>
            {getApiErrorMessage(error)}
          </p>
          <button
            onClick={() => navigate(0)}
            className="inline-flex items-center gap-[8px] h-[40px] px-[24px] py-[8px] bg-[#3E2D1D] text-white rounded-[8px] text-[14px] hover:bg-[#2C1F14] transition-colors cursor-pointer"
            style={{ fontWeight: 590 }}
          >
            Try again
          </button>
        </div>
      );
    }

    if (properties.length === 0) {
      return (
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
      );
    }

    return (
      <>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-[24px]">
          {properties.map((prop, i) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              index={i}
              onClick={() => navigate(`/dashboard/properties/${prop.id}`)}
            />
          ))}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, idx) => (
              <SkeletonPropertyCard key={`skeleton-${idx}`} index={properties.length + idx} />
            ))}
        </div>
        {hasNextPage && (
          <div ref={intersectionRef} className="h-[1px] w-full mt-[8px]" />
        )}
      </>
    );
  };

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
            {total} {total === 1 ? 'property' : 'properties'} in your portfolio
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

      {renderContent()}
    </div>
  );
}

function PropertyCard({ property, index, onClick }: { property: DashboardProperty; index: number; onClick: () => void }) {
  const totals = getBudgetTotals(property.budget, property.draws);
  const drawPct = totals.totalBudget > 0 ? Math.round((totals.totalDrawn / totals.totalBudget) * 100) : 0;
  const activeDraw = property.draws.filter(d => d.status !== 'Draft' && d.status !== 'Funded').length;
  const [imageLoaded, setImageLoaded] = useState(false);

  function formatCompact(n: number): string {
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return '$' + (n / 1000).toFixed(0) + 'K';
    return '$' + n.toLocaleString();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      onClick={onClick}
      className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden cursor-pointer hover:shadow-md transition-all group will-change-transform will-change-opacity"
    >
      {/* Image */}
      <div className="relative h-[200px] overflow-hidden bg-[#E8DFD4]">
        <img
          src={property.coverImage}
          alt={property.name}
          loading="lazy"
          decoding="async"
          onLoad={() => setImageLoaded(true)}
          className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 transition-opacity ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 bg-[#E8DFD4] animate-pulse" />
        )}
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

function SkeletonPropertyCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="bg-white rounded-[20px] border border-[#D0D0D0] overflow-hidden"
    >
      <div className="relative h-[200px] overflow-hidden bg-[#E8DFD4] animate-pulse" />
      <div className="p-[24px] space-y-[16px]">
        <div className="space-y-[8px]">
          <div className="h-[20px] w-[60%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          <div className="h-[16px] w-[80%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-[6px]">
            <div className="h-[14px] w-[40%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
            <div className="h-[18px] w-[60%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          </div>
          <div className="w-px h-[40px] bg-[#D9D9D9]" />
          <div className="flex-1 space-y-[6px]">
            <div className="h-[14px] w-[50%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
            <div className="h-[18px] w-[70%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          </div>
          <div className="w-px h-[40px] bg-[#D9D9D9]" />
          <div className="flex-1 space-y-[6px]">
            <div className="h-[14px] w-[40%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
            <div className="h-[18px] w-[60%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          </div>
        </div>
        <div className="space-y-[8px]">
          <div className="flex items-center justify-between text-[14px]">
            <div className="h-[14px] w-[30%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
            <div className="h-[14px] w-[20%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          </div>
          <div className="h-[7px] rounded-[100px] bg-[#E8DFD4] overflow-hidden animate-pulse" />
          <div className="flex items-center justify-between text-[14px]">
            <div className="h-[14px] w-[40%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
            <div className="h-[14px] w-[30%] bg-[#E8DFD4] rounded-[6px] animate-pulse" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
