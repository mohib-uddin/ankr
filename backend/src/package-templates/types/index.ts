export interface PackageTemplateItem {
  id: string; // Should be a uniquely generated UUID
  name: string;
  description: string;
  category: string;
  minCount: number;
  maxCount: number;
}
