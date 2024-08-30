// lib/queries.ts

export const GET_ALL_COLLECTIONS = /* GraphQL */ `
    collections {
      items {
        id
        name
        slug
        parent {
          id
          name
          slug
        }
      }
    }

`;

export const GET_COLLECTION_PRODUCTS = /*GraphQL*/ `
query GetCollectionProducts($slug: String!, $skip: Int!, $take: Int!) {
  collection(slug: $slug) {
    id
    name
    description
    featuredAsset {
      id
      preview
    }
  }
  search(
    input: {
      collectionSlug: $slug,
      groupByProduct: true,
      skip: $skip,
      take: $take }
  ) {
    totalItems
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
`;

export const SEARCH_PRODUCTS = /* GraphQL */ `
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
        id
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
`;