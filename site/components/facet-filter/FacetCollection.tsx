import * as React from 'react'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'
import { useRouter } from 'next/router' // For Next.js dynamic routing
import { useQuery } from '../utils/client'
import FramerModal from '../framer-modal/FramerModal'
import { formatCurrency } from '@components/utils/format-currency' // Import your formatCurrency function

const SEARCH_PRODUCTS = /* GraphQL */ `
  query SearchProducts($input: SearchInput!) {
    search(input: $input) {
      totalItems
      facetValues {
        count
        facetValue {
          id
          name
          facet {
            id
            name
          }
        }
      }
      items {
        productName
        slug
        productAsset {
          id
          preview
        }
        priceWithTax {
          ... on SinglePrice {
            value
          }
          ... on PriceRange {
            min
            max
          }
        }
        currencyCode
      }
    }
  }
`

export function Slug() {
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
  if (error) return <p>Error: {error.message}</p>

  const handleDrawerOpen = () => setIsDrawerOpen(true)
  const handleDrawerClose = () => setIsDrawerOpen(false)

  return (
    <div className="absolute top-[5rem] h-full">
      <FramerModal
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        results={data?.search?.facetValues} // Pass the results data
        filterIds={filterIds} // Pass the filterIds array
        setFilterIds={setFilterIds} // Pass the updateFilterIds function
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        {data.search.items.map(
          ({
            item,
            productId,
            productName,
            slug,
            priceWithTax,
            currencyCode,
            productAsset,
          }) => (
            <div className="break-inside-avoid flex flex-col" key={productId}>
              <Link className="flex-nowrap" href={`/products/${slug}`}>
                <img
                  className="object-cover "
                  alt=""
                  src={productAsset?.preview + '?preset=full'}
                />
                <div className="relative w-full mx-auto bottom-0 left-0">
                  <div className="text-center absolute bottom-0 left-0 w-fit h-fit bg-discogray text-white text-md p-1 font-fw300">
                    {priceWithTax?.value
                      ? formatCurrency(priceWithTax.value, currencyCode)
                      : 'Price N/A'}
                  </div>
                </div>
                <div className="text-xl p-1 text-discogray uppercase tracking-wider font-fw300 whitespace-nowrap overflow-hidden">
                  {productName}
                </div>

                <div className="text-lg p-1 font-fw600 text-discogray"></div>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  )
}

Slug.Layout = Layout
