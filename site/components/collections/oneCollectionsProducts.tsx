import * as React from 'react';
import { query, useQuery } from '@components/utils/client';
import { GET_ONE_COLLECTIONS_PRODUCTS } from '@lib/queries';


interface ProductAsset {
    id: string;
    preview: string;
  }
  
interface PriceWithTax {
    value?: number;
    min?: number;
    max?: number;
  }
  
interface ProductItem {
    productName: string;
    slug: string;
    productAsset: ProductAsset;
    priceWithTax: PriceWithTax;
    currencyCode: string;
  }
  
interface Collection {
    id: string;
    name: string;
    description: string;
    featuredAsset?: ProductAsset | null;
  }
  
interface SearchResults {
    totalItems: number;
    items: ProductItem[];
  }
export default function GetOneCollectionsProducts() {
 
    const { data, loading, error } = useQuery(
        GET_ONE_COLLECTIONS_PRODUCTS,
      {
        slug: 'featured-items',
        skip: 0,
        take: 10,
      },
      []
    );
  console.log('featured', data);
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error : {error.message}</p>;
  
    return (
      <div>
        <h1>{data.collection.name}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {data.search.items.map(({ productName, slug, productAsset }) => (
            <div key={productName}>
              <h3>{productName}</h3>
              <img
                src={`${productAsset.preview}?preset=tiny`}
                alt={productName}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

