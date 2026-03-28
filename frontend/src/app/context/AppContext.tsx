import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type PropertyType = 'Single Family' | 'Multi-Family' | 'Commercial' | 'Mixed Use' | 'Land';
export type PropertyStatus = 'Active' | 'Under Contract' | 'Closed' | 'Acquisition';
export type ExitStrategy = 'Fix & Flip' | 'BRRRR' | 'Hold & Rent' | 'Wholesale' | 'Development';
export type DrawStatus = 'Draft' | 'Submitted' | 'Approved' | 'Funded' | 'Rejected';

export type VaultCategory = 'Identity' | 'Income' | 'Banking' | 'Real Estate' | 'Debt' | 'Tax' | 'Entity' | 'Custom';

export interface VaultDocument {
  id: string;
  name: string;
  category: VaultCategory;
  folderId?: string;
  tags: string[];
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  notes?: string;
  propertyId?: string;
}

export interface VaultFolder {
  id: string;
  name: string;
  category: VaultCategory;
  description?: string;
  createdAt: string;
}

export interface VaultShareLink {
  id: string;
  documentIds: string[];
  packageName?: string;
  token: string;
  expiresAt: string;
  maxAccess: number;
  accessCount: number;
  createdAt: string;
  recipientEmail?: string;
  isActive: boolean;
}

export interface VaultPackageTemplate {
  id: string;
  name: string;
  description: string;
  requiredCategories: VaultCategory[];
  requiredDocTypes: string[];
}

export interface DashboardProperty {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip?: string;
  type: PropertyType;
  sqft: number;
  units: number;
  yearBuilt?: number;
  lotSize?: number;
  zoning?: string;
  status: PropertyStatus;
  coverImage: string;
  createdAt: string;
  proforma: ProForma;
  budget: PropertyBudget;
  draws: DrawRequest[];
}

export interface ProForma {
  exitStrategy: ExitStrategy;
  purchasePrice: number;
  rehabCost: number;
  holdingCosts: number;
  financingCosts: number;
  softCosts: number;
  afterRepairValue: number;
  lenderName: string;
  lenderEmail?: string;
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
}

export interface PropertyBudget {
  grossSqft: number;
  netSqft: number;
  categories: BudgetCategory[];
}

export interface BudgetCategory {
  id: string;
  name: string;
  note?: string;
  items: BudgetLineItem[];
}

export interface BudgetLineItem {
  id: string;
  name: string;
  budget: number;
  actual: number;
}

export type DocumentPackageId =
  | 'standard'
  | 'lien_waiver'
  | 'inspection'
  | 'title'
  | 'compliance'
  | 'none';

export interface DocumentPackage {
  id: DocumentPackageId;
  name: string;
  description: string;
  documents: string[];
}

export const DOCUMENT_PACKAGES: DocumentPackage[] = [
  {
    id: 'standard',
    name: 'Standard Draw Package',
    description: 'Most common package for residential & multi-family',
    documents: ['AIA G702 Cover Sheet', 'Schedule of Values (G703)', 'Contractor Invoices', 'Sworn Statement'],
  },
  {
    id: 'lien_waiver',
    name: 'Lien Waiver Package',
    description: 'Required for most commercial lenders',
    documents: ['Conditional Lien Waivers (all subs)', 'Unconditional Waivers (prior period)', 'Contractor Affidavit', 'Sub-Contractor List'],
  },
  {
    id: 'inspection',
    name: 'Inspection Package',
    description: 'Progress verification for construction draws',
    documents: ['Third-Party Inspection Report', 'Progress Photo Set', 'Inspector Sign-Off Letter', 'Work-in-Place Schedule'],
  },
  {
    id: 'title',
    name: 'Title & Endorsement Package',
    description: 'Title continuation for lender draws',
    documents: ['Title Bring-Down / Date-Down', 'Title Endorsement', 'Loan Agreement Confirmation'],
  },
  {
    id: 'compliance',
    name: 'Full Compliance Package',
    description: 'Comprehensive package for regulated lenders',
    documents: ['Insurance Certificates', 'Active Building Permits', 'Safety Certifications', 'Environmental Clearance', 'All Prior Packages'],
  },
];

export interface DrawRequest {
  id: string;
  number: number;
  propertyId: string;
  status: DrawStatus;
  title: string;
  requestDate: string;
  submittedDate?: string;
  approvedDate?: string;
  fundedDate?: string;
  totalAmount: number;
  lenderName: string;
  lenderEmail: string;
  notes: string;
  lineItems: DrawLineItem[];
  attachments: DrawAttachment[];
  documentPackageId?: DocumentPackageId;
  documentPackageName?: string;
}

