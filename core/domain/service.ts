export type ServiceId = string;

export interface Service {
  id: ServiceId;
  slug: string;
  title: string;
  titleAr?: string | null;
  description: string;
  descriptionAr?: string | null;
  featured: boolean;
  order: number;
  icon?: string | null;
  features?: string[];
  featuresAr?: string[];
}
