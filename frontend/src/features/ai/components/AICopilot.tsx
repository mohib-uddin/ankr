import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Send, ChevronRight } from 'lucide-react';
import { useApp, getBudgetTotals, formatCurrency } from '@/app/context/AppContext';
import { useLocation } from 'react-router';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

function now() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

const SUGGESTED_QUESTIONS = [
  'What is a draw request?',
  'How do I create a budget?',
  'Explain pro forma',
  'What is LTV?',
  'How do draws work?',
  'What docs do lenders need?',
];

function buildContext(state: ReturnType<typeof useApp>['state'], pathname: string) {
  const propId = pathname.match(/properties\/([^/]+)/)?.[1];
  const prop = propId ? state.properties.find(p => p.id === propId) : null;

  if (prop) {
    const totals = getBudgetTotals(prop.budget, prop.draws);
    const funded = prop.draws.filter(d => d.status === 'Funded').length;
    const totalInvestment = prop.proforma.purchasePrice + prop.proforma.rehabCost + prop.proforma.holdingCosts + prop.proforma.financingCosts + prop.proforma.softCosts;
    const grossProfit = prop.proforma.afterRepairValue - totalInvestment;
    const roi = totalInvestment > 0 ? ((grossProfit / totalInvestment) * 100).toFixed(1) : '0';
    return { prop, totals, funded, totalInvestment, grossProfit, roi };
  }

  return null;
}

