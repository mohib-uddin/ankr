import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { DashboardLayout } from '@/features/dashboard/components/DashboardLayout';
import { DashboardHome } from '@/features/dashboard/pages/DashboardHome';
import { PropertiesPage } from '@/features/properties/pages/PropertiesPage';
import { PropertyDetailPage } from '@/features/properties/pages/PropertyDetailPage';
import { AddPropertyPage } from '@/features/properties/pages/AddPropertyPage';
import { PFSStub } from '@/features/dashboard/pages/PFSStub';
import { PublicDrawView } from '@/features/draws/pages/PublicDrawView';
import { ProjectFinancialStatement } from '@/features/properties/pages/ProjectFinancialStatement';
import { DashboardRedirect } from '@/features/dashboard/pages/DashboardRedirect';
import { NewDrawRequestPage } from '@/features/draws/pages/NewDrawRequestPage';
import { DrawDetailPage } from '@/features/draws/pages/DrawDetailPage';
import { EditProFormaPage } from '@/features/properties/pages/EditProFormaPage';
import { DocumentVault } from '@/features/dashboard/pages/DocumentVault';
import { InvoicesPage } from '@/features/invoices/pages/InvoicesPage';
import { InvoiceDetailPage } from '@/features/invoices/pages/InvoiceDetailPage';
import { InvoicePaidPage } from '@/features/invoices/pages/InvoicePaidPage';
import { PublicVaultView } from '@/features/vault/pages/PublicVaultView';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SignupPage } from '@/features/auth/pages/SignupPage';
import { ProfileSetupPage } from '@/features/auth/pages/ProfileSetupPage';
import { OnboardingPage } from '@/features/onboarding/pages/OnboardingPage';
import { UploadPfsPage } from '@/features/onboarding/pages/UploadPfsPage';
import { UploadPfsSummaryPage } from '@/features/onboarding/pages/UploadPfsSummaryPage';
import { GuestOnly } from '@/features/auth/components/GuestOnly';
import { RequireAuth } from '@/features/auth/components/RequireAuth';

export const router = createBrowserRouter([
  {
    Component: GuestOnly,
    children: [
      { path: '/login', Component: LoginPage },
      { path: '/signup', Component: SignupPage },
    ],
  },
  {
    path: '/share/draw/:token',
    Component: PublicDrawView,
  },
  {
    path: '/share/vault/:token',
    Component: PublicVaultView,
  },
  {
    Component: RequireAuth,
    children: [
      { path: '/profile-setup', Component: ProfileSetupPage },
      { path: '/onboarding', Component: OnboardingPage },
      { path: '/onboarding/upload', Component: UploadPfsPage },
      { path: '/onboarding/upload-summary', Component: UploadPfsSummaryPage },
      {
        path: '/',
        Component: Root,
        children: [
          { index: true, Component: DashboardRedirect },
          {
            path: 'dashboard',
            Component: DashboardLayout,
            children: [
              { index: true, Component: DashboardHome },
              { path: 'properties', Component: PropertiesPage },
              { path: 'properties/new', Component: AddPropertyPage },
              { path: 'properties/:id', Component: PropertyDetailPage },
              { path: 'properties/:id/proforma/edit', Component: EditProFormaPage },
              { path: 'properties/:id/draws/new', Component: NewDrawRequestPage },
              { path: 'properties/:id/draws/:drawId', Component: DrawDetailPage },
              { path: 'properties/:id/pfs', Component: ProjectFinancialStatement },
              { path: 'documents', Component: DocumentVault },
              { path: 'invoices', Component: InvoicesPage },
              { path: 'invoices/paid', Component: InvoicePaidPage },
              { path: 'invoices/:invoiceId', Component: InvoiceDetailPage },
              { path: 'pfs', Component: PFSStub },
            ],
          },
          { path: '*', Component: DashboardRedirect },
        ],
      },
    ],
  },
]);
