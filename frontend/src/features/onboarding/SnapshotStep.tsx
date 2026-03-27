import { motion } from 'motion/react';
import { StepActions } from './FormUI';
import type { FormData } from '@/app/types';
import { parseCurrency, formatCurrency } from '@/app/types';
import { Check } from 'lucide-react';

interface Props {
  data: FormData;
  onBack: () => void;
  onActivate: () => void;
}

export function SnapshotStep({ data, onBack, onActivate }: Props) {
  const accountsTotal = data.accounts.reduce((sum, a) => sum + parseCurrency(a.balance), 0);
  const propertyValues = data.properties.reduce((sum, p) => sum + parseCurrency(p.estimatedValue), 0);
  const propertyDebt = data.properties.reduce((sum, p) => sum + parseCurrency(p.loanBalance), 0);
  const entityValues = data.entities.reduce((sum, e) => sum + parseCurrency(e.estimatedValue), 0);
  const investments = parseCurrency(data.investmentsTotal);
  const privateInv = parseCurrency(data.privateInvestments);
  const otherAssets = parseCurrency(data.otherAssets);

  const creditCards = parseCurrency(data.creditCardsTotal);
  const personalLoans = parseCurrency(data.personalLoans);
  const otherDebt = parseCurrency(data.otherDebt);

  const totalAssets = accountsTotal + propertyValues + entityValues + investments + privateInv + otherAssets;
  const totalLiabilities = propertyDebt + creditCards + personalLoans + otherDebt;
  const netWorth = totalAssets - totalLiabilities;

  const summaryItems = [
    { label: 'Total Assets', value: totalAssets },
    { label: 'Total Liabilities', value: totalLiabilities },
    { label: 'Net Worth', value: netWorth, highlight: true },
    { label: 'Liquidity', value: accountsTotal },
  ];

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[12px] tracking-[0.15em] uppercase text-[#8C8780]">Summary</span>
        </div>
        <h2 className="text-[24px] text-[#1A1A1A] tracking-[-0.02em]">Financial Snapshot</h2>
        <p className="text-[15px] text-[#8C8780] mt-1">Review your profile before activation.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {summaryItems.map((item, idx) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: idx * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
            className={`p-5 rounded-lg border ${
              item.highlight
                ? 'bg-[#22C55E] border-[#22C55E]'
                : 'bg-white border-[#E6E2DB]'
            }`}
          >
            <p className={`text-[12px] tracking-[0.1em] uppercase mb-2 ${
              item.highlight ? 'text-white/70' : 'text-[#8C8780]'
            }`}>
              {item.label}
            </p>
            <p className={`text-[22px] tracking-[-0.02em] ${
              item.highlight ? 'text-white' : 'text-[#1A1A1A]'
            }`}>
              {formatCurrency(item.value)}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="bg-white border border-[#E6E2DB] rounded-lg divide-y divide-[#E6E2DB]">
        <BreakdownSection title="Liquid Accounts" count={data.accounts.length} total={accountsTotal} />
        <BreakdownSection title="Real Estate" count={data.properties.length} total={propertyValues} />
        <BreakdownSection title="Business Entities" count={data.entities.length} total={entityValues} />
        {(investments > 0 || privateInv > 0 || otherAssets > 0) && (
          <BreakdownSection title="Other Assets" total={investments + privateInv + otherAssets} />
        )}
        {(creditCards > 0 || personalLoans > 0 || otherDebt > 0) && (
          <BreakdownSection title="Liabilities" total={totalLiabilities} isLiability />
        )}
      </div>

      <div className="mt-10 pt-6 border-t border-[#E6E2DB] flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-[15px] text-[#6E6A65] hover:text-[#1A1A1A] transition-colors cursor-pointer"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onActivate}
          className="px-8 py-3 bg-[#22C55E] text-white rounded-lg text-[15px] hover:bg-[#16A34A] transition-colors cursor-pointer flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Activate Profile
        </button>
      </div>
    </div>
  );
}

function BreakdownSection({ title, count, total, isLiability }: {
  title: string;
  count?: number;
  total: number;
  isLiability?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2">
        <span className="text-[14px] text-[#1A1A1A]">{title}</span>
        {count !== undefined && (
          <span className="text-[12px] text-[#B5B0A9] bg-[#F8F6F1] px-2 py-0.5 rounded">{count}</span>
        )}
      </div>
      <span className={`text-[14px] tabular-nums ${isLiability ? 'text-[#EF4444]' : 'text-[#1A1A1A]'}`}>
        {isLiability ? '-' : ''}{formatCurrency(total)}
      </span>
    </div>
  );
}