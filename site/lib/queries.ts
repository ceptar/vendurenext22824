// lib/queries.ts

export const GET_ALL_COLLECTIONS = /* GraphQL */ `
  query GetAllCollections {
    collections {
      slug
    }
  }
`;

export const GET_COLLECTION_PRODUCTS = /* GraphQL */ `
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
        take: $take
      }
    ) {
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
`;