export interface DrawLineItem {
  id: string;
  categoryId: string;
  categoryName: string;
  budgetAmount: number;
  previouslyDrawn: number;
  requestedAmount: number;
  percentComplete: number;
}

export interface DrawAttachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

export interface AppState {
  onboardingComplete: boolean;
  userName: string;
  properties: DashboardProperty[];
  vaultDocuments: VaultDocument[];
  vaultFolders: VaultFolder[];
  vaultShareLinks: VaultShareLink[];
}

// ─── UTILITY ─────────────────────────────────────────────────────────────────

export function genId() {
  return Math.random().toString(36).substring(2, 10);
}

export function getBudgetTotals(budget: PropertyBudget, draws: DrawRequest[]) {
  let totalBudget = 0;
  let totalActual = 0;
  budget.categories.forEach(cat => {
    cat.items.forEach(item => {
      totalBudget += item.budget;
      totalActual += item.actual;
    });
  });
  const drawnByCatId: Record<string, number> = {};
  draws.forEach(draw => {
    if (draw.status !== 'Draft') {
      draw.lineItems.forEach(li => {
        drawnByCatId[li.categoryId] = (drawnByCatId[li.categoryId] || 0) + li.requestedAmount;
      });
    }
  });
  const totalDrawn = Object.values(drawnByCatId).reduce((s, v) => s + v, 0);
  return { totalBudget, totalActual, totalDrawn, remaining: totalBudget - totalDrawn };
}

export function getDrawnForCategory(categoryId: string, draws: DrawRequest[]): number {
  return draws
    .filter(d => d.status !== 'Draft')
    .reduce((sum, d) => {
      const li = d.lineItems.find(l => l.categoryId === categoryId);
      return sum + (li?.requestedAmount ?? 0);
    }, 0);
}

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const CAT_SITE_WORK = 'cat-sw';
const CAT_LAND = 'cat-land';
const CAT_FINANCING = 'cat-fin';
const CAT_BLDG = 'cat-bldg';
const CAT_SOFT = 'cat-soft';
const CAT_OVERHEAD = 'cat-oh';
const CAT_CONTINGENCY = 'cat-cont';

