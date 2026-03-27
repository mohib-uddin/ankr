import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { DashboardLayout } from '@/features/dashboard/DashboardLayout';
import { DashboardHome } from '@/features/dashboard/DashboardHome';
import { PropertiesPage } from '@/features/properties/PropertiesPage';
import { PropertyDetailPage } from '@/features/properties/PropertyDetailPage';
import { AddPropertyPage } from '@/features/properties/AddPropertyPage';
import { PFSStub } from '@/features/dashboard/PFSStub';
import { PublicDrawView } from '@/features/draws/PublicDrawView';
import { ProjectFinancialStatement } from '@/features/properties/ProjectFinancialStatement';
import { DashboardRedirect } from '@/features/dashboard/DashboardRedirect';
import { NewDrawRequestPage } from '@/features/draws/NewDrawRequestPage';
import { DrawDetailPage } from '@/features/draws/DrawDetailPage';
import { EditProFormaPage } from '@/features/properties/EditProFormaPage';
import { DocumentVault } from '@/features/dashboard/DocumentVault';
import { InvoicesPage } from '@/features/invoices/InvoicesPage';
import { InvoiceDetailPage } from '@/features/invoices/InvoiceDetailPage';
import { InvoicePaidPage } from '@/features/invoices/InvoicePaidPage';
import { PublicVaultView } from '@/features/vault/PublicVaultView';
import { LoginPage } from '@/features/auth/LoginPage';
import { SignupPage } from '@/features/auth/SignupPage';
import { ProfileSetupPage } from '@/features/auth/ProfileSetupPage';
import { OnboardingPage } from '@/features/onboarding/OnboardingPage';
import { UploadPfsPage } from '@/features/onboarding/UploadPfsPage';
import { UploadPfsSummaryPage } from '@/features/onboarding/UploadPfsSummaryPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/signup',
    Component: SignupPage,
  },
  {
    path: '/profile-setup',
    Component: ProfileSetupPage,
  },
  {
    path: '/onboarding',
    Component: OnboardingPage,
  },
  {
    path: '/onboarding/upload',
    Component: UploadPfsPage,
  },
  {
    path: '/onboarding/upload-summary',
    Component: UploadPfsSummaryPage,
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
]);
