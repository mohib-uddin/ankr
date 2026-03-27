import { createBrowserRouter } from 'react-router';
import { Root } from './Root';
import { DashboardLayout } from './components/dashboard/DashboardLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { PropertiesPage } from './components/properties/PropertiesPage';
import { PropertyDetailPage } from './components/properties/PropertyDetailPage';
import { AddPropertyPage } from './components/properties/AddPropertyPage';
import { PFSStub } from './components/dashboard/PFSStub';
import { PublicDrawView } from './components/draws/PublicDrawView';
import { ProjectFinancialStatement } from './components/properties/ProjectFinancialStatement';
import { DashboardRedirect } from './components/DashboardRedirect';
import { NewDrawRequestPage } from './components/draws/NewDrawRequestPage';
import { DrawDetailPage } from './components/draws/DrawDetailPage';
import { EditProFormaPage } from './components/properties/EditProFormaPage';
import { DocumentVault } from './components/dashboard/DocumentVault';
import { InvoicesPage } from './components/invoices/InvoicesPage';
import { InvoiceDetailPage } from './components/invoices/InvoiceDetailPage';
import { InvoicePaidPage } from './components/invoices/InvoicePaidPage';
import { PublicVaultView } from './components/vault/PublicVaultView';
import { LoginPage } from './components/auth/LoginPage';
import { SignupPage } from './components/auth/SignupPage';
import { ProfileSetupPage } from './components/auth/ProfileSetupPage';
import { OnboardingPage } from './components/onboarding/OnboardingPage';
import { UploadPfsPage } from './components/onboarding/UploadPfsPage';

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