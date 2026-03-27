import { StepHeader, StepActions } from './FormUI';
import type { FormData, YesNoAnswer } from '@/app/types';
import { YES_NO_QUESTIONS } from '@/app/types';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  data: FormData;
  onChange: (data: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  stepNumber: number;
}

export function YesNoStep({ data, onChange, onNext, onBack, stepNumber }: Props) {
  const getAnswer = (id: string): YesNoAnswer => {
    return data.yesNoAnswers[id] || { answer: null, detail: '' };
  };

  const setAnswer = (id: string, answer: boolean) => {
    const current = getAnswer(id);
    onChange({
      yesNoAnswers: {
        ...data.yesNoAnswers,
        [id]: { ...current, answer, detail: answer ? current.detail : '' },
      },
    });
  };

  const setDetail = (id: string, detail: string) => {
    const current = getAnswer(id);
    onChange({
      yesNoAnswers: {
        ...data.yesNoAnswers,
        [id]: { ...current, detail },
      },
    });
  };

  return (
    <div>
      <StepHeader
        stepNumber={stepNumber}
        title="Disclosures"
        subtitle="Required financial disclosures."
      />

      <div className="space-y-1">
        {YES_NO_QUESTIONS.map((q) => {
          const answer = getAnswer(q.id);
          return (
            <div key={q.id} className="border-b border-[#E6E2DB] last:border-b-0">
              <div className="flex items-start justify-between gap-6 py-4">
                <p className="text-[15px] text-[#1A1A1A] leading-relaxed flex-1">{q.text}</p>
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setAnswer(q.id, true)}
                    className={`px-3.5 py-1.5 text-[13px] rounded-l-md border transition-all cursor-pointer ${
                      answer.answer === true
                        ? 'bg-[#22C55E] text-white border-[#22C55E]'
                        : 'bg-white text-[#6E6A65] border-[#E6E2DB] hover:border-[#C5C0B9]'
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setAnswer(q.id, false)}
                    className={`px-3.5 py-1.5 text-[13px] rounded-r-md border border-l-0 transition-all cursor-pointer ${
                      answer.answer === false
                        ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                        : 'bg-white text-[#6E6A65] border-[#E6E2DB] hover:border-[#C5C0B9]'
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {answer.answer === true && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-4">
                      <textarea
                        value={answer.detail}
                        onChange={(e) => setDetail(q.id, e.target.value)}
                        placeholder="Provide details..."
                        rows={2}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#E6E2DB] rounded-lg text-[14px] text-[#1A1A1A] placeholder-[#C5C0B9] focus:outline-none focus:border-[#22C55E] focus:ring-1 focus:ring-[#22C55E] transition-all duration-150 resize-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <StepActions onBack={onBack} onNext={onNext} />
    </div>
  );
}