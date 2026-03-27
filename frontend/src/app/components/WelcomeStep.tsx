import { motion } from 'motion/react';
import { Upload, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onSelectPath: (path: 'upload' | 'manual') => void;
}

export function WelcomeStep({ onSelectPath }: WelcomeStepProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-6">
      <div className="max-w-[640px] w-full">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <h1 className="text-[32px] tracking-[-0.03em] text-[#1A1A1A] mb-3">
            Build Your Financial Profile
          </h1>
          <p className="text-[16px] text-[#8C8780]">
            Add it once. Use it across every deal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -2 }}
            onClick={() => onSelectPath('upload')}
            className="group bg-white border border-[#E6E2DB] rounded-xl p-6 text-left cursor-pointer hover:border-[#22C55E] transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center mb-5 group-hover:bg-[#DCFCE7] transition-colors">
              <Upload className="w-4.5 h-4.5 text-[#22C55E]" />
            </div>
            <h3 className="text-[17px] text-[#1A1A1A] mb-1.5 tracking-[-0.01em]">Upload Existing PFS</h3>
            <p className="text-[14px] text-[#8C8780] leading-relaxed">
              Upload a PDF and we'll extract your data automatically.
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ y: -2 }}
            onClick={() => onSelectPath('manual')}
            className="group bg-white border border-[#E6E2DB] rounded-xl p-6 text-left cursor-pointer hover:border-[#22C55E] transition-colors duration-200"
          >
            <div className="w-10 h-10 rounded-lg bg-[#F0FDF4] flex items-center justify-center mb-5 group-hover:bg-[#DCFCE7] transition-colors">
              <ArrowRight className="w-4.5 h-4.5 text-[#22C55E]" />
            </div>
            <h3 className="text-[17px] text-[#1A1A1A] mb-1.5 tracking-[-0.01em]">Build Profile Manually</h3>
            <p className="text-[14px] text-[#8C8780] leading-relaxed">
              Walk through each section. Takes about 10 minutes.
            </p>
          </motion.button>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="text-center text-[13px] text-[#B5B0A9] mt-8"
        >
          Your data is encrypted and stored securely. You can update it at any time.
        </motion.p>
      </div>
    </div>
  );
}