function generateResponse(input: string, state: ReturnType<typeof useApp>['state'], pathname: string): string {
  const q = input.toLowerCase();
  const ctx = buildContext(state, pathname);

  // Property-specific responses
  if (ctx && (q.includes('budget') || q.includes('remaining') || q.includes('how much'))) {
    const pct = ctx.totals.totalBudget > 0 ? Math.round((ctx.totals.totalDrawn / ctx.totals.totalBudget) * 100) : 0;
    return `For **${ctx.prop.name}**, here's your budget snapshot:\n\n• **Total Budget:** ${formatCurrency(ctx.totals.totalBudget)}\n• **Total Drawn:** ${formatCurrency(ctx.totals.totalDrawn)} (${pct}%)\n• **Actual Spent:** ${formatCurrency(ctx.totals.totalActual)}\n• **Remaining:** ${formatCurrency(ctx.totals.remaining)}\n\nYou have ${ctx.prop.draws.filter(d => d.status !== 'Draft').length} draw request(s) submitted. Tap the Budget tab to see the full breakdown.`;
  }

  if (ctx && (q.includes('roi') || q.includes('return') || q.includes('profit'))) {
    return `For **${ctx.prop.name}**:\n\n• **Total Investment:** ${formatCurrency(ctx.totalInvestment)}\n• **After Repair Value:** ${formatCurrency(ctx.prop.proforma.afterRepairValue)}\n• **Gross Profit:** ${formatCurrency(ctx.grossProfit)}\n• **Gross ROI:** ${ctx.roi}%\n\nStrategy: ${ctx.prop.proforma.exitStrategy}. Visit the Pro Forma tab to model different scenarios.`;
  }

  if (ctx && q.includes('draw')) {
    return `For **${ctx.prop.name}**, you have ${ctx.prop.draws.length} draw request(s). ${ctx.funded} funded, ${ctx.prop.draws.filter(d => d.status === 'Submitted' || d.status === 'Approved').length} pending.\n\nTo create a new draw: go to the **Draws tab** → click **New Draw Request** → select your categories and enter amounts → attach documents → submit to your lender.`;
  }

  if (ctx && q.includes('lender')) {
    return `Your current lender for **${ctx.prop.name}** is **${ctx.prop.proforma.lenderName || 'Not set'}**. You can update lender information in the Pro Forma tab.\n\nWhen submitting a draw, include their email address so you can share the draw package with them via a secure link (coming in Phase 2).`;
  }

  // General responses
  if (q.includes('draw request') || q.includes('what is a draw')) {
    return `**Draw requests** are formal funding requests you submit to your lender to access your construction loan funds.\n\nHere's how it works:\n1. You allocate a budget by category (Site Work, Framing, etc.)\n2. As work is completed, you create a draw request\n3. You specify the amount per category and % complete\n4. Attach invoices and inspection reports\n5. Submit to your lender for approval\n\nOnce approved, the lender releases funds directly to you or your contractor.`;
  }

  if (q.includes('budget') && !ctx) {
    return `**Budgets in Ankr** are organized by category (Site Work, Building Hard Costs, Soft Costs, etc.).\n\nEach category contains line items with:\n• **Budget** – your allocated amount\n• **Drawn** – auto-calculated from your draw requests\n• **Actual** – what you've actually spent\n• **Variance** – budget vs actual (green = under, red = over)\n\nTip: Click any budget or actual cell to edit it inline. The $/GSF and $/NSF columns are auto-calculated.`;
  }

  if (q.includes('pro forma') || q.includes('proforma')) {
    return `**Pro Forma** is a financial projection for your deal. Key inputs:\n\n• **Purchase Price** – what you paid\n• **Rehab Cost** – construction budget\n• **Holding/Financing Costs** – carrying costs during the project\n• **ARV** – After Repair Value (what it'll sell/appraise for)\n\nKey outputs:\n• **Gross Profit** = ARV − Total Investment\n• **ROI** = Gross Profit / Total Investment\n• **LTV** = Loan / ARV\n\nAnkr auto-calculates all outputs as you update inputs.`;
  }

  if (q.includes('ltv') || q.includes('loan to value')) {
    return `**LTV (Loan-to-Value)** is the ratio of your loan amount to the property's value.\n\nFormula: **LTV = Loan Amount ÷ ARV × 100**\n\nMost lenders want:\n• 65–75% LTV for construction loans\n• 70–80% LTV for bridge loans\n• Below 80% for conventional loans\n\nA lower LTV means less risk for the lender and typically better rates for you. You can see your LTV in the Pro Forma tab.`;
  }

  if (q.includes('docs') || q.includes('documents') || q.includes('what do lenders')) {
    return `Lenders typically require:\n\n**For the initial loan:**\n• Personal Financial Statement (PFS) ✓\n• Tax returns (2 years)\n• Bank statements\n• Purchase contract\n• Pro forma / budget\n\n**For draw requests:**\n• Signed draw request form\n• Invoices / bills from contractors\n• Inspection or completion reports\n• Lien waivers\n• Progress photos\n\nAnkr helps you organize all of this in one place.`;
  }

  if (q.includes('how do draws work') || q.includes('draws work')) {
    return `**How construction draws work:**\n\n1. **Budget Setup** – You allocate your loan across categories\n2. **Work Begins** – Contractors complete portions of work\n3. **Draw Request** – You request funds against completed work\n4. **Lender Review** – They may send an inspector to verify\n5. **Approval** – Lender approves and releases funds\n6. **Repeat** – Until the project is complete\n\nTypically you'll have 4–8 draws for a construction project. Each draw should be documented with invoices and completion percentages.`;
  }

  if (q.includes('brrrr')) {
    return `**BRRRR Strategy** = Buy, Rehab, Rent, Refinance, Repeat\n\n1. **Buy** a distressed property below market\n2. **Rehab** to increase value\n3. **Rent** it out for cash flow\n4. **Refinance** at the new (higher) appraised value\n5. **Repeat** – use the cash-out to buy another property\n\nThe key metric is making sure your ARV justifies a cash-out refi that returns most or all of your invested capital. Model this in the Pro Forma tab.`;
  }

  // Portfolio-level responses
  if (!ctx && (q.includes('portfolio') || q.includes('properties'))) {
    const total = state.properties.reduce((s, p) => s + getBudgetTotals(p.budget, p.draws).totalBudget, 0);
    return `You have **${state.properties.length} properties** in your portfolio with a combined budget of **${formatCurrency(total)}**.\n\nNavigate to a specific property to get detailed insights, or visit the Properties page to manage your portfolio.`;
  }

  // Fallback
  return `I'm here to help with your real estate investment questions. I can assist with:\n\n• **Budgets** – How to structure and track your project costs\n• **Draw requests** – Creating and submitting draws to lenders\n• **Pro forma** – Understanding your deal's financials\n• **Strategy** – Fix & Flip, BRRRR, Development, etc.\n\nWhat would you like to know?`;
}

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AICopilot({ open, onClose }: Props) {
  const { state } = useApp();
  const location = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      text: `Hi! I'm your Ankr AI assistant. I can help you understand budgets, draw requests, pro forma calculations, and more. What would you like to know?`,
      time: now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text, time: now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(text, state, location.pathname);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: response, time: now() };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 400);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: 380, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 380, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[380px] bg-white border-l border-[#D0D0D0] z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b border-[#D0D0D0] bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#3E2D1D] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-[#F3DBBC]" />
                </div>
                <div>
                  <p className="text-[14px] text-[#3E2D1D]" style={{ fontWeight: 510 }}>AI Co-Pilot</p>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#764D2F]" />
                    <p className="text-[11px] text-[#8C8780]">Online</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#FCF6F0] text-[#8C8780] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Suggested questions */}
            {messages.length <= 1 && (
              <div className="px-4 py-3 border-b border-[#D0D0D0] bg-[#FCF6F0]">
                <p className="text-[11px] text-[#8C8780] mb-2" style={{ fontWeight: 510 }}>Suggested questions</p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map(q => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#D0D0D0] text-[11px] text-[#8C8780] hover:border-[#764D2F] hover:text-[#764D2F] hover:bg-[#FCF6F0] transition-colors cursor-pointer bg-white"
                    >
                      {q} <ChevronRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 rounded-full bg-[#3E2D1D] flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#F3DBBC]" />
                    </div>
                  )}
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                    <div className={`rounded-2xl px-3.5 py-2.5 ${
                      msg.role === 'user'
                        ? 'bg-[#3E2D1D] text-white rounded-tr-sm'
                        : 'bg-[#FCF6F0] text-[#3E2D1D] rounded-tl-sm'
                    }`}>
                      <MessageText text={msg.text} isUser={msg.role === 'user'} />
                    </div>
                    <span className="text-[10px] text-[#C5C0B9] mt-1 px-1">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="bg-[#FCF6F0] rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#8C8780]" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#8C8780]" />
                      <motion.div animate={{ opacity: [0.4, 1, 0.4] }} transition={{ repeat: Infinity, duration: 1.2, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#8C8780]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-[#D0D0D0] bg-white">
              <div className="flex items-center gap-2 bg-[#FCF6F0] rounded-xl border border-[#D0D0D0] px-3 py-2 focus-within:border-[#764D2F] transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
                  placeholder="Ask anything about your deals..."
                  className="flex-1 bg-transparent text-[13px] text-[#3E2D1D] placeholder-[#C7AF97] focus:outline-none"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim()}
                  className="w-7 h-7 rounded-lg bg-[#3E2D1D] flex items-center justify-center text-white hover:bg-[#2C1F14] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-[#C7AF97] text-center mt-2" style={{ fontWeight: 510 }}>AI provides guidance, not financial advice.</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function MessageText({ text, isUser }: { text: string; isUser: boolean }) {
  // Simple markdown-like rendering
  const lines = text.split('\n');
  return (
    <div className={`text-[13px] leading-relaxed ${isUser ? 'text-white' : 'text-[#3E2D1D]'}`}>
      {lines.map((line, i) => {
        if (!line) return <br key={i} />;
        // Bold
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i} className={line.startsWith('•') ? 'ml-2' : ''}>
            {parts.map((part, j) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={j} className={isUser ? 'text-white' : 'text-[#3E2D1D]'}>{part.slice(2, -2)}</strong>;
              }
              return <span key={j}>{part}</span>;
            })}
          </p>
        );
      })}
    </div>
  );
}