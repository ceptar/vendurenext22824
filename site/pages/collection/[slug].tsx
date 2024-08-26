import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
} from 'next'
import { useRouter } from 'next/router'
import commerce from '@lib/api/commerce'
import { Layout } from '@components/common'
import { GetServerSideProps } from 'next';
import { query, useQuery } from '@components/utils/client'; // Adjust path as needed
import { GET_COLLECTION_PRODUCTS } from '@lib/queries'; // Adjust path as needed
import FramerModal from '@components/framer-modal/FramerModal';
import Link from 'next/link';
import React from 'react';
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

export const getServerSideProps: GetServerSideProps<CollectionPageProps> = async ({ params }) => {
  const slug = params?.slug as string; // Ensure `slug` is treated as a string

  if (!slug) {
    return { notFound: true };
  }

  const { data } = await query(GET_COLLECTION_PRODUCTS, {
    slug,
    skip: 0,
    take: 10,
  });

  if (!data) {
    return { notFound: true };
  }

  return {
    props: {
      collection: data.collection,
      products: data.search.items,
      totalItems: data.search.totalItems,
      facetValues: data.search.facetValues,
    },
  };
};

const CollectionPage: React.FC<CollectionPageProps> = ({
  collection,
  products,
  facetValues,
}) => {
  const [value, setValue] = React.useState('');
  const [filterIds, setFilterIds] = React.useState<string[]>([]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const router = useRouter();
  const { slug } = router.query;

  const [term] = useDebounce(value, 300);

  const { data, loading, error } = useQuery(
    GET_COLLECTION_PRODUCTS,
    {
      slug: slug || '',
      skip: 0,
      take: 10,
      facetValueFilters: filterIds.map((id) => ({ and: id })),
    },
    [term, filterIds, slug]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDrawerOpen = () => setIsDrawerOpen(true);
  const handleDrawerClose = () => setIsDrawerOpen(false);

  return (
    <div className="relative my-[5rem] h-full">
      <FramerModal
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        results={data?.search?.facetValues || facetValues}
        filterIds={filterIds}
        setFilterIds={setFilterIds}
      />

      <div className="columns-1 gap-4 sm:columns-2 md:columns-3 xl:columns-4 [&>img:not(:first-child)]:mt-4">
        {data?.search.items.map(
          ({
            productName,
            slug,
            priceWithTax,
            currencyCode,
            productAsset,
          }: SearchItem) => (
            <div className="break-inside-avoid flex flex-col" key={slug}>
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
                <div className="text-xl p-1 text-discogray uppercase tracking-wider font-fw300 whitespace-nowrap overflow-hidden">
                  {productName}
                </div>
              </Link>
            </div>
          )
        )}
      </div>
    </div>
  );
};

CollectionPage.Layout = Layout;

export default CollectionPage;
