// ./interfaces/index.ts (or another file of your choice)

export interface ProductAsset {
    id: string;
    preview: string;
  }
  
  export interface PriceWithTax {
    value?: number;
    min?: number;
    max?: number;
  }
  
  export interface ProductItem {
    productName: string;
    slug: string;
    productAsset: ProductAsset;
    priceWithTax: PriceWithTax;
    currencyCode: string;
  }
  
  export interface Collection {
    id: string;
    name: string;
    description: string;
    featuredAsset?: ProductAsset | null;
  }
  
  export interface SearchResults {
    totalItems: number;
    items: ProductItem[];
  }
  
  export interface GetOneCollectionsProductsData {
    collection: Collection;
    search: SearchResults;
  }