const westlakeBudget: PropertyBudget = {
  grossSqft: 20000,
  netSqft: 14200,
  categories: [
    {
      id: CAT_SITE_WORK,
      name: 'Site Work',
      items: [
        { id: 'sw1', name: 'Tree Removal', budget: 25000, actual: 22000 },
        { id: 'sw2', name: 'Excavation', budget: 200000, actual: 195000 },
        { id: 'sw3', name: 'Demolition', budget: 25000, actual: 24000 },
        { id: 'sw4', name: 'Detention System', budget: 75000, actual: 0 },
        { id: 'sw5', name: 'Retaining Walls', budget: 25000, actual: 0 },
        { id: 'sw6', name: 'Asphalt / Striping', budget: 65000, actual: 0 },
        { id: 'sw7', name: 'Sidewalk / Curbs', budget: 5000, actual: 0 },
        { id: 'sw8', name: 'Fence', budget: 10000, actual: 0 },
      ],
    },
    {
      id: CAT_LAND,
      name: 'Land',
      items: [
        { id: 'l1', name: 'Land Acquisition', budget: 805000, actual: 805000 },
      ],
    },
    {
      id: CAT_FINANCING,
      name: 'Financing',
      items: [
        { id: 'f1', name: 'Loan Origination', budget: 200000, actual: 200000 },
        { id: 'f2', name: 'Interest Reserve', budget: 500000, actual: 180000 },
        { id: 'f3', name: 'Appraisal & Due Diligence', budget: 200000, actual: 190000 },
      ],
    },
    {
      id: CAT_BLDG,
      name: 'Building Hard Costs',
      items: [
        { id: 'b1', name: 'Foundation / Footings', budget: 750000, actual: 750000 },
        { id: 'b2', name: 'Framing Labor', budget: 150000, actual: 145000 },
        { id: 'b3', name: 'Framing Material', budget: 550000, actual: 530000 },
        { id: 'b4', name: 'Low Voltage / Intercom', budget: 25000, actual: 0 },
        { id: 'b5', name: 'Windows', budget: 265000, actual: 0 },
        { id: 'b6', name: 'Exterior Doors', budget: 100000, actual: 0 },
        { id: 'b7', name: 'Plumbing Underground', budget: 150000, actual: 150000 },
        { id: 'b8', name: 'Plumbing Rough', budget: 100000, actual: 95000 },
        { id: 'b9', name: 'Plumbing Finish', budget: 50000, actual: 0 },
        { id: 'b10', name: 'HVAC', budget: 115000, actual: 0 },
        { id: 'b11', name: 'HVAC Finish', budget: 25000, actual: 0 },
        { id: 'b12', name: 'Electric Rough', budget: 250000, actual: 240000 },
        { id: 'b13', name: 'Electric Finish', budget: 50000, actual: 0 },
        { id: 'b14', name: 'Brick / Stucco / Paneling', budget: 250000, actual: 0 },
        { id: 'b15', name: 'Interior Doors', budget: 90000, actual: 0 },
        { id: 'b16', name: 'Insulation', budget: 80000, actual: 0 },
        { id: 'b17', name: 'Trimming Material / Labor', budget: 175000, actual: 0 },
        { id: 'b18', name: 'Railing Exterior', budget: 35000, actual: 0 },
        { id: 'b19', name: 'Interior Unit Stairs / Railings', budget: 150000, actual: 0 },
        { id: 'b20', name: 'Hall Flooring', budget: 30000, actual: 0 },
        { id: 'b21', name: 'Drywall', budget: 175000, actual: 0 },
        { id: 'b22', name: 'Hardwood Flooring', budget: 140000, actual: 0 },
        { id: 'b23', name: 'Tile Floor / Material / Installation', budget: 90000, actual: 0 },
        { id: 'b24', name: 'Fire Sprinklers', budget: 115000, actual: 0 },
        { id: 'b25', name: 'Elevator', budget: 290000, actual: 0 },
        { id: 'b26', name: 'Shower Doors', budget: 25000, actual: 0 },
        { id: 'b27', name: 'Countertops', budget: 40000, actual: 0 },
        { id: 'b28', name: 'Kitchen Cabinets', budget: 125000, actual: 0 },
        { id: 'b29', name: 'Kitchen Appliances', budget: 150000, actual: 0 },
        { id: 'b30', name: 'Fiberglass / Rooftop', budget: 30000, actual: 0 },
      ],
    },
    {
      id: CAT_SOFT,
      name: 'Soft Costs',
      items: [
        { id: 's1', name: 'Architecture / Engineering', budget: 120000, actual: 120000 },
        { id: 's2', name: 'Permits & Fees', budget: 85000, actual: 85000 },
        { id: 's3', name: 'Survey & Geotech', budget: 30000, actual: 30000 },
        { id: 's4', name: 'Legal & Title', budget: 35000, actual: 35000 },
        { id: 's5', name: 'Misc Soft Costs', budget: 30000, actual: 0 },
      ],
    },
    {
      id: CAT_OVERHEAD,
      name: 'Overhead & General Conditions',
      note: '7%',
      items: [
        { id: 'o1', name: 'Project Management', budget: 180000, actual: 120000 },
        { id: 'o2', name: 'General Conditions', budget: 180000, actual: 90000 },
        { id: 'o3', name: 'Site Supervision', budget: 100000, actual: 65000 },
      ],
    },
    {
      id: CAT_CONTINGENCY,
      name: 'Contingency',
      note: '5%',
      items: [
        { id: 'c1', name: 'Contingency Reserve', budget: 360000, actual: 0 },
      ],
    },
  ],
};

