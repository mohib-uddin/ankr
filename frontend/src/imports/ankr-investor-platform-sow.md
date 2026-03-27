
Bentadon.

info@bentadon.com
www.bentadon.com
(760) 284-7782
Statement of Work (SOW)
Project Title
Ankr – Investor Platform (V1)
Purpose of Document
This Statement of Work (SOW) defines the scope, features, responsibilities, technical approach, and assumptions for Version 1 (V1) of the Ankr platform.
V1 is intentionally scoped as an Investor‑only platform, focused on solving investor pain points around financial organization, property analysis, budgeting, and draw preparation. Other personas (Banker, Contractor, Subcontractor) are out of scope for V1 and will be considered in future phases.
This SOW represents Bentadon’s interpretation of the product requirements based on current discussions  and reference materials, including the latest clarifications provided by the client. Final scope details will be validated collaboratively to resolve ambiguities and align on implementation boundaries.
1. Product Overview (V1)
Ankr V1 is a centralized real estate investment management platform for investors.
At its core, the system:
Centralizes investor financial identity (PFS) and property data
Eliminates duplicate document creation and manual re‑entry
Provides structured, repeatable budgeting and draw workflows
Enables professional‑grade documentation sharing with lenders
Keeps the investor fully in control of decisions and submissions







V1 Operating Mode
Investor Mode only
All banker, contractor, and subcontractor portals and workflows are explicitly excluded from V1
2. User Roles & Access Model (V1)
Role
Core Responsibility
Investor
Financial owner, property owner, decision maker

The system is designed with future role expansion in mind, but no external user access is provided in V1. All sharing is handled via secure, permissioned links.
3. Investor Mode – Scope of Work (V1)
3.1 Account Creation & Guided Onboarding
Lightweight account creation (Name, Email, Phone, Address)
Progressive, step‑by‑step onboarding (no long forms)
Optional PFS initiation during onboarding
Users are encouraged to begin building their PFS
Users may skip or partially complete PFS and finish later from the dashboard
Core profile data stored once and reused across the system
3.2 Personal Financial Statement (PFS)
Capabilities
Upload existing PFS (PDF, spreadsheet, bank formats)
Manually create or complete a PFS if none exists
Basic document ingestion and structuring in V1
Advanced parsing and automation deferred to Phase 2
Single standardized PFS format reused system‑wide
PFS Data Model
Summary
Net Worth
Total Assets
Total Liabilities
Total Income
Assets
Real estate
Cash & bank accounts
Brokerage / investments
Other entity or personal assets
Liabilities
Mortgages
Loans
Credit lines
Notes payable
Assets and liabilities can be linked to properties. All data is entered once and reused system‑wide.
3.3 Investor Document Vault
Core Capabilities (Phase 1)
Secure document upload and storage
Manual organization and categorization
Secure sharing via permissioned links
Default Categories
Identity
Income
Banking
Real Estate
Debt
Tax
Entity documents
Smart Filing (V1 – Limited)
Manual document categorization
Basic metadata tagging
Advanced auto‑classification deferred to Phase 2
Custom Folders
State‑specific
Strategy‑specific
Investor‑defined organization




3.4 Document Packages & Secure Sharing
Predefined document package templates (Loan Application, Refinance, Tax Returns, Audit, etc.)
Auto‑include available PFS data and vault documents where applicable
Packages may remain incomplete until the investor chooses to finalize
System prompts users to fill missing required information only at the time of sharing
Ability to share:
Full document packages, or
A single document independently
Secure Sharing
Packages and documents shared via secure, permissioned links
Configurable expiry controls and access tracking
Investor manually emails secure links to lenders or advisors
No external user portal or login provided in V1
3.5 Property Portfolio Management
Property Creation
Manual address entry
Listing or reference link entry
Optional auto‑pulling of property data using a Zillow alternative
Automation expandable in later phases
Property Data
Property type
Square footage
Unit count
Zoning (where available)
Each property becomes a workspace containing documents, proforma, budgets, draws, and activity.
3.6 Deal Analysis & Proforma
Structured investment proforma generated per property
Inputs
Purchase price
Renovation / improvement cost
Holding assumptions
Exit assumptions
Outputs
Total investment

