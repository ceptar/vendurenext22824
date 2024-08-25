import type {
    GetStaticPathsContext,
    GetStaticPropsContext,
    InferGetStaticPropsType,
  } from 'next'

  import commerce from '@lib/api/commerce'

import * as React from 'react'
import { Layout } from '@components/common'
import Link from 'next/link'
import { useDebounce } from 'use-debounce'
import { useRouter } from 'next/router'
import { useQuery } from '@components/utils/client'
import FramerModal from '@components/framer-modal/FramerModal'
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

export default function Slug() {
  const [value, setValue] = React.useState('')
  const [filterIds, setFilterIds] = React.useState<string[]>([])
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)
  const router = useRouter()
  const { slug } = router.query

  const [term] = useDebounce(value, 300)

  const { data, loading, error } = useQuery(
    SEARCH_PRODUCTS,
    {
      input: {
        term,
        collectionSlug: slug,
        groupByProduct: true,
        skip: 0,
        take: 10,
        facetValueFilters: filterIds.map((id) => ({ and: id })),
      },
    },
    [term, filterIds, slug]
  )

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  const handleDrawerOpen = () => setIsDrawerOpen(true)
  const handleDrawerClose = () => setIsDrawerOpen(false)

  return (
    <div className="w-full">
    <div className="relative my-[5rem] h-full">
      <FramerModal
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        results={data?.search?.facetValues}
        filterIds={filterIds}
        setFilterIds={setFilterIds}
      />

      <div className="relative columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4 [&>img:not(:first-child)]:mt-4">
        {data.search.items.map(
          ({ productName, slug, priceWithTax, currencyCode, productAsset }) => (
            <div className="relative break-inside-avoid flex flex-col" key={slug}>
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
                  <div className="text-center absolute bottom-0 left-0 w-fit h-fit bg-primary text-primary text-md p-1 font-fw300">
                    {priceWithTax?.value
                      ? formatCurrency(priceWithTax.value, currencyCode)
                      : priceWithTax?.min &&
                        priceWithTax?.min === priceWithTax?.max
                      ? formatCurrency(priceWithTax.min, currencyCode)
                      : 'Price N/A'}
                  </div>
                </div>
                <div className="text-xl p-1 text-primary uppercase tracking-wider font-fw300 whitespace-nowrap overflow-hidden">
                  {productName}
                </div>
              </Link>
            </div>
          )
        )}
      </div>
      </div>
    </div>
  )
}
  
Slug.Layout = Layout
  