const INITIAL_PROPERTIES: DashboardProperty[] = [
  {
    id: 'prop-1',
    name: 'Westlake Commons',
    address: '2847 Westlake Drive',
    city: 'Austin',
    state: 'TX',
    zip: '78703',
    type: 'Multi-Family',
    sqft: 20000,
    units: 20,
    yearBuilt: 2024,
    lotSize: 1.8,
    zoning: 'MF-4',
    status: 'Active',
    coverImage:
      'https://images.unsplash.com/photo-1762397794646-f19044bd0828?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: '2025-09-15',
    proforma: {
      exitStrategy: 'Development',
      purchasePrice: 2500000,
      rehabCost: 7860000,
      holdingCosts: 120000,
      financingCosts: 900000,
      softCosts: 300000,
      afterRepairValue: 14500000,
      lenderName: 'First National Capital',
      lenderEmail: 'draws@firstnational.com',
      loanAmount: 8500000,
      interestRate: 7.5,
      loanTermMonths: 24,
    },
    budget: westlakeBudget,
    draws: [
      {
        id: 'draw-1',
        number: 1,
        propertyId: 'prop-1',
        status: 'Funded',
        title: 'Draw #1 – Land & Site Work',
        requestDate: '2025-10-10',
        submittedDate: '2025-10-12',
        approvedDate: '2025-10-18',
        fundedDate: '2025-10-22',
        totalAmount: 1616000,
        lenderName: 'First National Capital',
        lenderEmail: 'draws@firstnational.com',
        notes: 'Initial draw covering land acquisition, preliminary site work, and financing costs.',
        documentPackageId: 'standard',
        documentPackageName: 'Standard Draw Package',
        lineItems: [
          { id: 'dl1', categoryId: CAT_LAND, categoryName: 'Land', budgetAmount: 805000, previouslyDrawn: 0, requestedAmount: 805000, percentComplete: 100 },
          { id: 'dl2', categoryId: CAT_SITE_WORK, categoryName: 'Site Work', budgetAmount: 430000, previouslyDrawn: 0, requestedAmount: 241000, percentComplete: 56 },
          { id: 'dl3', categoryId: CAT_FINANCING, categoryName: 'Financing', budgetAmount: 900000, previouslyDrawn: 0, requestedAmount: 570000, percentComplete: 63 },
        ],
        attachments: [
          { id: 'a1', name: 'Land_Purchase_Agreement.pdf', type: 'PDF', size: '2.4 MB', uploadedAt: '2025-10-10' },
          { id: 'a2', name: 'Site_Work_Invoice_001.pdf', type: 'PDF', size: '1.1 MB', uploadedAt: '2025-10-10' },
          { id: 'a3', name: 'Lender_Draw_Form.pdf', type: 'PDF', size: '0.8 MB', uploadedAt: '2025-10-11' },
        ],
      },
      {
        id: 'draw-2',
        number: 2,
        propertyId: 'prop-1',
        status: 'Approved',
        title: 'Draw #2 – Foundation & Framing',
        requestDate: '2025-12-05',
        submittedDate: '2025-12-07',
        approvedDate: '2025-12-14',
        totalAmount: 2289000,
        lenderName: 'First National Capital',
        lenderEmail: 'draws@firstnational.com',
        notes: 'Second draw covering foundation, framing, and completion of site work.',
        documentPackageId: 'inspection',
        documentPackageName: 'Inspection Package',
        lineItems: [
          { id: 'dl4', categoryId: CAT_BLDG, categoryName: 'Building Hard Costs', budgetAmount: 4565000, previouslyDrawn: 0, requestedAmount: 2100000, percentComplete: 46 },
          { id: 'dl5', categoryId: CAT_SITE_WORK, categoryName: 'Site Work', budgetAmount: 430000, previouslyDrawn: 241000, requestedAmount: 189000, percentComplete: 100 },
        ],
        attachments: [
          { id: 'a4', name: 'Foundation_Inspection_Report.pdf', type: 'PDF', size: '3.2 MB', uploadedAt: '2025-12-05' },
          { id: 'a5', name: 'Framing_Invoices_Batch.pdf', type: 'PDF', size: '4.5 MB', uploadedAt: '2025-12-06' },
        ],
      },
      {
        id: 'draw-3',
        number: 3,
        propertyId: 'prop-1',
        status: 'Draft',
        title: 'Draw #3 – MEP Rough-In',
        requestDate: '2026-02-20',
        totalAmount: 595000,
        lenderName: 'First National Capital',
        lenderEmail: 'draws@firstnational.com',
        notes: '',
        lineItems: [
          { id: 'dl6', categoryId: CAT_BLDG, categoryName: 'Building Hard Costs', budgetAmount: 4565000, previouslyDrawn: 2100000, requestedAmount: 595000, percentComplete: 59 },
        ],
        attachments: [],
      },
    ],
  },
  {
    id: 'prop-2',
    name: 'Oakridge Flats',
    address: '445 Oakridge Lane',
    city: 'Denver',
    state: 'CO',
    zip: '80203',
    type: 'Multi-Family',
    sqft: 8500,
    units: 8,
    yearBuilt: 1988,
    lotSize: 0.5,
    zoning: 'R-2',
    status: 'Under Contract',
    coverImage:
      'https://images.unsplash.com/photo-1762758731316-419c3c283ed9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    createdAt: '2026-01-08',
    proforma: {
      exitStrategy: 'BRRRR',
      purchasePrice: 950000,
      rehabCost: 420000,
      holdingCosts: 35000,
      financingCosts: 65000,
      softCosts: 40000,
      afterRepairValue: 1800000,
      lenderName: 'Summit Lending Group',
      lenderEmail: 'draws@summitlending.com',
      loanAmount: 1100000,
      interestRate: 8.25,
      loanTermMonths: 18,
    },
    budget: {
      grossSqft: 8500,
      netSqft: 6200,
      categories: [
        {
          id: genId(), name: 'Site Work',
          items: [
            { id: genId(), name: 'Landscaping', budget: 15000, actual: 0 },
            { id: genId(), name: 'Parking / Striping', budget: 12000, actual: 0 },
          ],
        },
        {
          id: genId(), name: 'Interior Renovation',
          items: [
            { id: genId(), name: 'Kitchen Remodel', budget: 95000, actual: 0 },
            { id: genId(), name: 'Bathroom Remodel', budget: 65000, actual: 0 },
            { id: genId(), name: 'Flooring', budget: 45000, actual: 0 },
            { id: genId(), name: 'Painting', budget: 25000, actual: 0 },
            { id: genId(), name: 'Lighting Fixtures', budget: 18000, actual: 0 },
          ],
        },
        {
          id: genId(), name: 'Systems',
          items: [
            { id: genId(), name: 'HVAC Replacement', budget: 55000, actual: 0 },
            { id: genId(), name: 'Plumbing Updates', budget: 35000, actual: 0 },
            { id: genId(), name: 'Electrical Panel', budget: 22000, actual: 0 },
          ],
        },
        {
          id: genId(), name: 'Exterior',
          items: [
            { id: genId(), name: 'Roofing', budget: 28000, actual: 0 },
            { id: genId(), name: 'Siding / Paint', budget: 20000, actual: 0 },
            { id: genId(), name: 'Windows', budget: 18000, actual: 0 },
          ],
        },
        {
          id: genId(), name: 'Soft Costs',
          items: [
            { id: genId(), name: 'Architecture', budget: 12000, actual: 0 },
            { id: genId(), name: 'Permits', budget: 5000, actual: 0 },
          ],
        },
      ],
    },
    draws: [],
  },
];

