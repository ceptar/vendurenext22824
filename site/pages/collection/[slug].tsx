import * as React from 'react';
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next';
import { useQuery } from '@components/utils/clientTwo'; // Adjust path as needed
import { GET_COLLECTION_PRODUCTS, SEARCH_PRODUCTS } from '@lib/queries'; // Adjust path as needed
import FramerModal from '@components/framer-modal/FramerModal';
import Link from 'next/link';
import { formatCurrency } from '@components/utils/format-currency';
import { useDebounce } from 'use-debounce';

interface ProductAsset {
  id: string;
  preview: string;
}

interface PriceWithTax {
  value?: number;
  min?: number;
  max?: number;
}

interface SearchItem {
  productName: string;
  slug: string;
  productAsset?: ProductAsset;
  priceWithTax?: PriceWithTax;
  currencyCode: string;
}

interface CollectionPageProps {
  collection: {
    id: string;
    name: string;
    description: string;
    featuredAsset?: ProductAsset;
  };
  products: SearchItem[];
  totalItems: number;
  facetValues: any[]; // Define according to your facetValues structure
}

export default function Slug(){
  const [value, setValue] = React.useState('')
  const [filterIds, setFilterIds] = React.useState<string[]>([])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  // Get slug from the URL (Next.js example)
  const router = useRouter()
  const { slug } = router.query // The collection slug

  // Debounce the search input to avoid excessive API calls
  const [term] = useDebounce(value, 300)

  // Combine collection slug and search term in the GraphQL query
  const { data, loading, error } = useQuery(
    SEARCH_PRODUCTS,
    {
      input: {
        term,
        collectionSlug: slug, // Include collectionSlug in the search
        groupByProduct: true,
        skip: 0,
        take: 10,
        facetValueFilters: filterIds.map((id) => ({ and: id })),
      },
    },
    [term, filterIds, slug] // Ensure the query re-runs when term, filters, or slug change
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error{}</p>

  const handleDrawerOpen = () => setIsDrawerOpen(true)
  const handleDrawerClose = () => setIsDrawerOpen(false)

  return (
    <div className="relative my-[5rem] h-full w-full p-4">
      <FramerModal
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        results={data?.search?.facetValues} // Pass the results data
        filterIds={filterIds} // Pass the filterIds array
        setFilterIds={setFilterIds} // Pass the updateFilterIds function
      />
<div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.search.items.map(
          ({
            productName,
            slug,
            priceWithTax,
            currencyCode,
            productAsset,
          }: SearchItem) => (

        
            <div className="break-inside-avoid object-cover w-full mb-4" key={slug}>
              <Link
                className="flex-nowrap"
                prefetch={false}
                href={`/product/${slug}`}
              >
                <img
                  className="object-cover"
                  alt={productName}
                  src={productAsset?.preview + '?preset=full'}
                />
                <div className="relative w-full mx-auto bottom-0 left-0">
                  <div className="text-center absolute bottom-0 left-0 w-fit h-fit bg-secondary text-secondary text-md p-1 font-fw300">
                    {priceWithTax?.value
                      ? formatCurrency(priceWithTax.value, currencyCode)
                      : priceWithTax?.min &&
                        priceWithTax?.min === priceWithTax?.max
                      ? formatCurrency(priceWithTax.min, currencyCode)
                      : 'Price N/A'}
                  </div>
                </div>
                <div className="text-xl p-1 text-secondary uppercase tracking-wider font-fw300 whitespace-nowrap overflow-hidden">
                  {productName}
                </div>
              </Link>
            </div>
 

          )


        )}
                    </div>
</div>
  )
}

Slug.Layout = Layout;
