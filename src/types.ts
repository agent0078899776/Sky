export interface ProductRec {
  model: string;
  image: string;
  benchmarking: string;
  schematic?: string; // zoomed schematic layout path/info

  // Electromagnetic/RF relays standard fields
  dimensions?: string;
  tempRange?: string;
  contactForm?: string;
  vibration?: string;
  contactLoad?: string;

  // Plastic photorelays fields
  packageStyle?: string;
  outputGroups?: string;
  outputVoltage?: string;
  outputCurrent?: string;
  onResistance?: string;
}

export interface CatalogCategory {
  id: string;
  name: string;
  subheading?: string;
  products: ProductRec[];
}

export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  selectedModels: string[];
}