// ─── CONTEXT ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  completeOnboarding: (name: string) => void;
  addProperty: (p: Omit<DashboardProperty, 'id' | 'createdAt' | 'draws'>) => DashboardProperty;
  updateProperty: (id: string, updates: Partial<DashboardProperty>) => void;
  updateProForma: (propertyId: string, proforma: ProForma) => void;
  updateBudget: (propertyId: string, budget: PropertyBudget) => void;
  addDraw: (propertyId: string, draw: Omit<DrawRequest, 'id' | 'number'>) => DrawRequest;
  updateDraw: (propertyId: string, drawId: string, updates: Partial<DrawRequest>) => void;
  submitDraw: (propertyId: string, drawId: string) => void;
  deleteDraw: (propertyId: string, drawId: string) => void;
  addVaultDocument: (doc: Omit<VaultDocument, 'id'>) => VaultDocument;
  updateVaultDocument: (id: string, updates: Partial<VaultDocument>) => void;
  deleteVaultDocument: (id: string) => void;
  addVaultFolder: (folder: Omit<VaultFolder, 'id' | 'createdAt'>) => VaultFolder;
  deleteVaultFolder: (id: string) => void;
  addVaultShareLink: (link: Omit<VaultShareLink, 'id' | 'token' | 'accessCount' | 'createdAt'>) => VaultShareLink;
  revokeVaultShareLink: (id: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);
const STORAGE_KEY = 'ankr_v2_state';

