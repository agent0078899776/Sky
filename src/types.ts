export interface ProductRec {
  model: string;
  image: string;
  dimensions: string;
  tempRange: string;
  contactForm: string;
  vibration: string;
  contactLoad: string;
  benchmarking: string;
  schematic?: string; // zoomed schematic layout path/info
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
