import { useState, type ReactElement } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import { LogOut, Menu, X } from 'lucide-react';
import { AICopilot } from '@/features/ai/components/AICopilot';
import svgPaths from '@/icons/dashboard-shared';
import svgInvoicePaths from '@/icons/dashboard-invoice-nav';
import imgEllipse3 from '@/assets/4f3d3d31e8f035df10a1a48ab89d7f060cac4fe0.png';

const NAV_ITEMS: { to: string; label: string; exact?: boolean; icon: string }[] = [
  { to: '/dashboard', label: 'Overview', exact: true, icon: 'grid' },
  { to: '/dashboard/properties', label: 'Properties', icon: 'building' },
  { to: '/dashboard/invoices', label: 'Invoices', icon: 'invoice' },
  { to: '/dashboard/documents', label: 'Documents', icon: 'folder' },
];

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(2,2)">
        <path clipRule="evenodd" d={svgPaths.p316bfb80} fill="currentColor" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p37c43800} fill="currentColor" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p11e38bb0} fill="currentColor" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p221cf180} fill="currentColor" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(1.2,2.25)">
        <path d={svgPaths.p3a1a0700} fill="currentColor" />
        <path d={svgPaths.p39cd280} fill="currentColor" />
        <path d={svgPaths.p2698c880} fill="currentColor" />
        <path d={svgPaths.p3e663f00} fill="currentColor" />
        <path d={svgPaths.p14587d70} fill="currentColor" />
        <path d={svgPaths.p128ecd80} fill="currentColor" />
        <path d={svgPaths.p163baa70} fill="currentColor" />
        <path d={svgPaths.p2abc1480} fill="currentColor" />
        <path clipRule="evenodd" d={svgPaths.p283d9a80} fill="currentColor" fillRule="evenodd" />
        <path clipRule="evenodd" d={svgPaths.p327e5d40} fill="currentColor" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function InvoiceIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(3,1.5)">
        <path d={svgInvoicePaths.p3f65bb00} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" fill="none" />
        <path d={svgInvoicePaths.p3477bca0} stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" fill="none" />
      </g>
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(2.25,3.25)">
        <path clipRule="evenodd" d={svgPaths.p2ebf2a80} fill="currentColor" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <g transform="translate(4.25,2.25)">
        <path d={svgPaths.p21d23180} fill="currentColor" />
        <path d={svgPaths.p919200 || ''} fill="currentColor" />
        <path d={svgPaths.p33653100} fill="currentColor" />
        <path clipRule="evenodd" d={svgPaths.p2f3a4040} fill="currentColor" fillRule="evenodd" />
      </g>
    </svg>
  );
}

function SidebarCollapseIcon() {
  return (
    <svg width="37" height="36" viewBox="0 0 36.67 36.2578" fill="none">
      <path clipRule="evenodd" d={svgPaths.p31fc1500} fill="#F3DBBC" fillRule="evenodd" />
    </svg>
  );
}

function NotificationIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <path d={svgPaths.p11637200} fill="#333333" />
      <path d={svgPaths.p143ff00} fill="#764D2F" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <g transform="translate(1.33,1.33)">
        <path d={svgPaths.p34770d00} fill="#767676" />
      </g>
    </svg>
  );
}

const iconMap: Record<string, () => ReactElement> = {
  grid: GridIcon,
  building: BuildingIcon,
  invoice: InvoiceIcon,
  folder: FolderIcon,
  document: DocumentIcon,
};

export function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen" style={{ background: '#FCF6F0' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 z-20 sticky top-0 h-screen transition-[width] duration-300 ${
          sidebarCollapsed ? 'w-[88px]' : 'w-[260px]'
        }`}
        style={{ backgroundColor: '#3E2D1D' }}
      >
        <SidebarContent
          onClose={undefined}
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          onLogout={() => navigate('/login')}
        />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-[260px] z-40 lg:hidden flex flex-col"
            style={{ backgroundColor: '#3E2D1D' }}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} isCollapsed={false} onToggleCollapse={undefined} onLogout={() => navigate('/login')} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-[89px] flex items-center justify-between px-4 sm:px-6 lg:px-[58px] shrink-0 sticky top-0 z-10" style={{ background: '#FCF6F0' }}>
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 rounded-lg text-[#8C8780] hover:bg-white/50 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search bar */}
          <div className="hidden sm:flex w-[291px] h-[46px] bg-white rounded-[8px] border border-[#D0D0D0] items-center px-3 gap-2.5">
            <SearchIcon />
            <span className="text-[#767676] text-[14px]" style={{ fontFamily: "'Figtree', sans-serif" }}>Search</span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <NotificationIcon />
            <img src={imgEllipse3} alt="" className="w-[38px] h-[38px] rounded-full object-cover" />
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      {/* AI Copilot */}
      <AICopilot open={aiOpen} onClose={() => setAiOpen(false)} />
    </div>
  );
}

function SidebarContent({
  onClose,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}: {
  onClose: (() => void) | undefined;
  isCollapsed: boolean;
  onToggleCollapse: (() => void) | undefined;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo area */}
      <div
        className={`h-[89px] flex items-center shrink-0 ${
          isCollapsed ? 'justify-center px-[12px]' : 'justify-between px-[34px]'
        }`}
        style={{ borderBottom: '1px solid rgba(117, 77, 47, 0.5)' }}
      >
        {onClose && (
          <button onClick={onClose} className="mr-2 text-[#F3DBBC] hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        )}
        {!isCollapsed && (
          <p
            className="text-[#F3DBBC] text-[28px] sm:text-[33.12px] leading-[0.9807] tracking-[0.04em] text-center whitespace-nowrap"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            ANKR
          </p>
        )}
        {!onClose && onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className={`text-[#F3DBBC] hover:text-white transition-colors cursor-pointer ${
              isCollapsed ? 'absolute top-[26px]' : ''
            }`}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className={isCollapsed ? 'rotate-180 transition-transform duration-300' : 'transition-transform duration-300'}>
              <SidebarCollapseIcon />
            </div>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className={`flex-1 pt-[25px] space-y-[6px] ${isCollapsed ? 'px-[10px]' : 'px-[13px]'}`}>
        {NAV_ITEMS.map(item => {
          const IconComponent = iconMap[item.icon];
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={onClose}
              title={isCollapsed ? item.label : undefined}
              aria-label={item.label}
              className={({ isActive }) =>
                `flex items-center rounded-[8px] transition-colors cursor-pointer text-[#FCF6F0] ${
                  isCollapsed ? 'justify-center px-[12px] py-[14px]' : 'gap-[10px] px-[18px] py-[14px]'
                } ${
                  isActive
                    ? 'bg-[#764D2F]'
                    : 'hover:bg-[#764D2F]/30'
                }`
              }
            >
              <IconComponent />
              {!isCollapsed && <span className="text-[16px] whitespace-nowrap" style={{ fontWeight: 510 }}>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className={`pb-[18px] ${isCollapsed ? 'px-[10px]' : 'px-[13px]'}`}>
        <button
          onClick={onLogout}
          title={isCollapsed ? 'Logout' : undefined}
          aria-label="Logout"
          className={`w-full flex items-center rounded-[8px] transition-colors cursor-pointer text-[#FCF6F0] hover:bg-[#764D2F]/30 ${
            isCollapsed ? 'justify-center px-[12px] py-[14px]' : 'gap-[10px] px-[18px] py-[14px]'
          }`}
        >
          <LogOut className="w-6 h-6" />
          {!isCollapsed && <span className="text-[16px] whitespace-nowrap" style={{ fontWeight: 510 }}>Logout</span>}
        </button>
      </div>
    </div>
  );
}