function loadState(): AppState {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...parsed,
        vaultDocuments: parsed.vaultDocuments || [],
        vaultFolders: parsed.vaultFolders || [],
        vaultShareLinks: parsed.vaultShareLinks || [],
      };
    }
  } catch {}
  return { onboardingComplete: true, userName: 'Demo Investor', properties: INITIAL_PROPERTIES, vaultDocuments: [], vaultFolders: [], vaultShareLinks: [] };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const completeOnboarding = (name: string) => setState(p => ({ ...p, onboardingComplete: true, userName: name || 'Investor' }));

  const addProperty = (p: Omit<DashboardProperty, 'id' | 'createdAt' | 'draws'>): DashboardProperty => {
    const np: DashboardProperty = { ...p, id: 'prop-' + Date.now(), createdAt: new Date().toISOString().split('T')[0], draws: [] };
    setState(prev => ({ ...prev, properties: [...prev.properties, np] }));
    return np;
  };

  const updateProperty = (id: string, updates: Partial<DashboardProperty>) =>
    setState(prev => ({ ...prev, properties: prev.properties.map(p => p.id === id ? { ...p, ...updates } : p) }));

  const updateProForma = (propertyId: string, proforma: ProForma) => updateProperty(propertyId, { proforma });
  const updateBudget = (propertyId: string, budget: PropertyBudget) => updateProperty(propertyId, { budget });

  const addDraw = (propertyId: string, draw: Omit<DrawRequest, 'id' | 'number'>): DrawRequest => {
    const prop = state.properties.find(p => p.id === propertyId);
    const nd: DrawRequest = { ...draw, id: 'draw-' + Date.now(), number: (prop?.draws.length ?? 0) + 1 };
    setState(prev => ({ ...prev, properties: prev.properties.map(p => p.id === propertyId ? { ...p, draws: [...p.draws, nd] } : p) }));
    return nd;
  };

  const updateDraw = (propertyId: string, drawId: string, updates: Partial<DrawRequest>) =>
    setState(prev => ({
      ...prev,
      properties: prev.properties.map(p =>
        p.id === propertyId ? { ...p, draws: p.draws.map(d => d.id === drawId ? { ...d, ...updates } : d) } : p
      ),
    }));

  const submitDraw = (propertyId: string, drawId: string) =>
    updateDraw(propertyId, drawId, { status: 'Submitted', submittedDate: new Date().toISOString().split('T')[0] });

  const deleteDraw = (propertyId: string, drawId: string) =>
    setState(prev => ({
      ...prev,
      properties: prev.properties.map(p =>
        p.id === propertyId ? { ...p, draws: p.draws.filter(d => d.id !== drawId) } : p
      ),
    }));

  const addVaultDocument = (doc: Omit<VaultDocument, 'id'>): VaultDocument => {
    const nd: VaultDocument = { ...doc, id: 'doc-' + Date.now() };
    setState(prev => ({ ...prev, vaultDocuments: [...prev.vaultDocuments, nd] }));
    return nd;
  };

  const updateVaultDocument = (id: string, updates: Partial<VaultDocument>) =>
    setState(prev => ({
      ...prev,
      vaultDocuments: prev.vaultDocuments.map(d => d.id === id ? { ...d, ...updates } : d),
    }));

  const deleteVaultDocument = (id: string) =>
    setState(prev => ({
      ...prev,
      vaultDocuments: prev.vaultDocuments.filter(d => d.id !== id),
    }));

  const addVaultFolder = (folder: Omit<VaultFolder, 'id' | 'createdAt'>): VaultFolder => {
    const nf: VaultFolder = { ...folder, id: 'folder-' + Date.now(), createdAt: new Date().toISOString().split('T')[0] };
    setState(prev => ({ ...prev, vaultFolders: [...prev.vaultFolders, nf] }));
    return nf;
  };

  const deleteVaultFolder = (id: string) =>
    setState(prev => ({
      ...prev,
      vaultFolders: prev.vaultFolders.filter(f => f.id !== id),
    }));

  const addVaultShareLink = (link: Omit<VaultShareLink, 'id' | 'token' | 'accessCount' | 'createdAt'>): VaultShareLink => {
    const nl: VaultShareLink = { ...link, id: 'link-' + Date.now(), token: genId(), accessCount: 0, createdAt: new Date().toISOString().split('T')[0] };
    setState(prev => ({ ...prev, vaultShareLinks: [...prev.vaultShareLinks, nl] }));
    return nl;
  };

  const revokeVaultShareLink = (id: string) =>
    setState(prev => ({
      ...prev,
      vaultShareLinks: prev.vaultShareLinks.map(l => l.id === id ? { ...l, isActive: false } : l),
    }));

  return (
    <AppContext.Provider value={{ state, completeOnboarding, addProperty, updateProperty, updateProForma, updateBudget, addDraw, updateDraw, submitDraw, deleteDraw, addVaultDocument, updateVaultDocument, deleteVaultDocument, addVaultFolder, deleteVaultFolder, addVaultShareLink, revokeVaultShareLink }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}