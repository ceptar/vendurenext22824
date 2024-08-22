import React from 'react'

// VENDURESHOPAPI
const API_URL = '/vendure-shop-api' || 'https://discobabes.store/shop-api'

let languageCode: string | undefined
let channelToken: string | undefined

export function setLanguageCode(value: string | undefined) {
  languageCode = value
}

export function setChannelToken(value: string | undefined) {
  channelToken = value
}

export function query(document: string, variables: Record<string, any> = {}) {
  const headers = new Headers({
    'content-type': 'application/json',
  })

  // Optionally, add the channelToken to the headers if available
  if (channelToken) {
    headers.append('vendure-token', channelToken)
  }

  let endpoint = API_URL
  if (languageCode) {
    endpoint += `?languageCode=${languageCode}`
  }

  return fetch(endpoint, {
    method: 'POST',
    headers,
    credentials: 'include', // Ensure that cookies are included in the request
    body: JSON.stringify({
      query: document,
      variables,
    }),
  }).then((res) => {
    if (!res.ok) {
      throw new Error(`An error occurred, HTTP status: ${res.status}`)
    }
    console.log('res', res)
    return res.json()
  })
}

/**
 * React hook for running GraphQL queries
 */
export function useQuery(
  document: string,
  variables: Record<string, any> = {},
  deps: any[] = []
) {
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null); // Store the entire error object

  React.useEffect(() => {
    query(document, variables)
      .then((result) => {
        setData(result.data);
        setError(null);
      })
      .catch((err) => {
        setError(err); // Store the entire error object here
        setData(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, deps);

  return { data, loading, error };
}