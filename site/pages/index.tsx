import * as React from 'react'
import commerce from '@lib/api/commerce'
import { GET_COLLECTION_PRODUCTS } from '@lib/queries'
import { query, useQuery } from '@components/utils/clientOne'
import { Layout } from '@components/common'
import { ProductCard } from '@components/product'
import { Grid, Marquee, Hero } from '@components/ui'
import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next'

export async function getStaticProps({
  preview,
  locale,
  locales,
}: GetStaticPropsContext) {
  const config = { locale, locales }

  // Fetch products (these could be general products)
  const productsPromise = commerce.getAllProducts({
    variables: { last: 6 },
    config,
    preview,
    ...({ featured: true } as any),
  })


  // Fetch other site information
  const pagesPromise = commerce.getAllPages({ config, preview })
  const siteInfoPromise = commerce.getSiteInfo({ config, preview })

  const { products } = await productsPromise
  const { pages } = await pagesPromise
  const { categories, brands } = await siteInfoPromise

  return {
    props: {
      products,
      featured: true, // Pass the featured items
      categories,
      brands,
      pages,
    },
    revalidate: 60,
  }
}

export default function Home({
  products,
}: InferGetStaticPropsType<typeof getStaticProps>) {

  const [slug, setSlug] = React.useState('featured-items');
  const { data, loading, error } = useQuery(
    GET_COLLECTION_PRODUCTS,
    {
      slug: slug,
      skip: 0,
      take: 10,
    },
    [slug]
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      <div className="bg-hero" aria-label="[hero1]">
        <div className="relative h-[100vh] flex justify-end sm:justify-start items-end px-[0.8rem]">
          <div className="mb-32 mr-auto sm:w-full ">
            <div className="pr-[1.6rem] w-[80vw] md:w-[calc(50vw-0.8rem)]">
              <div className="filter p-[0.8rem] mix-blend-lighten border-[1px] border-secondary backdrop-blur-[4px]">
                <div className="filter p-[0.8rem] bg-primary bg-opacity-100 mix-blend-lighten border-[1px] border-secondary backdrop-blur-[4px]">
                  <span className="font-fw300 tracking-[0.08em] uppercase text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
                    <p className="py-1">life's too short</p>
                    <p>to wear</p>
                    <p className="py-1">boring jewelry</p>
                  </span>
                  <div className="flex flex-row-reverse font-fw300 tracking-[0.25em] uppercase text-2xl sm:text-4xl lg:text-5xl xl:text-7xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[100vw] h-[calc(100vh-5rem)] relative"></div>

      <Grid className="mt-[5rem]" variant="default">
      {data.search.items.map(({ productName, slug, productAsset }) => (          
        <div key={productName}>
        <h3>{productName}</h3>
        <img
          src={`${productAsset.preview}?preset=tiny`}
          alt={productName}
        />
      </div>
    ))}

      </Grid>
      {/* <Marquee className="mt-[5rem]" variant="secondary">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee>
      <Hero className="mt-[5rem]" 
        headline=" Dessert dragée halvah croissant."
        description="Cupcake ipsum dolor sit amet lemon drops pastry cotton candy. Sweet carrot cake macaroon bonbon croissant fruitcake jujubes macaroon oat cake. Soufflé bonbon caramels jelly beans. Tiramisu sweet roll cheesecake pie carrot cake. "
      />
      <Grid className="mt-[5rem]" layout="B" variant="filled">
        {products.slice(0, 3).map((product: any, i: number) => (
          <ProductCard
            key={product.id}
            product={product}
            imgProps={{
              alt: product.name,
              width: i === 0 ? 365 : 734,
              height: i === 0 ? 660 :1322,
            }}
          />
        ))}
      </Grid>
      <Marquee className="mt-[5rem]" >
        {products.slice(3).map((product: any, i: number) => (
          <ProductCard key={product.id} product={product} variant="slim" />
        ))}
      </Marquee> */}
      {/* <CollectionTree /> */}
      {/* <HomeAllProductsGrid
        newestProducts={products}
        categories={categories}
        brands={brands}
      /> */}
    </>
  )
}

Home.Layout = Layout