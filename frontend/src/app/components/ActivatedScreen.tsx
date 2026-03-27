import { motion } from 'motion/react';
import { Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ActivatedScreen() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <div className="max-w-[480px] w-full text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-14 h-14 rounded-full bg-[#22C55E] flex items-center justify-center mx-auto mb-6"
        >
          <Check className="w-6 h-6 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h1 className="text-[28px] tracking-[-0.03em] text-[#1A1A1A] mb-2">
            Profile Activated
          </h1>
          <p className="text-[15px] text-[#8C8780] mb-10 leading-relaxed">
            Your financial profile is live. It will be used across all your deals and applications.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
          className="space-y-3"
        >
          <div className="bg-white border border-[#E6E2DB] rounded-lg divide-y divide-[#E6E2DB] text-left">
            <NextStep step="1" text="Upload supporting documents for faster verification." />
            <NextStep step="2" text="Explore your deal pipeline and active opportunities." />
            <NextStep step="3" text="Connect with lenders matched to your profile." />
          </div>

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="w-full mt-6 px-7 py-3 bg-[#22C55E] text-white rounded-lg text-[15px] hover:bg-[#16A34A] transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}

function NextStep({ step, text }: { step: string; text: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5">
      <span className="w-5 h-5 rounded bg-[#F0FDF4] flex items-center justify-center text-[11px] text-[#22C55E] shrink-0 mt-0.5">
        {step}
      </span>
      <p className="text-[14px] text-[#1A1A1A] leading-relaxed">{text}</p>
    </div>
  );
}