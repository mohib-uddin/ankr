import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { PackageTemplate } from 'src/package-templates/entities/package-template.entity';
import { DocumentCategoryEnum } from 'src/documents/types/category.enum';

export default class PackageTemplateSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<any> {
    const repository = dataSource.getRepository(PackageTemplate);

    const templates = [
      {
        name: 'Loan Application',
        description: 'Standard package for new loan applications including identity, income, banking, and tax documentation.',
        items: [
          {
            id: '7f9c2d1b-3a5e-4b7d-8c1a-9f5e2d1b3a5e',
            name: 'Government-Issued ID',
            description: 'Valid photo ID (passport, driver\'s license)',
            category: DocumentCategoryEnum.IDENTITY,
            minCount: 1,
            maxCount: 1
          },
          {
            id: '8a1b2c3d-4e5f-6a7b-8c9d-0e1f2a3b4c5d',
            name: 'W-2 or 1099 Forms',
            description: 'Most recent tax year W-2s or 1099s',
            category: DocumentCategoryEnum.INCOME,
            minCount: 1,
            maxCount: 3
          },
          {
            id: '9b2c3d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e',
            name: 'Bank Statements (3 months)',
            description: 'Last 3 months of all bank account statements',
            category: DocumentCategoryEnum.BANKING,
            minCount: 3,
            maxCount: 3
          },
          {
            id: '0c3d4e5f-6a7b-8c9d-0e1f-2a3b4c5d6e7f',
            name: 'Tax Returns (2 years)',
            description: 'Federal tax returns for the past 2 years',
            category: DocumentCategoryEnum.TAX,
            minCount: 2,
            maxCount: 2
          },
          {
            id: '1d4e5f6a-7b8c-9d0e-1f2a-3b4c5d6e7f8g',
            name: 'Personal Financial Statement',
            description: 'Current personal financial statement (PFS)',
            category: DocumentCategoryEnum.BANKING,
            minCount: 1,
            maxCount: 1
          }
        ]
      },
      {
        name: 'Refinance Package',
        description: 'Required documents for refinancing an existing property loan with updated valuations.',
        items: [
          {
            id: '2e5f6a7b-8c9d-0e1f-2a3b-4c5d6e7f8g9h',
            name: 'Current Loan Note',
            description: 'Copy of existing loan note and terms',
            category: DocumentCategoryEnum.DEBT,
            minCount: 1,
            maxCount: 1
          },
          {
            id: '3f6a7b8c-9d0e-1f2a-3b4c-5d6e7f8g9h0i',
            name: 'Property Appraisal',
            description: 'Recent property appraisal report',
            category: DocumentCategoryEnum.REAL_ESTATE,
            minCount: 1,
            maxCount: 1
          },
          {
            id: '4a7b8c9d-0e1f-2a3b-4c5d-6e7f8g9h0i1j',
            name: 'Title Report',
            description: 'Current title search and report',
            category: DocumentCategoryEnum.REAL_ESTATE,
            minCount: 1,
            maxCount: 1
          },
          {
            id: '5b8c9d0e-1f2a-3b4c-5d6e-7f8g9h0i1j2k',
            name: 'Income Verification',
            description: 'Proof of income (pay stubs, employment letter)',
            category: DocumentCategoryEnum.INCOME,
            minCount: 1,
            maxCount: 2
          },
          {
            id: '6c9d0e1f-2a3b-4c5d-6e7f-8g9h0i1j2k3l',
            name: 'Existing Loan Documents',
            description: 'Original closing docs and loan agreement',
            category: DocumentCategoryEnum.DEBT,
            minCount: 1,
            maxCount: 5
          }
        ]
      },
      {
        name: 'Tax Returns Package',
        description: 'Complete tax return package for comprehensive lender financial review.',
        items: [
          {
            id: '7d0e1f2a-3b4c-5d6e-7f8g-9h0i1j2k3l4m',
            name: 'Personal Tax Returns (2 years)',
            description: 'IRS Form 1040 with all schedules for 2 years',
            category: DocumentCategoryEnum.TAX,
            minCount: 2,
            maxCount: 2
          },
          {
            id: '8e1f2a3b-4c5d-6e7f-8g9h-0i1j2k3l4m5n',
            name: 'Entity Tax Returns (2 years)',
            description: 'Business/entity returns (1065, 1120S, etc.)',
            category: DocumentCategoryEnum.TAX,
            minCount: 2,
            maxCount: 2
          },
          {
            id: '9f2a3b4c-5d6e-7f8g-9h0i-1j2k3l4m5n6o',
            name: 'K-1 Schedules',
            description: 'All K-1 schedules from partnerships/S-corps',
            category: DocumentCategoryEnum.TAX,
            minCount: 1,
            maxCount: 10
          },
          {
            id: '0a3b4c5d-6e7f-8g9h-0i1j-2k3l4m5n6o7p',
            name: 'Extension Letters',
            description: 'IRS extension confirmations (if applicable)',
            category: DocumentCategoryEnum.TAX,
            minCount: 0,
            maxCount: 2
          }
        ]
      },
      {
        name: 'Audit / Compliance',
        description: 'Full documentation for compliance audits, due diligence, and regulatory review.',
        items: [
          {
            id: '1b4c5d6e-7f8g-9h0i-1j2k-3l4m5n6o7p8q',
            name: 'Financial Statements',
            description: 'Audited or prepared financial statements',
            category: DocumentCategoryEnum.BANKING,
            minCount: 1,
            maxCount: 1
          },
          {
            id: '2c5d6e7f-8g9h-0i1j-2k3l-4m5n6o7p8q9r',
            name: 'Corporate Documents',
            description: 'Operating agreement, articles of org/inc',
            category: DocumentCategoryEnum.ENTITY,
            minCount: 1,
            maxCount: 5
          },
          {
            id: '3d6e7f8g-9h0i-1j2k-3l4m-5n6o7p8q9r0s',
            name: 'Bank Records',
            description: '12 months of complete bank records',
            category: DocumentCategoryEnum.BANKING,
            minCount: 1,
            maxCount: 12
          },
          {
            id: '4e7f8g9h-0i1j-2k3l-4m5n-6o7p8q9r0s1t',
            name: 'Tax Filings',
            description: 'All federal and state tax filings',
            category: DocumentCategoryEnum.TAX,
            minCount: 1,
            maxCount: 4
          },
          {
            id: '5f8g9h0i-1j2k-3l4m-5n6o-7p8q9r0s1t2u',
            name: 'Insurance Certificates',
            description: 'Current insurance certificates of coverage',
            category: DocumentCategoryEnum.ENTITY,
            minCount: 1,
            maxCount: 5
          },
          {
            id: '6a9h0i1j-2k3l-4m5n-6o7p-8q9r0s1t2u3v',
            name: 'Government ID',
            description: 'Photo identification for all principals',
            category: DocumentCategoryEnum.IDENTITY,
            minCount: 1,
            maxCount: 1
          }
        ]
      }
    ];

    for (const template of templates) {
      const existing = await repository.findOne({ where: { name: template.name } });
      if (existing) {
        existing.items = template.items;
        await repository.save(existing);
      } else {
        await repository.save(repository.create(template));
        console.log(`Package Template seeded: ${template.name}`);
      }
    }
  }
}
