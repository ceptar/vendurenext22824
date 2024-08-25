import * as React from 'react'
import { useDebounce } from 'use-debounce'
import { useQuery } from '../utils/client'
import FramerModal from '../framer-modal/FramerModal'

const SEARCH_PRODUCTS = /*GraphQL*/ `
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

export default function FacetNew() {
  const [value, setValue] = React.useState('')
  const [filterIds, setFilterIds] = React.useState<string[]>([])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false) // Drawer open/closed state
  const [term] = useDebounce(value, 300)
  const { data, loading, error } = useQuery(
    SEARCH_PRODUCTS,
    {
      input: {
        term,
        groupByProduct: true,
        skip: 0,
        take: 10,
        facetValueFilters: filterIds.map((id) => ({ and: id })),
      },
    },
    [term, filterIds]
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error : {error.message}</p>

  const handleDrawerOpen = () => setIsDrawerOpen(true)
  const handleDrawerClose = () => setIsDrawerOpen(false)

  return (
    <div className="absolut top-[5rem] h-full">
      <FramerModal
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        results={data.search.facetValues} // Pass the results data
        filterIds={filterIds} // Pass the filterIds array
        setFilterIds={setFilterIds} // Pass the updateFilterIds function
      />

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
  )
}
