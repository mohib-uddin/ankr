export enum UserPackageStatus {
  DRAFT = 'Draft',
  FINALIZED = 'Finalized',
}

export interface UserPackageDocument {
  templateId: string;
  templateItemId: string;
  documentId: string;
}
