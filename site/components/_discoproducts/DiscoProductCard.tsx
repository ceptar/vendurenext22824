import React from 'react'
import Link from 'next/link'
import { formatCurrency } from '@components/utils/format-currency'
import { ProductItem } from '@components/collections/interfaces'

interface DiscoProductCardProps {
  product: ProductItem;
}
export default function DiscoProductCard({ product }:DiscoProductCardProps) {
  const {
    productAsset,
    productName,
    slug,
    priceWithTax,
    currencyCode,
  } = product;

  return (
    <div className="break-inside-avoid flex flex-col">
      <Link
        className="flex-nowrap"
        href={`/product/${slug}`}
      >
        <img
          className="object-cover "
          alt=""
          src={productAsset?.preview + '?preset=full'}
        />
        <div className="relative w-full mx-auto bottom-0 left-0">
          <div className="text-center absolute bottom-0 left-0 w-fit h-fit bg-discogray text-white text-md p-1 font-fw300">
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

        <div className="text-lg p-1 font-fw600 text-discogray"></div>
      </Link>
    </div>
  );
}