Sale value
Gross profit
ROI metrics
Example
Buy: $1,000,000
Rehab: $1,000,000
Sell: $4,000,000
Gross Profit: $2,000,000
3.7 Budget Creation, Allocation & Tracking (Core V1 Feature)
Single primary budget per property
Category‑based allocation (e.g., Plumbing, Electrical)
Manual entry or spreadsheet upload
Draw Logic
Draws requested against budget categories
Draw amount may exceed immediate invoices
Actual spend tracked separately
Example
Plumbing budget: $200,000
Draw taken: $200,000
Actual spend: $190,000
Savings: $10,000
The system tracks savings, overruns, and variance automatically.
3.8 Draw Packages & Secure Sharing
Standardized draw document format
Attach bills, invoices, and proofs
Secure, expiring links for sharing
Investor manually submits draw packages to lenders
3.9 Contractor Payments (Stripe Connect)
This module enables Bills.com style contractor payments directly from the platform.
Core Capabilities
Contractor invoices uploaded and managed by the investor in V1
Invoices linked to:
Property
Budget category
Associated draw (optional)


Approval Workflow
Investor reviews invoice details and attachments
Invoice actions:
Approve
Partially pay
Reject with notes
Payments & Escrow
Payments processed using Stripe Connect
Supports direct payouts to contractor bank accounts
Payments may be made:
Against approved draws
Directly from investor funds
Tracking & Audit
Full payment history per property and contractor
Invoice status tracking (Pending, Approved, Paid)
All payments auditable and exportable
Note: Contractors do not receive a full portal in V1.
4. AI Co‑Pilot (V1 – Limited)
Basic AI Co‑Pilot included in Phase 1
Provides high‑level guidance and explanations (e.g., onboarding help, terminology, next‑step suggestions)
No decision‑making, automation, or advanced analysis in V1
Full AI functionality deferred to Phase 2
5. Admin Portal & Platform Administration (V1)
Ankr V1 includes an internal Admin Portal for basic platform administration only.
5.1 Admin Access & Security
Secure admin authentication
Role‑restricted access for internal Ankr team members only
5.2 User Management
View investor accounts (basic metadata only: name, email, status)
Activate / deactivate investor access
Assist with onboarding or access issues
Reset credentials


Admins do NOT have access to:
Investor PFS data
Documents or document contents
Properties, budgets, draws, or payments
5.3 Template Management
Manage document package templates
Define required vs optional fields
Configure PFS field auto‑population
Enable / disable templates
5.4 Platform Configuration
Manage secure link defaults (expiry duration, access limits)
Configure allowed file types and size limits
Basic system‑level settings
6. Technical Architecture (V1)
Frontend: Next.js
Backend: NestJS
Document Services: Secure storage, basic parsing, and link generation
Payments: Stripe Connect–based contractor payments
7. Phases & Milestones
The project will be delivered over an 8–10 week timeline, structured into execution milestones while remaining a continuous build.
Milestone 1 – UX / Product Design
Product discovery & requirement validation
Investor workflows and user journeys
Wireframes for core modules (PFS, Properties, Budgets, Payments)
High‑fidelity UI designs
Design handover to engineering
Milestone 2 – Frontend Implementation
Next.js application setup
Investor dashboard
Onboarding & optional PFS initiation
Document vault and package UI
Property, budget, draw, and payment screens


Responsive UI implementation
API connectivity
Milestone 3 – Backend Development
NestJS backend setup
Authentication & authorization
Core business logic (PFS, properties, budgets, draws)
Secure document storage and sharing
Stripe Connect payment workflows
Database schema & integrations
Security and performance considerations
Milestone 4 – QA & Testing
Functional testing across investor workflows
Regression testing
Bug fixing and validation
Production readiness checks

